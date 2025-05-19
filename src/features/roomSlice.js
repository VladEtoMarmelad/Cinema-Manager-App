import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { URLSlice } from '@/URLSlice.mjs';

export const fetchSingleRoom = createAsyncThunk("cinemaRoom/get", async (roomId) => {
    let room = await axios.get(`http://127.0.0.1:8000/cinemaRooms/${roomId}/`)
    room = room.data
    
    const nextFilmId = URLSlice(room.nextFilm, 29)
    let nextFilm = await axios.get(`http://127.0.0.1:8000/movies/${nextFilmId}/`)
    nextFilm = nextFilm.data
    room.nextFilm = nextFilm

    return room
})

const cinemaRoomSlice = createSlice({
    name: "room",
    initialState: {
        rooms: [],
        status: "idle",
        error: null
    },
    reducers: {
        changeSeats: (state, action) => {
            console.log(action.payload)
            const {seat, seatIndex, rowIndex} = action.payload
            state.rooms.seats.seats[rowIndex][seatIndex] = `changes`
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchSingleRoom.pending, (state) => {
            state.status = "loading"
        })
        .addCase(fetchSingleRoom.fulfilled, (state, action) => {
            state.rooms = action.payload
            state.status = "succeeded"
        })
        .addCase(fetchSingleRoom.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
    }
})

export default cinemaRoomSlice.reducer;
export const { changeSeats } = cinemaRoomSlice.actions;