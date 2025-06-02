"use client"

import { useSelector, useDispatch } from "react-redux";
import { fetchFilms } from "@/features/filmsSlice";
import { fetchCinemaRooms } from "@/features/cinemaSlice";
import { addFilmSession, changeFilmSessionsInfo } from "@/features/filmSessionInteractSlice";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const AddFilmSession = () => {
    const allFilms = useSelector(state => state.films.films)
    const allCinemaRooms = useSelector(state => state.cinema.rooms)
    const filmSessionInfo = useSelector(state => state.filmSessionInteract.filmSessionInfo)
    const dispatch = useDispatch();

    const searchParams = useSearchParams();
    const cinemaId = Number(searchParams.get("id"));

    useEffect(() => {
        dispatch(fetchFilms())
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
            roomId: `http://127.0.0.1:8000/cinemaRooms/${filmSessionInfo.roomId}/`,
            film: `http://127.0.0.1:8000/movies/${filmSessionInfo.film}/`,
            sessionTime: filmSessionInfo.sessionTime
        }))
    }

    return (
        <section>
            <h2>Добавление сеанса кино</h2>
            <form onSubmit={addFilmSessionHandler}>
                <select onChange={(e) => changeFilmSessionsInfoHandler("roomId", e.target.value)}>
                    <option value={null}>Выберите комнату проведения сенса</option>
                    {allCinemaRooms.map(room => 
                        <option 
                            key={room.id} 
                            value={room.id}
                        >Комната {room.id}</option>
                    )}
                </select>
                <select onChange={(e) => changeFilmSessionsInfoHandler("film", e.target.value)}>
                    <option value={null}>Выберите фильм</option>
                    {allFilms.map(film => 
                        <option 
                            key={film.id} 
                            value={film.id}
                        >{film.name}</option>
                    )}
                </select>
                <input 
                    onChange={(e) => changeFilmSessionsInfoHandler("sessionTime", e.target.value)}
                    type="datetime-local"
                    placeholder="Время сеанса..."
                /><br/>
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