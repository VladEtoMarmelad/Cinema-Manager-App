import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';
import { compareAsc, closestIndexTo } from "date-fns";
import { fromDBTimeFormat } from '@/dateConverter';

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
    let allSessionTimes = []
    for (let i=0; i<allCinemaFilmSessionsSorted.length; i+=1) {
        allSessionTimes.push(allCinemaFilmSessionsSorted[i].sessionTime)
    }
    const now = new Date();
    const closestSessionIndex = closestIndexTo(now, allSessionTimes)

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
        .addCase(fetchCinemaRooms.fulfilled, (state, action) => {
            state.rooms = action.payload
            state.status = "succeeded"
        })
        .addCase(fetchCinema.fulfilled, (state, action) => {
            state.cinemas = action.payload
            state.status = "succeeded"
        })

        .addMatcher(isAnyOf(fetchCinemaRooms.pending, fetchCinema.pending), (state) => {
            state.status = "loading"
        })
        .addMatcher(isAnyOf(fetchCinemaRooms.rejected, fetchCinema.rejected), (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
    }
})

export default cinemaSlice.reducer;