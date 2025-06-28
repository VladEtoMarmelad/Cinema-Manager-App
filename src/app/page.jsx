"use client"

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getSomeFilms } from "@/features/filmsSlice";
import { FilmRating } from "./components/FilmRating";
import Link from "next/link";

import styles from "@/app/css/MainPage.module.css";
const MainPage = () => {

    const films = useSelector((state) => state.films.films);
    const status = useSelector((state) => state.films.status);
    const error = useSelector((state) => state.films.error);
    const lastFilmsLoadStatusGlobalState = useSelector(state => state.films.lastFilmsLoadStatus)
    let lastFilmsLoadStatus = false
    const [lastFilm, setLastFilm] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        if (lastFilmsLoadStatus === false && lastFilmsLoadStatusGlobalState === false) {
            dispatch(getSomeFilms(3))
        }
        lastFilmsLoadStatus = true
    }, [lastFilmsLoadStatus])

    useEffect(() => {
        setLastFilm(films[0]) // с backend-а возвращается уже перевёрнутый список последних фильмов поэтому - 0
    }, [films])

    if (status === 'loading') return <p>Загрузка...</p>;
    if (status === 'failed') return <p>Ошибка загрузки {error}</p>;

    return (
        <div >
            <Link id={styles.newFilms} href={lastFilm ? `/film?id=${lastFilm.id}` : "/"}>
                {
                    lastFilm &&
                        <div style={{position:'relative', top:'2.5em', left:'2.5em'}}>
                            <h1>Название последнего известного фильма: {lastFilm.name}</h1>
                            <p>Описание последнего известного фильма: {lastFilm.description}</p>
                        </div>
                }
            </Link>
                
            <section id={styles.allFilms}>
                {films.map(film => 
                    <div key={film.id} id={styles.oneFilm} style={{marginTop:'10em'}}>
                        <Link href={`/film?id=${film.id}`}>
                            <img src={film.poster} style={{borderRadius:'15px'}}/>
                        </Link>

                        <Link href={`/film?id=${film.id}`} style={{height:'fit-content', marginLeft:'5px', whiteSpace: 'nowrap'}}>
                            <h2>{film.ageRating}+ {film.name}</h2>
                            <FilmRating 
                                rating={film.rating}
                                starRating={film.starRating}
                            />
                            
                        </Link>
                    </div>
                )} 
            </section>
        </div>
    )
};

export default MainPage;