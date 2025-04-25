import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { redirect } from 'next/navigation';

export const fetchFilms = createAsyncThunk('films/fetchFilms', async () => {
    const response = await axios.get("http://127.0.0.1:8000/movies/");
    return response.data;
});

const filmSlice = createSlice({
    name: "films",
    initialState: {
        films: [],
        status: "idle",
        error: null
    },
    reducers: {
        addFilm: (state, action) => {
            console.log(action.payload);
            axios.post("http://127.0.0.1:8000/movies/", action.payload);
            redirect("/")
        } 
    },
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