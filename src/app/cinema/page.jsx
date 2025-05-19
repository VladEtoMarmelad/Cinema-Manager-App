"use client"

import { useSelector, useDispatch } from "react-redux"
import { fetchCinemas } from "@/features/cinemaSlice"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const CinemaPage = () => {
    
    const cinemas = useSelector((state) => state.cinema.cinemas)
    const status = useSelector((state) => state.cinema.status)
    const error = useSelector((state) => state.cinema.error)

    const [cinema, setCinema] = useState(null);

    const dispatch = useDispatch()

    const searchParams = useSearchParams();
    const cinemaId = Number(searchParams.get("id"));

    useEffect(() => {
        if (status !== "succeeded") {
            dispatch(fetchCinemas())
        }
    }, [])

    useEffect(() => {
        if (cinemas.length > 0) {
            setCinema(cinemas.find(cinema => cinema.id === cinemaId))
        }
    }, [cinemas])

    if (status === "loading" || !cinema) return <h2>Загрузка...</h2>

    return (
        <>
            <h1>{cinema.name}</h1>
            <h2>Залы кинотеатра:</h2>
            {cinema.rooms.map(room => 
                <div key={room.id}>
                    <h3>id комнаты: {room.id}</h3>
                    <h4>id кинотеатра комнаты: {room.cinemaId}</h4>
                    <Link href={`/cinema/room?id=${room.id}`} className="grayButton">Кинозал {room.id}</Link>
                </div>
            )}
        </>
    )
}

export default CinemaPage;