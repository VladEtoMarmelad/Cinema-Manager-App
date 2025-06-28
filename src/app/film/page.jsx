"use client"

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getSingleFilm } from "@/features/filmsSlice";
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

    console.log(films)

    useEffect(() => {
        dispatch(getSingleFilm(filmId))
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
                showRating={true}
            />

            <span style={{justifyContent: 'end'}}>
                <section id={styles.timeTable}>
                    <h3>Расписание сеансов</h3>
                    {film.timeTable.map((time, index) => 
                        <div key={index}>
                            <Link href={`/cinema/filmSession?id=${time.id}`}>
                                {time.sessionTime}
                            </Link>
                        </div>
                    )}
                </section>
            </span>
        </div>
    )
}

export default SingleFilm;