"use client"

import { SignIn } from "@/sign-in";
import { useState } from "react";
import Link from "next/link";
import styles from "@/app/css/Register.module.css";

const SignInPage = () => {
    
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const formAuthorizeHandler = (e) => {
        e.preventDefault();
        SignIn({name, password})
    }

    return (
        <>
            <form onSubmit={formAuthorizeHandler}>
                <input id="nameInput" name="name" value={name} onChange={(e) => {e.preventDefault(); setName(e.target.value)}} placeholder="Имя пользователя..."/><br/>
                <input id="passwordInput" name="password" value={password} onChange={(e) => {e.preventDefault(); setPassword(e.target.value)}} placeholder="Пароль..."/><br/>
                <span id={styles.container}>
                    <button type="submit" className="blackButton">Войти в аккаунт</button>
                </span>
            </form>
            <span id={styles.container}>
                <Link href="/register" className="grayButton">Нету аккаунта? Зарегестрируйтесь!</Link>
            </span>
        </>
    )
}

export default SignInPage;