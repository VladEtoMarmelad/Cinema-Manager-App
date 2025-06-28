"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getSomeFilmsByName, clearSearchFilms } from "@/features/filmsSlice"
import { getSomeCinemasByName, clearSearchCinemas } from "@/features/cinemaSlice"
import styles from "@/app/css/SearchPage.module.css"
import Link from "next/link"

const SearchPage = () => {
    const [searchItem, setSearchItem] = useState("films")
    const [searchInput, setSearchInput] = useState("")

    const searchFilms = useSelector(state => state.films.searchFilms)
    const searchCinemas = useSelector(state => state.cinema.searchCinemas)
    const dispatch = useDispatch()

    const searchHandler = (value) => {
        if (searchItem==="films") {
            dispatch(getSomeFilmsByName({
                name: value,
                amount: 30
            }))
        } else {
            dispatch(getSomeCinemasByName({
                name: value,
                amount: 30
            }))
        }
    }

    const changeSearchItemHandler = (newSearchItem) => {
        setSearchInput(""); 
        dispatch(clearSearchFilms())
        dispatch(clearSearchCinemas())
        setSearchItem(newSearchItem)
    }

    return (
        <div className={styles.globalDiv}>
            <section className={styles.searchAndDispalaySection}>

                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => { setSearchInput(e.target.value); searchHandler(e.target.value) }}
                    placeholder={`Введите название ${searchItem === "films" ? "фильма" : "кинотеатра"}...`}
                    className={styles.searchInput}
                />

                <section className={styles.displaySection}>
                    {searchFilms.map(film => 
                        <div key={film.id}>
                            <Link href={`/film?id=${film.id}`} style={{position:'absolute'}}>
                                <img src={film.poster}/>
                                <h3>{film.name}</h3>
                            </Link>
                        </div>
                    )}
                    {searchCinemas.map(cinema => 
                        <Link key={cinema.id} href={`/cinema?id=${cinema.id}`}>
                            <h3>{cinema.name}</h3>
                        </Link>
                    )}
                </section>

            </section>

            <section className={styles.filterSection}>
                <i className="bi bi-filter" style={{fontSize:'25px', marginRight:'15px', marginTop:'25px'}}/>
                <select onChange={(e) => changeSearchItemHandler(e.target.value)}>
                    <option value="films">Фильмы</option>
                    <option value="cinemas">Кинотеатры</option>
                </select>
            </section>
        </div>
    )
}

export default SearchPage