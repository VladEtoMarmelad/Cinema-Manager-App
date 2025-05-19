"use client"

import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation";
import { fetchSingleRoom } from "@/features/roomSlice";
import { changeSeats } from "@/features/roomSlice";
import Link from "next/link";

const CinemaRoom = () => {

    const room = useSelector((state) => state.rooms.rooms)
    const status = useSelector((state) => state.rooms.status)
    const error = useSelector((state) => state.rooms.error)

    const dispatch = useDispatch()

    const searchParams = useSearchParams();
    const roomId = Number(searchParams.get("id"));

    useEffect(() => {
        dispatch(fetchSingleRoom(roomId))
    }, [])

    if (error) return <h2>Ошибка...</h2>
    if (status === "loading" || Array.isArray(room)) return <h2>Загрузка...</h2>

    const changeSeatsHandler = (seat, seatIndex, rowIndex) => {
        console.log(`buying seat ${seat} in row ${rowIndex}...`)
        dispatch(changeSeats({
            seat, 
            seatIndex,
            rowIndex
        }))
    }

    return (
        <>
            <h3>id комнаты: {room.id}</h3>
                <h4>id кинотеатра комнаты: {room.cinemaId}</h4>
                <h4>
                    Фильм: <Link 
                        href={`/film?id=${room.nextFilm.id}`} 
                        style={{textDecoration:'underline'}}
                    >
                        {room.nextFilm.name}
                    </Link>
                </h4>
                <h4>Время следующего сеанса: <time>{room.nextFilmTime}</time></h4>
                <h4>Сидения в комнате:</h4>
                {room.seats.seats && room.seats.seats.length > 0 && room.seats.seats.map((seatRow) =>
                    seatRow.map((seat, index) => 
                        <div key={index} style={{display:'inline'}}>
                            {seat === "E" ? 
                                <div style={{backgroundColor:'white', width:'50px', height:'50px', display:'inline-block', marginLeft:'5px'}}/> 
                            :
                                seat.includes("B") ?
                                    <button
                                        onClick={() => changeSeatsHandler(seat ,seatRow.indexOf(seat), room.seats.seats.indexOf(seatRow))}
                                        style={{backgroundColor:'black', width:'50px', height:'50px', display:'inline-block', marginLeft:'5px'}}
                                    />
                                : <div style={{backgroundColor:'gray', width:'50px', height:'50px', display:'inline-block', marginLeft:'5px'}}/> 
                            }
                            {index+1 === seatRow.length && <br/>}
                        </div>
                    )
                )}
        </>
    )
}

export default CinemaRoom;