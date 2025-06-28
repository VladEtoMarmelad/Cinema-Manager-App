import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import { fromDBTimeFormat } from '@/dateConverter';
import axios from 'axios';

export const getSomeFilmsByName = createAsyncThunk("films/getSomeByName", async ({name, amount}) => {
    if (name !== "") {
        const films = await axios.get("http://127.0.0.1:8000/movies/", {
            params: {name, amount}
        })
        console.log(films.data)
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
            let filmSessions = await axios.get("http://127.0.0.1:8000/filmSessions/", {
                params: {filmId: film.id}
            })
            filmSessions = filmSessions.data
            filmSessions = filmSessions.map(filmSession => {
                const newSessionTime = fromDBTimeFormat(filmSession.sessionTime) 
                return {
                    ...filmSession,
                    sessionTime: newSessionTime
                }
            })

            const normalized = film.rating / 2
            const fullCount = Math.floor(normalized);
            const halfCount = normalized % 1 === 0.5 ? 1 : 0;
            const emptyCount = 5 - fullCount - halfCount;

            const starRating = [
                ...Array(fullCount).fill("full"),
                ...Array(halfCount).fill("half"),
                ...Array(emptyCount).fill("empty")
            ]

            return {
                ...film,
                timeTable: filmSessions,
                starRating
            }
        })
    )

    console.log(films)
    return films
})

export const getSingleFilm = createAsyncThunk("film/get", async (filmId, {getState}) => {
    const films = getState().films.films
    if (films.find(film => film.id === filmId)) {
        console.log("фильм найден в списке недавних")
        return false
    } else {
        console.log("фильм не найден в списке недавних")
        let film = await axios.get(`http://127.0.0.1:8000/movies/${filmId}/`)
        film = film.data

        let filmSessions = await axios.get("http://127.0.0.1:8000/filmSessions/", {
            params: {filmId: film.id}
        })
        filmSessions = filmSessions.data
        filmSessions = filmSessions.map(filmSession => {
            const newSessionTime = fromDBTimeFormat(filmSession.sessionTime)

            return {
                ...filmSession,
                sessionTime: newSessionTime
            }
        })

        const normalized = film.rating / 2
        const fullCount = Math.floor(normalized);
        const halfCount = normalized % 1 === 0.5 ? 1 : 0;
        const emptyCount = 5 - fullCount - halfCount;

        const starRating = [
            ...Array(fullCount).fill("full"),
            ...Array(halfCount).fill("half"),
            ...Array(emptyCount).fill("empty")
        ]

        film.timeTable = filmSessions
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