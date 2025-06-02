"use client"

import { useSelector, useDispatch } from "react-redux"
import { fetchCinema } from "@/features/cinemaSlice"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import styles from "@/app/css/CinemaPage.module.css";

const CinemaPage = () => {
    const session = useSession();

    const cinema = useSelector((state) => state.cinema.cinemas)
    const status = useSelector((state) => state.cinema.status)
    const error = useSelector((state) => state.cinema.error)

    const dispatch = useDispatch()

    const searchParams = useSearchParams();
    const cinemaId = Number(searchParams.get("id"));

    const [filmSessionsRibbonMargin, setFilmSessionsRibbonMargin] = useState(0);

    useEffect(() => {
        dispatch(fetchCinema(cinemaId))
    }, [])

    if (error) return error
    if (status === "loading" || session.status === "loading") return <h2>Загрузка...</h2>

    return (
        <div style={{overflow:'hidden'}}>
            <h1>{cinema.name}</h1>

            <section className={styles.ribbonContainer}>
                <button 
                    onClick={() => {
                        setFilmSessionsRibbonMargin((prevValue) => prevValue+300)
                    }}
                    className={`${styles.circleButton} ${styles.left}`}
                />

                <section className={styles.filmSessionsRibbon} style={{left:`${filmSessionsRibbonMargin}px`}}>
                    {cinema.filmSessions && cinema.filmSessions.map(filmSession => 
                        <Link href={`/cinema/filmSession?id=${filmSession.id}`} key={filmSession.id}>
                            <img src={filmSession.film.poster} style={{borderRadius:'15px'}}/>
                            <h2>{filmSession.film.name}</h2>
                            <h4>{filmSession.sessionTime}</h4>
                        </Link>
                    )}

                    
                </section>
                    <button 
                        onClick={() => {
                            setFilmSessionsRibbonMargin((prevValue) => prevValue-300)
                        }}
                        className={`${styles.circleButton} ${styles.right}`}
                    />
                
            </section>

            {session.status === "authenticated" && session.data.user.cinemaAdmin === cinemaId &&
                <Link href={`/cinema/adminPage?id=${cinemaId}`}>Админская страница</Link>
            }
        </div>
    )
}

export default CinemaPage;