"use client"

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchFilms } from "@/features/filmsSlice";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "@/app/css/SingleFilm.module.css";

const FeatureComponent = (props) => {
    return <><h4>{props.title}: <span>{props.value}</span></h4></>
}

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
            <section id={styles.posterSection}>
                <div className={styles.imageLikeDiv}/>
            </section>
            <section id={styles.infoSection}>
                <h1>{film.name}</h1>
                <div style={{marginTop:'30px', marginBottom:'30px'}}>
                    <FeatureComponent title="Возрастное ограничение" value={`${film.ageRating}+`}/>
                    <FeatureComponent title="Год" value={film.publishYear}/>
                    <FeatureComponent title="Язык сеанса" value={film.language}/>
                    <FeatureComponent title="Студия" value={film.studio}/>
                    <FeatureComponent title="Длительность" value={film.duration}/>
                    <FeatureComponent title="Режисёр" value={film.director}/>
                    <FeatureComponent title="Сценарист" value={film.scenarist}/>
                    <FeatureComponent title="Производство" value={film.production}/>
                </div>
                <p>{film.description}</p>

                <Link href={`/film/comments/add?id=${filmId}`}>Написать комментарий</Link>
                <Link href={`/film/comments?id=${filmId}`} style={{marginLeft:'15px'}}>Читать коментарии</Link>
                <h3 style={{marginTop:'30px'}}>Смотрите также:</h3>

            </section>
            <section id={styles.timeTable}>
                <h3>Расписание сеансов</h3>
            </section>
        </div>
    )
}

export default SingleFilm;