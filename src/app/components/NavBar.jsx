"use client"

import Link from "next/link";
import styles from "@/app/css/NavBar.module.css"
import { useSession } from "next-auth/react";
import { SignOut } from "@/sign-out";

const NavBar = () => {
    
    const session = useSession();

    return (
        <div className={styles.NavBar}>
            <Link href="/">Главная</Link>
            <Link href="/second">To second</Link>

            <hr/>

            {session.data && 
            <>
                <h2>{session.data.user.name}</h2>

                <button onClick={() => SignOut()} className="blackButton" style={{width:'75%', alignSelf:'center'}}>Выйти из аккаунта</button>
            </>
            }

            {!session.data && 
            <>
                <Link href="/signin">Войти в аккаунт</Link>
            </>
            }

        </div>
    )
}

export default NavBar;