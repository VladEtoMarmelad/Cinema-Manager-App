import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { z } from 'zod';
import { filmSchema } from '@/zod/filmSchema';

export const addFilm = createAsyncThunk("films/addFilm", async (filmData) => {
    try {
        await filmSchema.parseAsync(filmData)

        const poster = document.getElementById("posterInput").files[0]
        let data = Object.assign({}, filmData)
        data.poster = poster

        axios.post("http://127.0.0.1:8000/movies/", data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            const validationErrors = []

            for (let i=0; i<error.errors.length; i+=1) {
                validationErrors.push(error.errors[i].message)
            }

            return validationErrors
        } else {
            console.error("Unexpected error:", error);
        }
    }
})

const filmInteractSlice = createSlice({
    name: "filmInteract",
    initialState: {
        filmInfo: {
            name: "",
            description: "",
            ageRating: "",
            publishYear: "",
            language: "",
            studio: "",
            duration: "",
            director: "",
            scenarist: "",
            production: ""
        },
        status: "idle",
        error: null,
        validationErrors: []
    },
    reducers: {
        changeFilmInfo: (state, action) => {
            const {field, value} = action.payload
            state.filmInfo[field] = value
        }
    },
    extraReducers: (builder) => {
            builder
                .addCase(addFilm.fulfilled, (state, action) => {
                    if (action.payload) {
                        state.validationErrors = action.payload
                    }
                })
                .addCase(addFilm.pending, (state) => {
                    state.validationErrors = []
                })
        }
});

export default filmInteractSlice.reducer;
export const { changeFilmInfo } = filmInteractSlice.actions;