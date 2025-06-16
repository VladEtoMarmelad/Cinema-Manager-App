import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getSession } from 'next-auth/react';
import { sendFilmTicketMail } from '@/nodemailer';
import { fromDBTimeFormat } from '@/dateConverter';
import axios from 'axios';

export const rentCinemaSeat = createAsyncThunk("filmSession/rentSeat", async (data) => {
    const session = await getSession()
    console.log(session)
    if (session ? true : false) {
        const {prevSeats, rowIndex, seatIndex, filmSessionId} = data

        let filmSession = await axios.get(`http://127.0.0.1:8000/filmSessions/${filmSessionId}/`)
        filmSession = filmSession.data

        filmSession.sessionTime = fromDBTimeFormat(filmSession.sessionTime)

        let film = await axios.get(filmSession.film)
        film = film.data

        sendFilmTicketMail({
            recipientEmail: session.user.email,
            subject: `Билет на фильм "${film.name}"`,
            mainInfo: `Вы купили место на фильм "${film.name}"`,
            seat: prevSeats.seats[rowIndex][seatIndex],
            row: rowIndex,
            time: filmSession.sessionTime
        })

        let newSeats = prevSeats.seats.map(row => [...row]);

        const prevSeatNumber = Number( newSeats[rowIndex][seatIndex].slice(1) )
        const prevSeatType = newSeats[rowIndex][seatIndex].slice(0, -String(prevSeatNumber).length)

        newSeats[rowIndex][seatIndex] = `O${prevSeatNumber}`

        const seats = {
            seats: newSeats
        }
        
        await axios.patch(`http://127.0.0.1:8000/filmSessions/${filmSessionId}/`, {seats})
        axios.post("http://127.0.0.1:8000/filmTickets/", {
            userId: `http://127.0.0.1:8000/users/${session.user.id}/`,
            filmSessionId: `http://127.0.0.1:8000/filmSessions/${filmSessionId}/`,
            seatType: prevSeatType,
            seatNumber: prevSeatNumber,
            seatRowIndex: rowIndex,
            seatIndex: seatIndex
        })
    }
})

export const addFilmSession = createAsyncThunk("filmSession/add", async (filmSessionData) => {
    const { cinemaId, roomId, film, sessionTime } = filmSessionData
    const room = await axios.get(roomId)
    const seats = room.data.defaultSeats

    axios.post("http://127.0.0.1:8000/filmSessions/", {
        cinemaId,
        roomId,
        film,
        sessionTime,
        seats
    })
})

const filmSessionInteractSlice = createSlice({
    name: "filmSessionInteract",
    initialState: {
        filmSessionInfo: {},
        status: "idle",
        error: null
    },
    reducers: {
        changeFilmSessionsInfo: (state, action) => {
            const {field, value} = action.payload
            state.filmSessionInfo[field] = value
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(rentCinemaSeat.rejected, (state, action) => {
            console.error(action.error.message)
        })
    }
})

export default filmSessionInteractSlice.reducer;
export const { changeFilmSessionsInfo } = filmSessionInteractSlice.actions;