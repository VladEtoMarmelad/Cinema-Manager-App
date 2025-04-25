"use client"

import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from "react";
import { fetchFilms } from "@/features/filmsSlice";
import { addFilm } from '@/features/filmsSlice';

const Second = () => {
    
    const coolFilms = useSelector((state) => state.films.films);
    const status = useSelector((state) => state.films.status);
    
    const dispatch = useDispatch();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [ageRating, setAgeRating] = useState("");
    const [publishYear, setPublishYear] = useState("")

    useEffect(() => {
            if (status === 'idle') {
                dispatch(fetchFilms());
            }
        }, [status, dispatch]);
    
    if (status === 'loading') return <p>Загрузка...</p>;
    if (status === 'failed') return <p>Ошибка загрузки</p>;

    const addFilmHandler = (e) => {
        e.preventDefault();
        dispatch(addFilm({
            name: name, 
            description: description,
            ageRating: ageRating,
            publishYear: publishYear
        }))
    }

    return (
        <div style={{marginLeft:'20em'}}>
            <form onSubmit={addFilmHandler}>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Название фильма..."/><br/>
                <textarea type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Описание фильма..."/><br/>
                <input type="number" value={ageRating} onChange={(e) => setAgeRating(e.target.value)} placeholder="Возрастное ограничение фильма..."/><br/>
                <input type="number" value={publishYear} onChange={(e) => setPublishYear(e.target.value)} placeholder="Год релиза фильма..."/><br/>
                <button type="submit">Добавить фильм</button>
            </form>
        </div>
    )
}

export default Second;