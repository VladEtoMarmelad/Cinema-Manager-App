import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { filmSchema } from '@/zod/filmSchema';
import { catchValidationErrors } from '@/zod/catchValidationErrors';

export const addFilm = createAsyncThunk("films/addFilm", async (filmData) => {
    try {
        await filmSchema.parseAsync(filmData)

        const poster = document.getElementById("posterInput").files[0]
        let data = Object.assign({}, filmData)
        data.poster = poster

        const addedFilm = await axios.post("http://127.0.0.1:8000/movies/", data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        return {
            gotValidationErrors: false,
            id: addedFilm.data.id
        }
    } catch (error) {
        return {
            gotValidationErrors: true,
            value: catchValidationErrors(error)
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
                    if (action.payload.gotValidationErrors) {
                        state.validationErrors = action.payload.value
                    }
                })
                .addCase(addFilm.pending, (state) => {
                    state.validationErrors = []
                })
                .addCase(addFilm.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.error.message;
                })
        }
});

export default filmInteractSlice.reducer;
export const { changeFilmInfo } = filmInteractSlice.actions;