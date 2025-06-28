"use client"

import { useSelector, useDispatch } from "react-redux"
import { fetchCinema } from "@/features/cinemaSlice"
import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import styles from "@/app/css/CinemaPage.module.css";

const CinemaPage = () => {
    const session = useSession();

    const cinema = useSelector(state => state.cinema.cinemas)
    const status = useSelector(state => state.cinema.status)
    const error = useSelector(state => state.cinema.error)
    const dispatch = useDispatch()

    const searchParams = useSearchParams();
    const cinemaId = Number(searchParams.get("id"));

    const [startIndex, setStartIndex] = useState(0);

    const [comingSoonFilmIndex, setComingSoonFilmIndex] = useState(0)

    let filmSessionsAmount = useRef(0)

    const incrementComingSoonFilmIndex = () => {
        if (status === "succeeded") {
            setComingSoonFilmIndex(prevIndex => 
                prevIndex+1 === cinema.comingSoonFilms.length ? 0 
                : prevIndex+1
            )
        }
    }

    const decrementComingSoonFilmIndex = () => {
        if (status === "succeeded") {
            setComingSoonFilmIndex(prevIndex => 
                prevIndex === 0 ? cinema.comingSoonFilms.length-1
                : prevIndex-1
            )
        }
    }

    useEffect(() => {
        dispatch(fetchCinema(cinemaId))
        const windowWidth = window.outerWidth
        filmSessionsAmount.current = Math.trunc(windowWidth / 375)
    }, [])

    useEffect(() => {
        if (cinema.closestFilmSessionIndex) {
            setStartIndex(cinema.closestFilmSessionIndex)

            const intervalId = setInterval(() => {
                incrementComingSoonFilmIndex()
            }, 7500)
            intervalId
            return () => clearInterval(intervalId)
        }
    }, [cinema])

    if (error) return error
    if (status === "loading" || session.status === "loading" || !cinema.filmSessions) return <h2>Загрузка...</h2>

    const comingSoonFilm = cinema.comingSoonFilms[comingSoonFilmIndex]
    const visibleSessions = cinema.filmSessions.slice(startIndex, startIndex + filmSessionsAmount.current)

    return (
        <div className={styles.generalDiv}>
            {session.status === "authenticated" && session.data.user.cinemaAdmin === cinemaId &&
                <Link href={`/cinema/adminPage?id=${cinemaId}`} className={styles.adminPageLink}>
                    <i className="bi bi-gear-fill"/>
                </Link>
            }

            <h1>{cinema.name}</h1>

            <hr/>

            <section className={styles.ribbonContainer}>
                
                <button 
                    onClick={() => setStartIndex(startIndex - 1)}
                    disabled={startIndex === 0}
                    className={`${styles.rectangleButton} ${styles.left}`}
                    style={{backgroundColor: startIndex === 0 && "darkgray"}}
                />

                <div className={styles.carousel}>
                    {visibleSessions.map(filmSession => {
                        return (
                            <div
                                key={filmSession.id}
                                className={styles.carouselItem}
                            >
                                <img src={filmSession.film.poster} alt="filmPoster" className={styles.bgImage}/>
                                <Link 
                                    href={`/cinema/filmSession?id=${filmSession.id}`} 
                                    key={filmSession.id} 
                                    className={styles.filmSessionsRibbonElement}
                                >
                                    <img src={filmSession.film.poster} style={{borderRadius:'15px'}}/>
                                    <h2>{filmSession.film.name}</h2>
                                    <h4>{filmSession.sessionTime}</h4>
                                </Link>
                            </div>
                        );
                    })}
                </div>

                <button 
                    onClick={() => setStartIndex(startIndex + 1)}
                    disabled={startIndex + 1 >= cinema.filmSessions.length}
                    className={`${styles.rectangleButton} ${styles.right}`}
                    style={{backgroundColor: startIndex + 1 >= cinema.filmSessions.length && "darkgray"}}
                />
            </section>
            <hr/>
            {comingSoonFilm &&
                <section className={styles.comingSoonFilmsContainer}>
                    <h1 style={{position:'relative', bottom:'475px', right:'7.5px'}}>Скоро в прокате</h1>

                    <div style={{backgroundImage: `url(${comingSoonFilm.filmData.poster})`}} className={styles.filmBackgroundImageDiv}/>
                    <section style={{display:'flex', flexDirection:'row', justifyContent: 'space-between', alignItems:'center', width:'32.5vw'}}>
                        <button 
                            onClick={decrementComingSoonFilmIndex} 
                            className={`${styles.squareButton} ${styles.left}`} 
                            style={{height:'50px'}}
                        />
                        
                        <div style={{transform:'scale(1.25, 1.25)'}}>
                            <img src={comingSoonFilm.filmData.poster}/>
                            <h2>{comingSoonFilm.filmData.name}</h2>
                            <h3>{comingSoonFilm.closestSessionTime}</h3>
                        </div>

                        <button 
                            onClick={incrementComingSoonFilmIndex} 
                            className={`${styles.squareButton} ${styles.right}`} 
                            style={{height:'50px'}}
                        />
                            
                    </section>
                </section>
            }
            
        </div>
    )
}

export default CinemaPage;