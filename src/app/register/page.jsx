"use client"

import { useSelector, useDispatch } from "react-redux"
import { changeUserInfo } from "@/features/usersSlice"
import { addUser } from "@/features/usersSlice"
import Link from "next/link";
import styles from "@/app/css/Register.module.css";

const Register = () => {
    
    const userInfo = useSelector((state) => state.users.userInfo)

    const dispatch = useDispatch();

    const changeUserInfoHandler = (field, value) => {
        dispatch(changeUserInfo({field: field, value: value}))
    }

    const registerHandler = (e) => {
        e.preventDefault();
        dispatch(addUser({
            name: userInfo.name,
            password: userInfo.password,
            repeatPassword: userInfo.repeatPassword
        }))
    }

    return (
        <>
            <form onSubmit={registerHandler}>
                <input 
                    type="text"
                    value={userInfo.name}
                    onChange={(e) => changeUserInfoHandler("name", e.target.value)}
                    placeholder="Имя пользователя..."
                />

                <input 
                    type="password"
                    value={userInfo.password}
                    onChange={(e) => changeUserInfoHandler("password", e.target.value)}
                    placeholder="Пароль..."
                />

                <input 
                    type="password"
                    value={userInfo.repeatPassword}
                    onChange={(e) => changeUserInfoHandler("repeatPassword", e.target.value)}
                    placeholder="Повторите пароль..."
                /><br/>

                <span id={styles.container}>
                    <button type="submit" className="blackButton">Зарегестрироваться</button>
                </span>
            </form>
            <span id={styles.container}>
                <Link href="signin" className="grayButton">Уже есть аккаунт? Войти...</Link>
            </span>
        </>
    )
}

export default Register