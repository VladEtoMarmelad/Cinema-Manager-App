import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getSession } from 'next-auth/react';
import { sendFilmTicketMail } from '@/nodemailer';
import { fromDBTimeFormat } from '@/dateConverter';
import axios from 'axios';

export const fetchSingleFilmSession = createAsyncThunk("filmSession/get", async (filmSessionId) => {
    let filmSession = await axios.get(`http://127.0.0.1:8000/filmSessions/${filmSessionId}/`)
    filmSession = filmSession.data

    let film = await axios.get(filmSession.film)
    film = film.data

    filmSession.film = film
    filmSession.sessionTime = fromDBTimeFormat(filmSession.sessionTime)
    
    return filmSession
})

export const rentCinemaSeat = createAsyncThunk("filmSession/rentSeat", async (data) => {
    const session = await getSession() ? true : false

    if (session) {
        
        const {prevSeats, rowIndex, seatIndex, filmSessionId} = data

        let filmSession = await axios.get(`http://127.0.0.1:8000/filmSessions/${filmSessionId}/`)
        filmSession = filmSession.data

        filmSession.sessionTime = fromDBTimeFormat(filmSession.sessionTime)

        let film = await axios.get(filmSession.film)
        film = film.data

        sendFilmTicketMail({
            subject: `Билет на фильм "${film.name}"`,
            mainInfo: `Вы купили место на фильм "${film.name}"`,
            seat: prevSeats.seats[rowIndex][seatIndex],
            row: rowIndex,
            time: filmSession.sessionTime
        })

        let newSeats = prevSeats.seats.map(row => [...row]);

        const prevSeatNumber = Number( newSeats[rowIndex][seatIndex].slice(1) )

        newSeats[rowIndex][seatIndex] = `O${prevSeatNumber}`
        console.log(newSeats)

        const seats = {
            seats: newSeats
        }
        
        //await axios.patch(`http://127.0.0.1:8000/filmSessions/${filmSessionId}/`, {seats})
    }
})

const filmSessionSlice = createSlice({
    name: "filmSession",
    initialState: {
        filmSessions: [],
        status: "idle",
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchSingleFilmSession.pending, (state) => {
            state.status = "loading"
        })
        .addCase(fetchSingleFilmSession.fulfilled, (state, action) => {
            state.filmSessions = action.payload
            state.status = "succeeded"
        })
        .addCase(fetchSingleFilmSession.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })

        .addCase(rentCinemaSeat.rejected, (state, action) => {
            console.error(action.error.message)
        })
    }
})

export default filmSessionSlice.reducer;