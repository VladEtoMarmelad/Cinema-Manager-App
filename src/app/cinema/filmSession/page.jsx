"use client"

import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation";
import { fetchSingleFilmSession } from "@/features/filmSessionSlice";
import { rentCinemaSeat } from "@/features/filmSessionInteractSlice";
import { FilmInfo } from "@/app/components/FilmInfo";
import styles from "@/app/css/FilmSession.module.css"
import Link from "next/link";

const FilmSession = () => {

    const filmSession = useSelector((state) => state.filmSessions.filmSessions)
    const status = useSelector((state) => state.filmSessions.status)
    const error = useSelector((state) => state.filmSessions.error)

    const dispatch = useDispatch()

    const searchParams = useSearchParams();
    const filmSessionId = Number(searchParams.get("id"));

    useEffect(() => {
        dispatch(fetchSingleFilmSession(filmSessionId))
    }, [])

    if (error) return <h2>{error}</h2>
    if (status === "loading" || Array.isArray(filmSession)) return <h2>Загрузка...</h2>

    const changeSeatsHandler = (seatIndex, rowIndex) => {
        dispatch(rentCinemaSeat({
            prevSeats: filmSession.seats,
            filmSessionId: filmSessionId,
            seatIndex,
            rowIndex
        }))
    }

    return (
        <div style={{width:'75%', margin:'auto'}}>
            <div style={{display:'flex', flexDirection:'column', justifyItems:'space-around'}}>
                <div style={{display:'flex', gap:'15px', margin:'15px'}}>
                    <FilmInfo filmInfo={filmSession.film} showPoster={true}/>
                </div>
            <div/>

            <section>
                {filmSession.seats.seats && filmSession.seats.seats.length > 0 && filmSession.seats.seats.map((seatRow) =>
                    seatRow.map((seat, index) => 
                        <div key={index} style={{display:'inline'}}>
                            {seat === "E" &&
                                <div className={`${styles.seat} ${styles.empty}`}/>
                                ||
                                        
                                seat.includes("B") &&
                                    <button
                                        onClick={() => changeSeatsHandler(seatRow.indexOf(seat), filmSession.seats.seats.indexOf(seatRow))}
                                        className={`${styles.seat} ${styles.basic}`}
                                    />
                                ||

                                seat.includes("V") && 
                                    <button
                                        onClick={() => changeSeatsHandler(seatRow.indexOf(seat), filmSession.seats.seats.indexOf(seatRow))}
                                        className={`${styles.seat} ${styles.VIP}`}
                                    />
                                ||

                                seat.includes("O") && <div className={`${styles.seat} ${styles.owned}`}/> 
                            }
                            {index+1 === seatRow.length && <br/>}
                        </div>     
                    )   
                )}
            </section>
            </div>
        </div>
    )
}

export default FilmSession;