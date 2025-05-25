"use client"

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchFilms } from "@/features/filmsSlice";
import { useSearchParams } from "next/navigation";
import { FilmInfo } from "../components/FilmInfo";
import Link from "next/link";
import styles from "@/app/css/SingleFilm.module.css";

const SingleFilm = () => {

    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const filmId = Number(searchParams.get("id"));
    const films = useSelector((state) => state.films.films);
    const status = useSelector((state) => state.films.status)

    const [film, setFilm] = useState(null);

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchFilms())
        }
    }, [])

    useEffect(() => {
        setFilm(films.find(film => film.id === Number(filmId)))
    }, [films])

    if (status === "loading") return <p>Загрузка...</p>
    if (status === "failed") return <p>Ошибка загрузки</p>
    if (status !== "loading" && !film) return <p>Фильм не найден</p>

    return (
        <div className={styles.movieInfo}>

            <FilmInfo 
                filmInfo={film} 
                showCommentsLink={true} 
                showSimilar={true} 
                showPoster={true}
            />

            <section id={styles.timeTable}>
                <h3>Расписание сеансов</h3><br/>
                {film.timeTable.map((time, index) => 
                        <Link 
                            key={index} 
                            href={`/cinema/filmSession?id=${time.id}`}
                        >
                            {time.sessionTime}
                        </Link>
                )}
            </section>
        </div>
    )
}

export default SingleFilm;