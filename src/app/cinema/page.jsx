"use client"

import { useSelector, useDispatch } from "react-redux"
import { fetchCinemas } from "@/features/cinemaSlice"
import { useEffect } from "react"

const CinemaPage = () => {
    
    const cinemas = useSelector((state) => state.cinema.cinemas)
    const status = useSelector((state) => state.cinema.status)
    const error = useSelector((state) => state.cinema.error)

    const dispatch = useDispatch()

    useEffect(() => {
        if (status !== "succeeded") {
            dispatch(fetchCinemas())
        }
    }, [])

    if (status === "loading") return <h2>Загрузка...</h2>

    return (
        <>
            {cinemas.map(cinema => 
                <div key={cinema.id}>
                    <h1>{cinema.name}</h1>
                </div>
            )}
        </>
    )
}

export default CinemaPage;