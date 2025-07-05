"use client"

import { useSession } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import { changeCinemaInfo, addCinema } from "@/features/cinemaInteractSlice";
import { useRouter } from "next/navigation";
import styles from "@/app/css/CinemaAdminPage.module.css"

const RegisterCinema = () => {
    const session = useSession();
    const router = useRouter();

    const cinemaInfo = useSelector((state) => state.cinemaInteract.cinemaInfo)
    const dispatch = useDispatch();

    const changeCinemaInfoHandler = (field, value) => {
        dispatch(changeCinemaInfo({field, value}))
        
    }

    const addCinemaHandler = (e) => {
        e.preventDefault()
        dispatch(addCinema({
            name: cinemaInfo.name, 
            description: cinemaInfo.description
        }))
    }

    if (session.status === "loading") return <h2>Загрузка...</h2>
    if (session.status === "unauthenticated") return <h2>Чтобы зарегестрировать кинотеатр нужно войти в аккаунт</h2>
    if (session.data.user.cinemaAdmin) return <h2>Вы уже зарегестрировали кинотеатр</h2>

    return (
        <div className={styles.addSection} style={{marginTop:'0', marginLeft:'-3.5em', position:'relative', top:'25px'}}>
            <div className={styles.addSectionName}>
                <h2>Форма регистрации кинотеатра</h2>
            </div>
            <form onSubmit={addCinemaHandler} className={styles.addSectionForm}>
                <input 
                    value={cinemaInfo.name}
                    onChange={(e) => {changeCinemaInfoHandler("name", e.target.value)}}
                    placeholder="Имя кинотеатра..."
                /><br/>
                <textarea
                    value={cinemaInfo.description}
                    onChange={(e) => {changeCinemaInfoHandler("description", e.target.value)}}
                    placeholder="Описание кинотеатра..."
                /><br/>
                <button type="submit" className="blackButton" style={{marginTop:'15px'}}>Зарегестрировать кинотеатр</button>
            </form>
        </div>
    )
}

export default RegisterCinema;