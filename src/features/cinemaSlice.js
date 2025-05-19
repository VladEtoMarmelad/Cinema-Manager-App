import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { URLSlice } from '@/URLSlice.mjs';

export const fetchCinemas = createAsyncThunk("cinemas/get", async () => {
    let allCinemas = await axios.get("http://127.0.0.1:8000/cinemas/")
    allCinemas = allCinemas.data

    let allCinemasRooms = await axios.get("http://127.0.0.1:8000/cinemaRooms/")
    allCinemasRooms = allCinemasRooms.data

    for (let i=0; i<allCinemas.length; i+=1) {
        let rooms = []
        rooms = allCinemasRooms.filter(cinemaRoom => URLSlice(cinemaRoom.cinemaId, 30) === allCinemas[i].id)
        allCinemas[i].rooms = rooms
    }

    return allCinemas
})

const cinemaSlice = createSlice({
    name: "cinema",
    initialState: {
        cinemas: [],
        status: "idle",
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchCinemas.pending, (state) => {
            state.status = "loading"
        })
        .addCase(fetchCinemas.fulfilled, (state, action) => {
            state.cinemas = action.payload
            state.status = "succeeded"
        })
        .addCase(fetchCinemas.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
    }
})

export default cinemaSlice.reducer;