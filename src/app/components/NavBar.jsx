"use client"

import Link from "next/link";
import styles from "@/app/css/NavBar.module.css"
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const NavBar = () => {
    
    const session = useSession();
    const router = useRouter()

    if (session.status === "loading") return <h5>Загрузка...</h5>

    return (
        <div className={styles.NavBar}>
            <Link href="/" >Главная <i className="bi bi-house-fill"/></Link>
            <Link href="/search">Поиск <i className="bi bi-search"/></Link>
            {
                session.status === "authenticated" &&
                <section>
                    <Link href="/tickets">
                        Купленные билеты <i className="bi bi-ticket-fill"/>
                    </Link>
                    {!session.data.user.cinemaAdmin ?
                        <Link href="/cinema/add">Зарегестрировать кинотеатр <strong>+</strong></Link>
                    : 
                        <Link href={`/cinema/?id=${session.data.user.cinemaAdmin}`}>
                            Ваш кинотеатр <i className="bi bi-building-fill-gear" style={{fontSize:'20px'}}/>
                        </Link>
                    }
                </section>
            }

            {session.status === "authenticated" &&
                session.data.user.admin &&
                    <section>
                        <hr/>
                        <div style={{marginTop:'30px'}}>
                            <h4>Админские страницы</h4>
                            <Link href="/film/add">Добавить фильм <strong>+</strong></Link>
                        </div>
                    </section>
            }

            <hr style={{marginTop: session.status === "unauthenticated" ? "37.5em" : "30em"}}/>

            <div name="authorizationSection">
                {session.status === "authenticated" && 
                    <>
                        <h2>{session.data.user.name}</h2>

                        <button 
                            onClick={() => {
                                signOut();
                                router.refresh()
                            }}
                            className="blackButton" 
                            style={{width:'75%'}}
                        >
                            Выйти из аккаунта <i className="bi bi-box-arrow-right"/>
                        </button>
                    </>
                }

                {session.status === "unauthenticated" && 
                    <>
                        <Link href="/signin" style={{marginTop:'25px'}}>Войти в аккаунт <i className="bi bi-box-arrow-in-left"/></Link>
                        <Link href="/register" style={{marginTop:'25px'}}>Зарегестрироваться <i className="bi bi-person-plus-fill"/></Link>
                    </>
                }
            </div>
        </div>
    )
}

export default NavBar;