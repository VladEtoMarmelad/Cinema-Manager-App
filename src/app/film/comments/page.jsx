"use client"

import { useSearchParams } from "next/navigation";
import { fetchComments } from "@/features/filmCommentsSlice";
import { fetchFilms } from "@/features/filmsSlice";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AddFilmComment } from "@/app/components/AddFilmComment";
import styles from "@/app/css/FilmComments.module.css"

const FilmComments = () => {

    const searchParams = useSearchParams();
    const [film, setFilm] = useState(null);

    const filmId = Number(searchParams.get("id"));

    const comments = useSelector((state) => state.filmComments.comments);
    const status = useSelector((state) => state.filmComments.status)

    const films = useSelector((state) => state.films.films);
    const filmsStatus = useSelector((state) => state.films.status)
    
    const dispatch = useDispatch();

    useEffect(() => {
        filmId &&
        dispatch(fetchComments(filmId))
        if (status === "idle") {
            dispatch(fetchFilms())
        }
    }, [filmId])

    useEffect(() => {
        setFilm(films.find(film => film.id === Number(filmId)))
    }, [films])

    if (status === "loading" || filmsStatus === "loading") return <p>Загрузка...</p>
    if (status === "failed") return <p>Ошибка загрузки комментариев</p>

    if (filmsStatus === "failed") return <p>Ошибка загрузки информации фильма</p>
    if (filmsStatus !== "loading" && !film) return <p>Фильм не найден</p>

    return (
        <div style={{marginLeft:'20em'}}>
            <section id={styles.filmContainer} style={{position:'relative', top:'50px', marginBottom:'50px'}}>
                <img src={film.poster} alt="Постер Фильма" style={{borderRadius:'15px'}}/>
                <section id={styles.filmInfoContainer}>
                    <h2>{film.name}</h2>
                    <h3>{film.rating}/10</h3>
                </section>
            </section>

            <h2 style={{marginTop:'150px'}}>{comments.length} комментариев</h2>

            <AddFilmComment />

            {comments.length > 0 ?
                <section id={styles.commentsContainer}>
                    {comments.map(comment => 
                        <div key={comment.id} style={{marginTop:'50px'}}>
                            <p>{comment.user.name}</p>
                            <h3 style={{display:'inline-block'}}>{comment.name}</h3> <h4 style={{display:'inline'}}>{comment.rating}/10</h4>
                            <p>{comment.description}</p>
                        </div>
                    )}
                </section> : <h3>К этому фильму нету коментариев...</h3>
            }
        </div>
    )
}

export default FilmComments;