"use client"

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { addComment } from "@/features/filmCommentsSlice";
import { useDispatch } from "react-redux";

const AddFilmComment = () => {
    
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const searchParams = useSearchParams();
    const filmId = Number(searchParams.get("id"));
    const session = useSession();
    const dispatch = useDispatch();

    const addFilmComment = (e) => {
        e.preventDefault();
        dispatch(
            addComment({
                name: name,
                description: description,

                movieId: `http://127.0.0.1:8000/movies/${filmId}/`
            })
        )
    }

    if (session.status === "loading") return <h1 style={{marginLeft:'20em'}}>Загрузка...</h1>
    if (session.status === "unauthenticated") return <h1 style={{marginLeft:'20em'}}>Для добавление комментария требуется войти в аккаунт</h1>

    return (
        <div style={{marginLeft:'20em'}}>
            <h1>Добавление комментария к фильму с ID: {filmId}</h1>

            <form onSubmit={addFilmComment}>
                <input value={name} onChange={(e) => {setName(e.target.value)}} placeholder="Название коментрая..."/><br/>
                <textarea value={description} onChange={(e) => {setDescription(e.target.value)}} placeholder="Описание коментария..."/><br/>

                <button type="submit">Добавить комментарий</button>
            </form>

        </div>
    )
}

export default AddFilmComment;