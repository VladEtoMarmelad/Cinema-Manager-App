"use client"

import { useSelector, useDispatch } from "react-redux"
import { changeUserInfo } from "@/features/usersSlice"
import { addUser } from "@/features/usersSlice"
import Link from "next/link";

const Register = () => {
    
    const userInfo = useSelector((state) => state.users.userInfo)
    const validationErrors = useSelector((state) => state.users.validationErrors)

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
        <div style={{position:'relative', top:'15px'}}>

            {validationErrors.length > 0 && 
                <section className="errorSection">
                    <ol>
                        {
                            validationErrors.map((message, index) => 
                                <li key={index}>{index+1}. {message}</li>
                            )
                        }
                    </ol>
                </section>
            }

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

                <span className="centerContainer">
                    <button type="submit" className="blackButton">Зарегестрироваться</button>
                </span>
            </form>
            <span className="centerContainer">
                <Link href="signin" className="grayButton">Уже есть аккаунт? Войти...</Link>
            </span>
        </div>
    )
}

export default Register