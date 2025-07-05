"use client"

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { getSomeFilms } from "@/features/filmsSlice";
import { FilmRating } from "./components/FilmRating";
import { FilmInfo } from "./components/FilmInfo";
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
            dispatch(getSomeFilms(7))
        }
        lastFilmsLoadStatus = true
    }, [lastFilmsLoadStatus])

    useEffect(() => {
        setLastFilm(films[0]) // с backend-а возвращается уже перевёрнутый список последних фильмов поэтому - 0
    }, [films])

    if (status === 'loading') return <p>Загрузка...</p>;
    if (status === 'failed') return <p>Ошибка загрузки {error}</p>;

    return (
        <div>
            {lastFilm &&
                <Link id={styles.latestFilms} href={lastFilm ? `/film?id=${lastFilm.id}` : "/"}>
                    <FilmInfo 
                        filmInfo={lastFilm}
                        showPoster={true}
                        showRating={true}
                    />
                    <div style={{width:'45%', marginLeft:'5%'}}>
                        <p>
                            {lastFilm.description.slice(0, 750)}
                            {lastFilm.description.length>750 && "..."}
                        </p>
                    </div>
                </Link>
            }

            <section id={styles.allFilms}>
                {films.map((film, index) => {
                    if (index!==0) {
                        return (
                            <div key={film.id} id={styles.oneFilm} style={{marginTop:'10em'}}>
                                <Link href={`/film?id=${film.id}`}>
                                    <img src={film.poster} className={styles.poster}/>
                                </Link>

                                <Link href={`/film?id=${film.id}`} style={{height:'fit-content', marginLeft:'5px', whiteSpace: 'nowrap'}}>
                                    <h2>{film.ageRating}+ {film.name}</h2>
                                    <FilmRating 
                                        rating={film.rating}
                                        starRating={film.starRating}
                                    />
                                    
                                </Link>
                            </div>
                        )
                    }
                })} 
            </section>
        </div>
    )
};

export default MainPage;