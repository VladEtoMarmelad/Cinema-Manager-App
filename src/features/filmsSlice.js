import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { URLSlice } from '@/URLSlice.mjs';
import { fromDBTimeFormat } from '@/dateConverter';
import axios from 'axios';

export const fetchFilms = createAsyncThunk("films/fetchFilms", async () => {
    let allFilms = await axios.get("http://127.0.0.1:8000/movies/");
    allFilms = allFilms.data

    let allFilmSessions = await axios.get("http://127.0.0.1:8000/filmSessions/");
    allFilmSessions = allFilmSessions.data

    for (let i=0; i<allFilmSessions.length; i+=1) {
        allFilmSessions[i].sessionTime = fromDBTimeFormat(allFilmSessions[i].sessionTime)
    }

    for (let i=0; i<allFilms.length; i+=1) {
        allFilms[i].timeTable = allFilmSessions.filter(filmSession => URLSlice(filmSession.film, 29) === allFilms[i].id)
    }

    return allFilms;
});

const filmSlice = createSlice({
    name: "films",
    initialState: {
        films: [],
        status: "idle",
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilms.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFilms.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.films = action.payload;
            })
            .addCase(fetchFilms.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    }
});

export default filmSlice.reducer;
export const { addFilm } = filmSlice.actions;