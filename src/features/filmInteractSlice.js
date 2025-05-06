import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { redirect } from 'next/navigation';

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
        error: null
    },
    reducers: {
        changeFilmInfo: (state, action) => {
            const {field, value} = action.payload
            state.filmInfo[field] = value
        },
        addFilm: (state, action) => {
            const poster = document.getElementById("posterInput").files[0]
            let data = Object.assign({}, action.payload)
            data.poster = poster

            if (Object.values(data).every(el => el !== "")) {
                axios.post("http://127.0.0.1:8000/movies/", data, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
                redirect("/")
            } else {
                alert("Заполните все поля!")
            }
        } 
    }
});

export default filmInteractSlice.reducer;
export const { addFilm, changeFilmInfo } = filmInteractSlice.actions;