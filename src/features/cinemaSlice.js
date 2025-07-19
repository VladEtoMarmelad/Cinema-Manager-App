import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';
import { compareAsc, closestIndexTo, isBefore } from "date-fns";
import { fromDBTimeFormat, fromDBTimeFormatDateOnly } from '@/utils/dateConverter';

export const fetchCinema = createAsyncThunk("cinema/get", async (cinemaId) => {
    let cinema = await axios.get(`http://127.0.0.1:8000/cinemas/${cinemaId}/`)
    cinema = cinema.data

    let allCinemaFilmSessions = await axios.get("http://127.0.0.1:8000/filmSessions/", {
        params: {
            cinemaId
        }
    })
    allCinemaFilmSessions = allCinemaFilmSessions.data

    const now = new Date()
    for (let i = allCinemaFilmSessions.length - 1; i >= 0; i-=1) { //удаление киносессий из БД и списка если они уже прошли
        if ( isBefore(allCinemaFilmSessions[i].sessionTime, now) ) {
            try {
                await axios.delete(allCinemaFilmSessions[i].url)
            } catch (error) {
                if (error.response && error.response.status !== 404) {
                    throw error;
                }
            }
            allCinemaFilmSessions.splice(i, 1)
        } 
    }

    let allCinemaFilmSessionsSorted = allCinemaFilmSessions.sort((a, b) =>
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

    let comingSoonFilms = await axios.get("http://127.0.0.1:8000/cinemaComingSoonFilms/", {
        params: {cinemaId}
    })
    comingSoonFilms = comingSoonFilms.data

    for (let i = comingSoonFilms.length - 1; i >= 0; i-=1) { //удаление "Скоро в прокате" из БД и списка если их ближайший сеанс уже прошол
        if ( isBefore(comingSoonFilms[i].closestSessionTime, now) ) {
            try {
                await axios.delete(comingSoonFilms[i].url)
            } catch (error) {
                if (error.response && error.response.status !== 404) {
                    throw error;
                }
            }
            comingSoonFilms.splice(i, 1)
        }
    }
    

    const comingSoonFilmsSorted = comingSoonFilms.sort((a, b) =>
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
    const closestFilmSessionIndex = closestIndexTo(now, allSessionTimes)

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