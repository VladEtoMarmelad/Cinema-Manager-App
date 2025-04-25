"use client"

import { useSearchParams } from "next/navigation";
import { fetchComments } from "@/features/filmCommentsSlice";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const FilmComments = () => {

    const searchParams = useSearchParams();
    const filmId = Number(searchParams.get("id"));

    const comments = useSelector((state) => state.filmComments.comments);
    const status = useSelector((state) => state.filmComments.status)

    const dispatch = useDispatch();

    useEffect(() => {
        filmId &&
        dispatch(fetchComments(filmId))
    }, [filmId])

    if (status === "loading") return <p>Загрузка...</p>
    if (status === "failed") return <p>Ошибка загрузки</p>

    return (
        <div style={{marginLeft:'20em'}}>
            <h1>Страница коментариев к фильму с ID: {filmId}</h1>
            <h2>Коментарии:</h2>
            {comments.length > 0 ?
                <ul>
                    {comments.map(comment => 
                        <li key={comment.id} style={{marginTop:'50px'}}>
                            <p>Автор коментария: {comment.user.name}</p>
                            <h3>{comment.name}</h3>
                            <p>{comment.description}</p>
                        </li>
                    )}
                </ul> : <h3>К этому фильму нету коментариев...</h3>
            }
        </div>
    )
}

export default FilmComments;