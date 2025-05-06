"use client"

import { useSelector, useDispatch } from 'react-redux';
import { addFilm, changeFilmInfo } from '@/features/filmInteractSlice';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { FilmInfo } from '@/app/components/FilmInfo';
import styles from "@/app/css/SingleFilm.module.css";

const FilmInteract = () => {
    const session = useSession();

    const dispatch = useDispatch();
    const filmInfo = useSelector((state) => state.filmInteract.filmInfo)
    
    const changeFilmInfoHandler = (field, value) => {
        dispatch(changeFilmInfo({field: field, value: value}))
    }

    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");
    const [showPoster, setShowPoster] = useState(false)

    useEffect(() => {
        let duration = ""
        if (minutes<10) {
            duration = `${hours}:0${minutes}`
        } else {duration = `${hours}:${minutes}`}
        changeFilmInfoHandler("duration", duration)
    }, [hours, minutes])

    if (session.status === "loading") return <p>Загрузка...</p>;
    if (session.status === "unauthenticated") return <p>Нужно войти в аккаунт...</p>
    if (session.status === "authenticated" && !session.data.user.admin) return <p>Добавлять и редактировать фильмы могут только админы сайта</p>

    const addFilmHandler = (e) => {
        e.preventDefault();
        dispatch(addFilm({
            name: filmInfo.name, 
            description: filmInfo.description,
            ageRating: filmInfo.ageRating,
            publishYear: filmInfo.publishYear,
            language: filmInfo.language,
            studio: filmInfo.studio,
            duration: filmInfo.duration,
            director: filmInfo.director,
            scenarist: filmInfo.scenarist,
            production: filmInfo.production
        }))
    }

    return (
        <div style={{marginLeft:'20em'}}>
            
            <div className={styles.movieInfo} style={{marginLeft:'none', width:'75%'}}>
                <FilmInfo filmInfo={filmInfo} showPoster={showPoster}/>
            </div>

            <hr style={{margin: '150px 0 50px 0', width:'75%'}}/>
            
            <form onSubmit={addFilmHandler}>
                <input 
                    type="text" 
                    value={filmInfo.name} 
                    onChange={(e) => changeFilmInfoHandler("name", e.target.value)} 
                    placeholder="Название фильма..."
                /><br/>

                <textarea 
                    type="text" 
                    value={filmInfo.description} 
                    onChange={(e) => changeFilmInfoHandler("description", e.target.value)} 
                    placeholder="Описание фильма..."
                /><br/>

                <input 
                    type="number" 
                    value={filmInfo.ageRating} 
                    onChange={(e) => changeFilmInfoHandler("ageRating", e.target.value)} 
                    placeholder="Возрастное ограничение фильма..."
                /><br/>

                <input 
                    type="number" 
                    value={filmInfo.publishYear} 
                    onChange={(e) => changeFilmInfoHandler("publishYear", e.target.value)} 
                    placeholder="Год релиза фильма..."
                /><br/>
                
                <select onChange={(e) => {e.preventDefault(); changeFilmInfoHandler("language", e.target.value)}}>
                    <option value="">Выберите язык фильма</option>
                    <option value="Англиский">Англиский</option>
                    <option value="Русский">Русский</option>
                    <option value="Украинский">Украинский</option>
                </select><br/>

                <input 
                    type="text" 
                    value={filmInfo.studio} 
                    onChange={(e) => changeFilmInfoHandler("studio", e.target.value)} 
                    placeholder="Студия..."
                /><br/>

                <input 
                    type="number" 
                    value={hours} 
                    min={0} 
                    onChange={(e) => {
                        e.preventDefault();
                        if (e.target.value >= 0) {
                            setHours(e.target.value)
                        }
                    }} 
                    placeholder="Часы..." 
                    style={{width:'37%'}}
                />

                <input 
                    type="number" 
                    value={minutes} 
                    min={0} 
                    max={59} 
                    onChange={(e) => {
                        e.preventDefault();
                        if (e.target.value >= 0 && e.target.value <= 59) {
                            setMinutes(e.target.value);
                        }
                    }}
                    placeholder="Минуты..." 
                    style={{width:'37%', marginLeft:'1%'}}
                /><br/>

                <input 
                    type="text" 
                    value={filmInfo.director} 
                    onChange={(e) => changeFilmInfoHandler("director", e.target.value)} 
                    placeholder="Режжисёр..."
                /><br/>

                <input 
                    type="text" 
                    value={filmInfo.scenarist} 
                    onChange={(e) => changeFilmInfoHandler("scenarist", e.target.value)} 
                    placeholder="Сценарист..."
                /><br/>

                <input 
                    type="text" 
                    value={filmInfo.production} 
                    onChange={(e) => changeFilmInfoHandler("production", e.target.value)} 
                    placeholder="Cтрана производстава..."
                /><br/>

                <input 
                    id="posterInput"
                    type="file"
                    onChange={(e) => {e.preventDefault(); setShowPoster(e.target.files[0] && true || false)}}
                /><br/>

                <button type="submit" className="grayButton" style={{marginTop:'30px'}}>Добавить фильм</button>
            </form>
        </div>
    )
}

export default FilmInteract;