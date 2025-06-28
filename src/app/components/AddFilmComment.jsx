"use client"

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { addComment } from "@/features/filmCommentsSlice";

const AddFilmComment = () => {
    
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [rating, setRating] = useState("");

    const searchParams = useSearchParams();
    const filmId = Number(searchParams.get("id"));
    const session = useSession();

    const validationErrors = useSelector(state => state.filmComments.validationErrors)
    const dispatch = useDispatch();

    const addFilmComment = async (e) => {
        e.preventDefault();
        const userId = session.data.user.id
        await dispatch(
            addComment({
                name: name,
                description: description,
                rating: rating,

                movieId: `http://127.0.0.1:8000/movies/${filmId}/`,
                userId: `http://127.0.0.1:8000/users/${userId}/`
            })
        ).unwrap()
        window.location.reload()
    }

    if (session.status === "loading") return <h1>Загрузка...</h1>
    if (session.status === "unauthenticated") return <h1>Для добавление комментария требуется войти в аккаунт</h1>

    return (
        <>
            {validationErrors.length > 0 && 
                <section className="errorSection" style={{marginTop:'25px'}}>
                    {validationErrors.map((validationError, index) => 
                        <li key={index}>{validationError}</li>
                    )}
                </section>
            }
            <form onSubmit={addFilmComment}>

                <input 
                    value={name} 
                    onChange={(e) => {setName(e.target.value)}} 
                    placeholder="Заголовок комментария..."
                /><br/>

                <input 
                    type="number"
                    value={rating} 
                    onChange={(e) => {setRating(Number(e.target.value))}} 
                    placeholder="Оценка фильма..."
                /><br/>

                <textarea 
                    value={description} 
                    onChange={(e) => {setDescription(e.target.value)}} 
                    placeholder="Описание комментария..."
                /><br/>

                {name.length > 0 && description.length > 0 && 
                    <button type="submit" className="blackButton" style={{position:'relative', left:'65em'}}>
                        Оставить комментарий <i className="bi bi-send-fill"/>
                    </button>
                }
            </form>
        </>
    )
}

export { AddFilmComment };