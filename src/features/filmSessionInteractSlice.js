import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import { getSession } from 'next-auth/react';
import { sendFilmTicketMail } from '@/nodemailer';
import { fromDBTimeFormat } from '@/utils/dateConverter';
import { filmSessionSchema } from '@/zod/filmSessionSchema';
import { catchValidationErrors } from '@/zod/catchValidationErrors';
import { rentCinemaSeatSchema } from '@/zod/rentCinemaSeatSchema';
import axios from 'axios';

export const rentCinemaSeat = createAsyncThunk("filmSession/rentSeat", async (data) => {
    try {
        const session = await getSession()
        if (session ? true : false) {
            const {prevSeats, rowIndex, seatIndex, filmSessionId} = data

            await rentCinemaSeatSchema.parseAsync({
                seatRowIndex: rowIndex,
                seatIndex,
                filmSessionId
            })

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
            return {
                gotValidationErrors: false
            }
        }
    } catch (error) {
        return {
            gotValidationErrors: true,
            errors: catchValidationErrors(error)
        }
    }
})

export const addFilmSession = createAsyncThunk("filmSession/add", async (filmSessionData) => {
    try {
        const { cinemaId, roomId, film, sessionTime } = filmSessionData

        filmSessionSchema.parse({
            cinemaId,
            roomId,
            film,
            sessionTime
        })

        const room = await axios.get(roomId)
        const seats = room.data.defaultSeats

        const addedFilmSession = await axios.post("http://127.0.0.1:8000/filmSessions/", {
            cinemaId,
            roomId,
            film,
            sessionTime,
            seats
        })

        return {
            gotValidationErrors: false,
            id: addedFilmSession.data.id
        }
    } catch (error) {
        return {
            gotValidationErrors: true,
            errors: catchValidationErrors(error)
        }
    }
})

const filmSessionInteractSlice = createSlice({
    name: "filmSessionInteract",
    initialState: {
        filmSessionInfo: {},
        status: "idle",
        validationErrors: [],
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
        .addMatcher(isAnyOf(rentCinemaSeat.pending, addFilmSession.pending), (state) => {
            state.validationErrors = []
        })
        .addMatcher(isAnyOf(rentCinemaSeat.fulfilled, addFilmSession.fulfilled), (state, action) => {
            if (action.payload.gotValidationErrors) {
                state.validationErrors = action.payload.errors
            }
        })
        .addMatcher(isAnyOf(rentCinemaSeat.rejected, addFilmSession.rejected), (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        })
    }
})

export default filmSessionInteractSlice.reducer;
export const { changeFilmSessionsInfo } = filmSessionInteractSlice.actions;