"use client"

import { useSession } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import { changeCinemaInfo, addCinema } from "@/features/cinemaInteractSlice";

const RegisterCinema = () => {
    
    const session = useSession();
    
    const cinemaInfo = useSelector((state) => state.cinemaInteract.cinemaInfo)

    const dispatch = useDispatch();

    const changeCinemaInfoHandler = (field, value) => {
        dispatch(changeCinemaInfo({field, value}))
    }

    if (session.status === "loading") return <h2>Загрузка...</h2>
    if (session.status === "unauthenticated") return <h2>Чтобы зарегестрировать кинотеатр нужно войти в аккаунт</h2>
    if (session.data.user.cinemaAdmin) return <h2>Вы уже зарегестрировали кинотеатр</h2>

    return (
        <>
            <h1>Форма регистрации кинотеатра</h1>
            <form onSubmit={(e) => {e.preventDefault(); dispatch(addCinema({name: cinemaInfo.name}))}}>
                <input 
                    value={cinemaInfo.name}
                    onChange={(e) => {changeCinemaInfoHandler("name", e.target.value)}}
                    placeholder="Имя кинотеатра..."
                /><br/>
                <button type="submit" className="blackButton">Зарегестрировать кинотеатр</button>
            </form>
        </>
    )
}

export default RegisterCinema;