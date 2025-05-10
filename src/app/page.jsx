"use client"

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { fetchFilms } from "@/features/filmsSlice";
import Link from "next/link";

import styles from "@/app/css/MainPage.module.css";
const MainPage = () => {

    const films = useSelector((state) => state.films.films);
    const status = useSelector((state) => state.films.status);
    const [lastFilm, setLastFilm] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchFilms());
        }
    }, [status, dispatch]);

    useEffect(() => {
        setLastFilm(films[films.length - 1])
    }, [films])

    if (status === 'loading') return <p>Загрузка...</p>;
    if (status === 'failed') return <p>Ошибка загрузки</p>;

    return (
        <div className="text-amber-600">
            <Link id={styles.newFilms} href={lastFilm ? `/film?id=${lastFilm.id}` : "/"}>
                {
                    lastFilm &&
                        <div style={{position:'relative', top:'2.5em', left:'2.5em'}}>
                            <h1>Название последнего известного фильма: {lastFilm.name}</h1>
                            <p>Описание последнего известного фильма: {lastFilm.description}</p>
                        </div>
                }
            </Link>
                
            <section id={styles.allFilms}>
                {films.map(film => 
                    <div key={film.id} id={styles.oneFilm} style={{marginTop:'10em'}}>
                        <Link href={`/film?id=${film.id}`}>
                            <div style={{borderRadius:'15px', backgroundColor:'#2d2d2d', width:'200px', height:'300px'}}/>
                        </Link>

                        <Link href={`/film?id=${film.id}`} style={{height:'fit-content', marginLeft:'5px'}}>
                            <h2>{film.ageRating}+ {film.name}</h2>
                        </Link>
                    </div>
                )} 
            </section>
        </div>
    )
};

export default MainPage;