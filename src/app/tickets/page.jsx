"use client"

import { useSession } from "next-auth/react";
import { getUserTickets, deleteUsedTicket } from "@/features/filmTicketSlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/app/css/OwnedTickets.module.css"

const OwnedTickets = () => {
    const session = useSession();
    
    const userTickets = useSelector(state => state.filmTicket.filmTickets)
    const error = useSelector(state => state.filmTicket.error)
    const dispatch = useDispatch();
    useEffect(() => {
        if (session.status === "authenticated") {
            dispatch(getUserTickets(session.data.user.id))
        }
    }, [session])

    const [showUsed, setShowUsed] = useState(false);
    const [showAreYouSure, setShowAreYouSure] = useState(false);

    if (error) return <h2>{error}</h2>
    if (session.status === "loading" || Object.keys(userTickets).length===0) return <h2>Загрузка...</h2>
    if (session.status === "unauthenticated") return <Link href="/signin" className="grayButton">Войдите в аккаунт</Link>

    return (
        <div className={styles.generalDiv}>
            <div style={{filter: `blur(${showAreYouSure ? '5' : '0'}px)`}}>
                <span className="centerContainer" style={{margin:0, marginBottom:'50px'}}>
                    <h2>
                        {showUsed ? "Использованные билеты" : "Неиспользованные билеты"}
                    </h2>
                </span>

                <div className={styles.ticketAndControlDiv}>
                    {(showUsed && userTickets.used.length > 0) || (!showUsed && userTickets.notUsed.length > 0) ?
                        <section className={styles.ticketsSection}>
                            {userTickets[showUsed ? "used" : "notUsed"].map(ticket => 
                                <div key={ticket.id}>
                                    <img src={ticket.film.poster} style={{borderRadius:'15px', height:'300px', width:'auto'}}/>
                                    <h2>{ticket.film.name}</h2>
                                    <h2>Кинотеатр: {ticket.cinemaName}</h2>
                                    <h2>ID комнаты: {ticket.roomId}</h2>
                                    <h2>Номер комнаты: {ticket.roomNumber}</h2>
                                    <h2>Ряд: {ticket.seatRowIndex}</h2>
                                    <h2>Место: {ticket.seatType}{ticket.seatNumber}</h2>
                                    <h2>Время сеанса: {ticket.sessionTime}</h2>
                                </div>
                            )}
                        </section>
                            : 
                        <span className="centerContainer">
                            <h2>У вас нет {showUsed ? "использованных" : ""} билетов</h2>
                        </span>
                    }
                    <section name="controlSection">
                        <div style={{display:'flex', alignItems: 'flex-end'}}>
                            <i className="bi bi-filter" style={{fontSize:'35px', marginRight:'15px'}}/>
                            <select onChange={(e) => setShowUsed(e.target.value === "true")}>
                                <option value={false}>Неиспользованные билеты</option>
                                <option value={true}>Использованные билеты</option>
                            </select>
                        </div>

                        {(showUsed && userTickets.used.length > 0) && 
                            <span className="centerContainer" style={{marginTop:'25px', position:'relative', left:'50px'}}>
                                <button onClick={() => setShowAreYouSure(true)} className="redButton">
                                    Удалить билеты <i className="bi bi-trash3-fill"/>
                                </button>
                            </span>
                        }
                    </section>
                </div>

                <hr style={{marginTop:'15px'}}/>
                <p>(P.S. Отсчёт номеров места и ряда начинаются с 0. 0-самый первый, а 1-второй)</p>
            </div>

            {showAreYouSure &&
                <div className={styles.alertDiv}>
                    <h1>Вы уверены, что хотите удалить все использованные билеты?</h1>
                    <button onClick={() => dispatch(deleteUsedTicket())} className="redButton" style={{width:'50px', margin: '15px'}}>Да</button>
                    <button onClick={() => setShowAreYouSure(false)} className="blackButton" style={{width:'50px', margin: '15px'}}>Нет</button>
                </div>
            }

        </div>
    )
}

export default OwnedTickets;