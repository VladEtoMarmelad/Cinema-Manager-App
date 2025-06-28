import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';
import { compareAsc, closestIndexTo } from "date-fns";
import { fromDBTimeFormat, fromDBTimeFormatDateOnly } from '@/dateConverter';

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

    const comingSoonFilms = await axios.get("http://127.0.0.1:8000/cinemaComingSoonFilms/", {
        params: {cinemaId}
    })
    const comingSoonFilmsSorted = comingSoonFilms.data.sort((a, b) =>
        compareAsc(a.sessionTime, b.sessionTime)
    );
    const comingSoonFilmsWithFilms = await Promise.all(
        comingSoonFilmsSorted.map(async (film) => {
            const filmData = await axios.get(film.filmId);
            return {
                ...film,
                closestSessionTime: fromDBTimeFormatDateOnly(film.closestSessionTime),
                filmData: filmData.data
            };
        })
    );
    cinema.comingSoonFilms = comingSoonFilmsWithFilms

    const now = new Date();
    const closestFilmSessionIndex = closestIndexTo(now, allSessionTimes)

    console.log(cinema)

    return {cinema, closestFilmSessionIndex}
})

export const fetchCinemaRooms = createAsyncThunk("cinema/rooms/get", async (cinemaId) => {
    let allCinemaRooms = await axios.get("http://127.0.0.1:8000/cinemaRooms/", {
        params: {cinemaId}
    })
    allCinemaRooms = allCinemaRooms.data

    return allCinemaRooms
})

export const getSomeCinemasByName = createAsyncThunk("cinemas/getSomeByName", async ({name, amount}) => {
    if (name !== "") {
        const cinemas = await axios.get("http://127.0.0.1:8000/cinemas/", {
            params: {name, amount}
        })
        console.log(cinemas.data)
        return cinemas.data
    } else {
        return []
    }
})

const cinemaSlice = createSlice({
    name: "cinema",
    initialState: {
        cinemas: [],
        rooms: [],
        searchCinemas: [],
        status: "idle",
        error: null
    },
    reducers: {
        clearSearchCinemas: (state) => {
            state.searchCinemas = []
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchCinemaRooms.fulfilled, (state, action) => {
            state.rooms = action.payload
            state.status = "succeeded"
        })
        .addCase(fetchCinema.fulfilled, (state, action) => {
            state.cinemas = action.payload.cinema
            state.cinemas.closestFilmSessionIndex = action.payload.closestFilmSessionIndex
            state.status = "succeeded"
        })
        .addCase(getSomeCinemasByName.fulfilled, (state, action) => {
            state.searchCinemas = action.payload
            state.status = "succeeded"
        })

        .addMatcher(isAnyOf(fetchCinemaRooms.pending, fetchCinema.pending, getSomeCinemasByName.pending), (state) => {
            state.status = "loading"
        })
        .addMatcher(isAnyOf(fetchCinemaRooms.rejected, fetchCinema.rejected, getSomeCinemasByName.rejected), (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        })
    }
})

export default cinemaSlice.reducer;
export const { clearSearchCinemas } = cinemaSlice.actions