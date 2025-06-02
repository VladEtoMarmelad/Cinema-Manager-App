import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { URLSlice } from '@/URLSlice.mjs';
import { compareAsc } from "date-fns";
import { fromDBTimeFormat } from '@/dateConverter';

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

export const fetchCinema = createAsyncThunk("cinema/get", async (cinemaId) => {
    let cinema = await axios.get(`http://127.0.0.1:8000/cinemas/${cinemaId}/`)
    cinema = cinema.data

    const allCinemaFilmSessions = await axios.get("http://127.0.0.1:8000/filmSessions/", {
        params: {
            cinemaId
        }
    })

    let allCinemaFilmSessionsSorted = allCinemaFilmSessions.data.sort((a, b) =>
        compareAsc(a.sessionTime, b.sessionTime)
    );
    
    const filmSessionsWithFilm = await Promise.all(
    allCinemaFilmSessionsSorted.map(async (filmSession) => {
        const filmData = await axios.get(filmSession.film);
        return {
            ...filmSession,
            sessionTime: fromDBTimeFormat(filmSession.sessionTime),
            film: filmData.data
        };
    })
);

    cinema.filmSessions = filmSessionsWithFilm

    console.log(cinema)
    return cinema
})

export const fetchCinemaRooms = createAsyncThunk("cinema/rooms/get", async (cinemaId) => {
    let allCinemaRooms = await axios.get("http://127.0.0.1:8000/cinemaRooms/", {
        params: {cinemaId}
    })
    allCinemaRooms = allCinemaRooms.data

    return allCinemaRooms
})

const cinemaSlice = createSlice({
    name: "cinema",
    initialState: {
        cinemas: [],
        rooms: [],
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

        .addCase(fetchCinemaRooms.pending, (state) => {
            state.status = "loading"
        })
        .addCase(fetchCinemaRooms.fulfilled, (state, action) => {
            state.rooms = action.payload
            state.status = "succeeded"
        })
        .addCase(fetchCinemaRooms.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })

        .addCase(fetchCinema.pending, (state) => {
            state.status = "loading"
        })
        .addCase(fetchCinema.fulfilled, (state, action) => {
            state.cinemas = action.payload
            state.status = "succeeded"
        })
        .addCase(fetchCinema.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
    }
})

export default cinemaSlice.reducer;