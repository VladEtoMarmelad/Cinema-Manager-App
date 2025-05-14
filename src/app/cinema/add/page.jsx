"use client"

import { useSession } from "next-auth/react";

const RegisterCinema = () => {
    
    const session = useSession();
    
    if (session.status === "loading") return <h2>Загрузка...</h2>
    if (session.status === "unauthenticated") return <h2>Чтобы зарегестрировать кинотеатр нужно войти в аккаунт</h2>

    return (
        <>
            <h1>Форма регистрации кинотеатра</h1>
            <form>
                <input />
            </form>
        </>
    )
}

export default RegisterCinema;