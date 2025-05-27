"use client"

import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { AddRoom } from "@/app/components/AddRoom";
import Link from "next/link";
import styles from "@/app/css/CinemaAdminPage.module.css"

const CinemaAdminPage = () => {
    const session = useSession();

    const searchParams = useSearchParams();
    const cinemaId = Number(searchParams.get("id"));

    if (session.status === "loading") return <h2>Загрузка...</h2>
    if (session.status === "unauthenticated") return <Link href="/signin" className="grayButton">Войдите в аккаунт...</Link>
    if (session.status === "authenticated" && session.data.user.cinemaAdmin !== cinemaId) return <h2>Вы не являетесь админом этого кинотеатра</h2>

    return (
        <div className={styles.container}>

            <AddRoom />

            <section>
                <h2>Добавление сеанса кино</h2>
                <form>
                    <input 
                        type="datetime-local"
                        placeholder="Время сеанса..."
                    />
                </form>
            </section>
        </div>
    )
}

export default CinemaAdminPage;