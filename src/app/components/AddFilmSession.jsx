"use client"

import { useSelector, useDispatch } from "react-redux";
import { fetchCinemaRooms } from "@/features/cinemaSlice";
import { addFilmSession, changeFilmSessionsInfo } from "@/features/filmSessionInteractSlice";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSomeFilmsByName } from "@/features/filmsSlice";
import styles from "@/app/css/CinemaAdminPage.module.css"

const AddFilmSession = () => {
    const searchFilms = useSelector(state => state.films.searchFilms)
    const allCinemaRooms = useSelector(state => state.cinema.rooms)
    const filmSessionInfo = useSelector(state => state.filmSessionInteract.filmSessionInfo)
    const dispatch = useDispatch();

    const [filmName, setFilmName] = useState("");
    const [filmId, setFilmId] = useState(null);

    const searchParams = useSearchParams();
    const cinemaId = Number(searchParams.get("id"));

    useEffect(() => {
        dispatch(fetchCinemaRooms(cinemaId))
    }, [])

    const changeFilmSessionsInfoHandler = (field, value) => {
        dispatch(changeFilmSessionsInfo({
            field,
            value
        }))
    }

    const addFilmSessionHandler = (e) => {
        e.preventDefault();
        dispatch(addFilmSession({
            cinemaId: `http://127.0.0.1:8000/cinemas/${cinemaId}/`,
            roomId: `http://127.0.0.1:8000/cinemaRooms/${filmSessionInfo.roomId}/`,
            film: `http://127.0.0.1:8000/movies/${filmSessionInfo.film}/`,
            sessionTime: filmSessionInfo.sessionTime
        }))
    }

    return (
        <section className={styles.addSection}>
            <div className={styles.addSectionName}>
                <h2>Добавление сеанса кино</h2>
            </div>
            <form onSubmit={addFilmSessionHandler} className={styles.addSectionForm}>
                <section className={styles.addFilmSessionFormInputs}>
                    <div>
                        <select onChange={(e) => changeFilmSessionsInfoHandler("roomId", e.target.value)} style={{width:'50%'}}>
                            <option value={null}>Выберите комнату проведения сенса</option>
                            {allCinemaRooms.map(room => 
                                <option 
                                    key={room.id} 
                                    value={room.id}
                                >Комната {room.id}</option>
                            )}
                        </select>
                        <input 
                            onChange={(e) => changeFilmSessionsInfoHandler("sessionTime", e.target.value)}
                            type="datetime-local"
                            placeholder="Время сеанса..."
                            style={{width:'50%'}}
                        />
                    </div>

                    <div>
                        <input 
                            value={filmName}
                            onChange={(e) => {
                                dispatch(
                                    getSomeFilmsByName({
                                        name: e.target.value, 
                                        amount: 3
                                    })
                                );
                                setFilmName(e.target.value)
                            }}
                            placeholder="Введите название фильма..."
                        />
                        {searchFilms.map(film => 
                            <button 
                                key={film.id} 
                                onClick={(e) => {
                                    e.preventDefault();
                                    changeFilmSessionsInfoHandler("film", film.id);
                                    setFilmName(film.name)
                                }}
                                className={styles.filmInputButton}
                            >{film.name}</button>
                        )}
                    </div>
                </section>

                <button 
                    type="submit" 
                    className="blackButton" 
                    style={{margin:'15px'}}
                >Добавить сеанс фильма</button>
            </form>
        </section>
    )
}

export { AddFilmSession };