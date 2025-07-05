import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fromDBTimeFormat } from '@/utils/dateConverter';
import axios from 'axios';

export const fetchSingleFilmSession = createAsyncThunk("filmSession/get", async (filmSessionId) => {
    let filmSession = await axios.get(`http://127.0.0.1:8000/filmSessions/${filmSessionId}/`)
    filmSession = filmSession.data

    const film = await axios.get(filmSession.film)
    const cinema = await axios.get(filmSession.cinemaId)

    filmSession.film = film.data
    filmSession.cinema = cinema.data
    filmSession.sessionTime = fromDBTimeFormat(filmSession.sessionTime)
    
    return filmSession
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
    }
})

export default filmSessionSlice.reducer;