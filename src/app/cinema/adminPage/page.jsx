"use client"

import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const CinemaAdminPage = () => {
    const session = useSession();
    
    const searchParams = useSearchParams();
    const cinemaId = Number(searchParams.get("id"));

    if (session.status === "loading") return <h2>Загрузка...</h2>
    if (session.status === "unauthenticated") return <Link href="/signin" className="grayButton">Войдите в аккаунт...</Link>
    if (session.status === "authenticated" && session.data.user.cinemaAdmin !== cinemaId) return <h2>Вы не являетесь админом этого кинотеатра</h2>

    return (
        <>
            <section>
                <h2>Добавление комнаты</h2>
                <form>
                    <input

                    />
                </form>
            </section>

            <section style={{marginTop:'50px'}}>
                <h2>Добавление сеанса кино</h2>
                <form>
                    <input 
                    
                    />
                </form>
            </section>
        </>
    )
}

export default CinemaAdminPage;