import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { comingSoonFilmsSchema } from '@/zod/comingSoonFilmsSchema';
import { catchValidationErrors } from '@/zod/catchValidationErrors';
import axios from 'axios';

export const addComingSoonFilm = createAsyncThunk("comingSoonFilm/add", async (comingSoonFilmData) => {
    try {
        console.log(comingSoonFilmData)
        const {cinemaId, filmId, closestSessionTime} = comingSoonFilmData

        await comingSoonFilmsSchema.parseAsync({
            cinemaId,
            filmId,
            closestSessionTime: new Date(closestSessionTime)
        })

        axios.post("http://127.0.0.1:8000/cinemaComingSoonFilms/", {
            cinemaId: `http://127.0.0.1:8000/cinemas/${cinemaId}/`,
            filmId: `http://127.0.0.1:8000/movies/${filmId}/`,
            closestSessionTime
        })

        return {
           gotValidationErrors: false
        }
    } catch (error) {
        return {
            gotValidationErrors: true,
            errors: catchValidationErrors(error)
        }
    }
})

const comingSoonFilmsSlice = createSlice({
    name: "comingSoonFilms",
    initialState: {
        comingSoonFilmInfo: {
            closestSessionTime: "",
            cinemaId: "",
            filmId: ""
        },
        validationErrors: [],
        status: "idle",
        error: null
    },
    reducers: {
        changeComingSoonFilm: (state, action) => {
            const {field, value} = action.payload
            state.comingSoonFilmInfo[field] = value
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(addComingSoonFilm.pending, (state) => {
            state.validationErrors = []
        })
        .addCase(addComingSoonFilm.fulfilled, (state, action) => {
            if (action.payload.gotValidationErrors) {
                state.validationErrors = action.payload.errors
            }
        })
        .addCase(addComingSoonFilm.rejected, (state, action) => {
            state.error = action.error.message
        })
    }
})

export default comingSoonFilmsSlice.reducer
export const { changeComingSoonFilm } = comingSoonFilmsSlice.actions