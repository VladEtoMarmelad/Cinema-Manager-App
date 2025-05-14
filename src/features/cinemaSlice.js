import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCinemas = createAsyncThunk("cinemas/get", async () => {
    let allCinemas = await axios.get("http://127.0.0.1:8000/cinemas/")
    allCinemas = allCinemas.data
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