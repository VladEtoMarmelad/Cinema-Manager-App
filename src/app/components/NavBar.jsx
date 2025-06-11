"use client"

import Link from "next/link";
import styles from "@/app/css/NavBar.module.css"
import { useSession } from "next-auth/react";
import { SignOut } from "@/sign-out";

const NavBar = () => {
    
    const session = useSession();

    if (session.status === "loading") return <h5>Загрузка...</h5>

    return (
        <div className={styles.NavBar}>
            <Link href="/" >Главная <i className="bi bi-house-fill"/></Link>

            {
                session.status === "authenticated" &&
                <section>
                    <Link href="/tickets">
                        Купленные билеты <i className="bi bi-ticket-fill"/>
                    </Link>
                    {!session.data.user.cinemaAdmin ?
                        <section>
                            <Link href="/cinema/add">Зарегестрировать кинотеатр <strong>+</strong></Link>
                        </section>
                    : 
                        <section>
                            <Link href={`/cinema/?id=${session.data.user.cinemaAdmin}`}>
                                Ваш кинотеатр <i className="bi bi-building-fill-gear" style={{fontSize:'20px'}}/>
                            </Link>
                        </section>
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

            <hr style={{marginTop: session.status === "unauthenticated" && "70vh" || "62.5vh"}}/>

            <div name="authorizationSection">
                {session.status === "authenticated" && 
                    <>
                        <h2>{session.data.user.name}</h2>

                        <button 
                            onClick={() => SignOut()} 
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