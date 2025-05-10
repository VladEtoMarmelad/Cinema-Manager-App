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

            {session.data &&
                session.data.user.admin &&
                <section>
                    <hr/>
                    <div style={{marginTop:'30px'}}>
                        <h4>Админские страницы</h4>
                        <Link href="/film/add">Добавить фильм <strong>+</strong></Link>
                    </div>
                </section>
            }

            <hr style={{marginTop: '70vh'}}/>

            <div name="authorizationSection">
                {session.status === "authenticated" && 
                    <>
                        <h2>{session.data.user.name}</h2>

                        <button onClick={() => SignOut()} className="blackButton" style={{width:'75%'}}>Выйти из аккаунта <i className="bi bi-box-arrow-right"/></button>
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