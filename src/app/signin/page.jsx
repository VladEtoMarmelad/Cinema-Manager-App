"use client"

import { SignIn } from "@/sign-in";
import { useState } from "react";
import { useSession } from "next-auth/react"

const SignInPage = () => {
    
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const session = useSession();

    const formAuthorizeHandler = (e) => {
        e.preventDefault();
        SignIn({name, password})
    }

    return (
        <div style={{marginLeft:'20em'}}>
            <form onSubmit={formAuthorizeHandler}>
                <input id="nameInput" name="name" value={name} onChange={(e) => {e.preventDefault(); setName(e.target.value)}} placeholder="Имя пользователя..."/><br/>
                <input id="passwordInput" name="password" value={password} onChange={(e) => {e.preventDefault(); setPassword(e.target.value)}} placeholder="Пароль..."/><br/>
                <button type="submit">Войти?</button>
            </form>
        </div>
    )
}

export default SignInPage;