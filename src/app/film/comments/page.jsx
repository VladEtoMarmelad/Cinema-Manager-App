"use client"

import { useSearchParams } from "next/navigation";
import { fetchComments } from "@/features/filmCommentsSlice";
import { fetchFilms } from "@/features/filmsSlice";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AddFilmComment } from "@/app/components/AddFilmComment";
import { useSession } from "next-auth/react";
import { deleteComment } from "@/features/filmCommentsSlice";
import styles from "@/app/css/FilmComments.module.css"

const FilmComments = () => {

    const searchParams = useSearchParams();
    const [film, setFilm] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const filmId = Number(searchParams.get("id"));

    const comments = useSelector((state) => state.filmComments.comments);
    const status = useSelector((state) => state.filmComments.status)

    const films = useSelector((state) => state.films.films);
    const filmsStatus = useSelector((state) => state.films.status)
    
    const dispatch = useDispatch();
    const session = useSession();

    useEffect(() => {
        if (filmId) {
            let userId = null

            if (session.data) { 
                userId = Number(session.data.user.id)
            }

            dispatch(fetchComments({
                movieId: filmId,
                userId: userId
            }))

            if (status === "idle") {
                dispatch(fetchFilms())
            }
        }
    }, [filmId, session])

    useEffect(() => {
        setFilm(films.find(film => film.id === Number(filmId)))
    }, [films])

    useEffect(() => {
        if (session.data) {
            if (comments.find(comment => comment.user.id === Number(session.data.user.id))) {
                setShowAddForm(false)
            } else setShowAddForm(true)
        }
    }, [comments, session])

    if (status === "loading" || filmsStatus === "loading" || session.status === "loading") return <p>Загрузка...</p>
    if (status === "failed") return <p>Ошибка загрузки комментариев</p>

    if (filmsStatus === "failed") return <p>Ошибка загрузки информации фильма</p>
    if (filmsStatus !== "loading" && !film) return <p>Фильм не найден</p>

    return (
        <>
            <section id={styles.filmContainer} style={{position:'relative', top:'50px', marginBottom:'50px'}}>
                <img src={film.poster} alt="Постер Фильма" style={{borderRadius:'15px'}}/>
                <section id={styles.filmInfoContainer}>
                    <h2>{film.name}</h2>
                    <h3>{film.rating}/10</h3>
                </section>
            </section>

            <h2 style={{marginTop:'150px'}}>{comments.length} комментариев</h2>

            {showAddForm && <AddFilmComment />}

            {comments.length > 0 ?
                <section id={styles.commentsContainer}>
                    {comments.map(comment => 
                        <div key={comment.id} style={{marginTop:'50px'}}>
                            <p>{comment.user.name}</p>
                            <h3 style={{display:'inline-block'}}>{comment.name}</h3> <h4 style={{display:'inline'}}>{comment.rating}/10</h4><br/>
                            <p style={{display:'inline-block'}}>{comment.description}</p>

                            {session.status === "authenticated" && Number(comment.user.id) === Number(session.data.user.id) && 
                                <span style={{marginLeft:'15px'}}>
                                    <button 
                                        className="grayButton"
                                        onClick={
                                            (e) => {
                                                e.preventDefault();
                                                dispatch(
                                                    deleteComment({
                                                        commentId: comment.id, 
                                                        movieId: film.id
                                                    })
                                                )
                                            }
                                        }
                                    >
                                        <i className="bi bi-trash3-fill"/>
                                    </button>
                                </span>
                            }

                        </div>
                    )}
                </section> : <h3>К этому фильму нету коментариев...</h3>
            }
        </>
    )
}

export default FilmComments;