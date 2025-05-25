import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getSession } from 'next-auth/react';
import { SignIn } from '@/sign-in';
import axios from 'axios';

export const addCinema = createAsyncThunk("cinema/add", async (data) => {
    try {
        const newCinema = await axios.post("http://127.0.0.1:8000/cinemas/", data)
        const newCinemaId = `http://127.0.0.1:8000/cinemas/${newCinema.data.id}/`

        const session = await getSession();
        const userId = session.user.id

        axios.patch(`http://127.0.0.1:8000/users/${userId}/`, {cinemaAdmin: newCinemaId})

        let user = await axios.get(`http://127.0.0.1:8000/users/${userId}/`)
        user = user.data

        SignIn({
            name: user.name,
            password: user.password
        }) //обновление сессии
    } catch (error) {

    }
})

const cinemaInteractSlice = createSlice({
    name: "cinemaInteract",
    initialState: {
        cinemaInfo: {
            name: ""
        },
        status: "idle",
        error: null,
        validationErrors: []
    },
    reducers: {
        changeCinemaInfo: (state, action) => {
            const {field, value} = action.payload
            state.cinemaInfo[field] = value
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(addCinema.pending, (state) => {
            state.status = "loading"
        })
        //.addCase(addCinema.fulfilled, (state, action) => {
        //    state.cinemas = action.payload
         //   state.status = "succeeded"
        //})
        .addCase(addCinema.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
    }
})

export default cinemaInteractSlice.reducer;
export const { changeCinemaInfo } = cinemaInteractSlice.actions;