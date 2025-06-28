import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getSession } from 'next-auth/react';
import { signIn } from 'next-auth/react';
import { cinemaRoomSchema } from '@/zod/cinemaRoomSchema';
import { catchValidationErrors } from '../zod/catchValidationErrors';
import axios from 'axios';

export const addCinema = createAsyncThunk("cinema/add", async (data) => {
    try {
        const newCinema = await axios.post("http://127.0.0.1:8000/cinemas/", data)
        const newCinemaId = `http://127.0.0.1:8000/cinemas/${newCinema.data.id}/`

        const session = await getSession();
        const userId = session.user.id

        axios.patch(`http://127.0.0.1:8000/users/${userId}/`, {cinemaAdmin: newCinemaId})

        let user = await axios.get(`http://127.0.0.1:8000/users/${userId}/`)
        user = user.data

        signIn("credentials", {
            name: user.name,
            password: user.password
        }) //обновление сессии
    } catch (error) {

    }
})

export const addCinemaRoom = createAsyncThunk("room/add", async (data) => {
    let {seats, cinemaId} = data

    try {

        cinemaRoomSchema.parse({seats})

        let nextSeatNumber = -1
        const numberedSeats = seats.map(seatRow => {
            return seatRow.map(seat => {
                if (seat !== "E") {
                    nextSeatNumber += 1
                    return `${seat}${nextSeatNumber}`
                } else {
                    return seat
                }
            })
        })

        await axios.post("http://127.0.0.1:8000/cinemaRooms/", {
            cinemaId: `http://127.0.0.1:8000/cinemas/${cinemaId}/`,
            defaultSeats: {
                seats: numberedSeats
            }
        })
    } catch (error) {
        return catchValidationErrors(error)
    }
})

const cinemaInteractSlice = createSlice({
    name: "cinemaInteract",
    initialState: {
        cinemaInfo: {
            name: "",
            description: ""
        },
        roomInfo: {
            defaultSeats: [

            ],
            nextSeatNumber: -1
        },
        status: "idle",
        error: null,
        validationErrors: []
    },
    reducers: {
        changeCinemaInfo: (state, action) => {
            const {field, value} = action.payload
            state.cinemaInfo[field] = value
        },
        addRow: (state) => {
            state.roomInfo.defaultSeats.push([])
        },
        changeRowInfo: (state, action) => {
            const {rowIndex, newValue} = action.payload
            state.roomInfo.defaultSeats[rowIndex].push(`${newValue}`)
        },
        changeSeat: (state, action) => {
            const {row, index} = action.payload
            if (state.roomInfo.defaultSeats[row][index] === "B") {
                state.roomInfo.defaultSeats[row][index] = "V"
            } else if (state.roomInfo.defaultSeats[row][index] === "V") {
                state.roomInfo.defaultSeats[row][index] = "E"
            } else {
                state.roomInfo.defaultSeats[row][index] = "B"
            }
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(addCinema.pending, (state) => {
            state.status = "loading"
        })
        .addCase(addCinema.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })

        .addCase(addCinemaRoom.pending, (state) => {
            state.validationErrors = []
        })
        .addCase(addCinemaRoom.fulfilled, (state, action) => {
            if (action.payload) {
                state.validationErrors = action.payload
            }
        })
        .addCase(addCinemaRoom.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
    }
})

export default cinemaInteractSlice.reducer;
export const { changeCinemaInfo, addRow, changeRowInfo, changeSeat } = cinemaInteractSlice.actions;