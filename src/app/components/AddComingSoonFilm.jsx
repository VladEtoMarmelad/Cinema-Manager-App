"use client"

import { useSelector, useDispatch } from "react-redux"
import { getSomeFilmsByName } from "@/features/filmsSlice"
import { useState } from "react"
import { changeComingSoonFilm, addComingSoonFilm } from "@/features/comingSoonFilmSlice"
import { useSearchParams, useRouter } from "next/navigation"
import { ValidationErrors } from "./ValidationErrors"
import styles from "@/app/css/CinemaAdminPage.module.css"

const AddComingSoonFilm = () => {
    const comingSoonFilmInfo = useSelector(state => state.comingSoonFilms.comingSoonFilmInfo)
    const validationErrors = useSelector(state => state.comingSoonFilms.validationErrors)
    const error = useSelector(state => state.comingSoonFilms.error)
    const searchFilms = useSelector(state => state.films.searchFilms)
    const dispatch = useDispatch()

    const [filmName, setFilmName] = useState("")
    const [showSearchFilms, setShowSearchFilms] = useState(false)

    const router = useRouter();
    const searchParams = useSearchParams();
    const cinemaId = Number(searchParams.get("id"));

    const changeComingSoonFilmInfoHandler = (field, value) => {
        dispatch(changeComingSoonFilm({
            field,
            value
        }))
    }

    const addComingSoonFilmHandler = (e) => {
        e.preventDefault()
        dispatch(addComingSoonFilm({
            closestSessionTime: comingSoonFilmInfo.closestSessionTime,
            filmId: comingSoonFilmInfo.filmId,
            cinemaId
        })).unwrap().then((comingSoonFilm) => {
            if (!comingSoonFilm.gotValidationErrors) {
                router.push(`/cinema?id=${cinemaId}`)
            }
        })
    }

    return (
        <section className={styles.addSection}>
            <h1>{error}</h1>
            <div className={styles.addSectionName}>
                <h2>Добавление "Скоро в прокате"</h2>
            </div>
            <form onSubmit={addComingSoonFilmHandler} className={styles.addSectionForm}>
                <input 
                    value={filmName}
                    onChange={(e) => {
                        dispatch(
                            getSomeFilmsByName({
                                name: e.target.value, 
                                amount: 3
                            })
                        );
                        setFilmName(e.target.value)
                    }}
                    onFocus={() => setShowSearchFilms(true)}
                    placeholder="Введите название фильма..."
                />
                {showSearchFilms && searchFilms.map(film => 
                    <button 
                        key={film.id} 
                        onClick={(e) => {
                            e.preventDefault();
                            changeComingSoonFilmInfoHandler("filmId", Number(film.id));
                            setFilmName(film.name)
                            setShowSearchFilms(false)
                        }}
                        className={styles.filmInputButton}
                    >{film.name}</button>
                )}

                <input 
                    onChange={(e) => changeComingSoonFilmInfoHandler("closestSessionTime", e.target.value)}
                    type="date"
                    placeholder="Время сеанса..."
                /><br/>

                <button 
                    type="submit" 
                    className="blackButton"
                    style={{marginTop:'15px'}}
                >
                    Добавить "Скоро в прокате"
                </button>

                <ValidationErrors errors={validationErrors}/>

            </form>
        </section>
    )
}

export { AddComingSoonFilm };