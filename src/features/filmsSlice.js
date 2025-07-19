import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import { ratingToStarsConverter } from '@/utils/ratingToStarsConverter';
import { getFilmSessionByFilmId } from '@/utils/getFilmSessionByFilmId';
import { getSimilarFilms } from '@/utils/getSimilarFilms';
import axios from 'axios';

export const getSomeFilmsByName = createAsyncThunk("films/getSomeByName", async ({name, amount}) => {
    if (name !== "") {
        const films = await axios.get("http://127.0.0.1:8000/movies/", {
            params: {name, amount}
        })
        return films.data
    } else {
        return []
    }
})

export const getSomeFilms = createAsyncThunk("films/getSome", async (amount, {getState}) => {

    let films = await axios.get("http://127.0.0.1:8000/movies/", {
        params: {amount, name: false}
    })
    films = films.data

    const globalStateFilms = getState().films.films
    let duplicateIdArray = []
    for (let i=0; i<globalStateFilms.length; i+=1) {
        duplicateIdArray.push(globalStateFilms[i].id)
    }
    films = films.filter(film => !duplicateIdArray.includes(film.id)) //избавление от дубликатов(если сначало подгрузить фильм getSingleFilm, а потом getSomeFilms)

    films = await Promise.all(
        films.map(async (film) => {
            const filmSessions = await getFilmSessionByFilmId(film.id)
            const similarFilms = await getSimilarFilms(film)
            const starRating = ratingToStarsConverter(film.rating)

            return {
                ...film,
                timeTable: filmSessions,
                starRating,
                similarFilms
            }
        })
    )

    return films
})

export const getSingleFilm = createAsyncThunk("film/get", async (filmId, {getState}) => {
    const films = getState().films.films
    if (films.find(film => film.id === filmId)) { //фильм найден в списке загруженых фильмов
        return false
    } else { //фильм не найден в списке загруженых фильмов
        let film = await axios.get(`http://127.0.0.1:8000/movies/${filmId}/`)
        film = film.data

        const filmSessions = await getFilmSessionByFilmId(film.id)
        const similarFilms = await getSimilarFilms(film)
        const starRating = ratingToStarsConverter(film.rating)

        film.timeTable = filmSessions
        film.similarFilms = similarFilms
        film.starRating = starRating

        return {film, filmId}
    }
})

const filmSlice = createSlice({
    name: "films",
    initialState: {
        films: [],
        searchFilms: [],
        lastFilmsLoadStatus: false,
        status: "idle",
        error: null
    },
    reducers: {
        clearSearchFilms: (state) => {
            state.searchFilms = []
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSomeFilmsByName.fulfilled, (state, action) => {
                state.searchFilms = action.payload
                state.status = "succeeded"
            })

            .addCase(getSomeFilms.fulfilled, (state, action) => {
                let newFilmsState = state.films
                Array.prototype.unshift.apply(newFilmsState, action.payload);

                state.films = newFilmsState
                state.status = "succeeded"
                state.lastFilmsLoadStatus = true
            })
            .addCase(getSingleFilm.fulfilled, (state, action) => {
                const {film, filmId} = action.payload
                if (film) {
                    if (!state.films.find(film => film.id === filmId)) {
                        let newFilmsState = state.films
                        newFilmsState.push(film)

                        state.films = newFilmsState
                    }
                }
                state.status = "succeeded"
            })

            .addMatcher(isAnyOf(getSomeFilmsByName.rejected, getSomeFilms.rejected, getSingleFilm.rejected), (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addMatcher(isAnyOf(getSomeFilmsByName.pending, getSomeFilms.pending, getSingleFilm.pending), (state) => {
                state.status = 'loading';
            })
    }
});

export default filmSlice.reducer;
export const { clearSearchFilms } = filmSlice.actions