"use client"

import { useSelector, useDispatch } from "react-redux"
import { changeUserInfo } from "@/features/usersSlice"
import { addUser } from "@/features/usersSlice"
import { GoogleSignInButton } from "../components/GoogleSignInButton"
import Link from "next/link";
import styles from "@/app/css/Auth.module.css"

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
            email: userInfo.email,
            password: userInfo.password,
            repeatPassword: userInfo.repeatPassword
        }))
    }

    return (
        <div className={`centerContainer ${styles.generalDiv}`}>
            {validationErrors.length > 0 &&
                <section className="errorSection" style={{marginBottom: '15px'}}>
                    {validationErrors.map((error, index) => 
                        <li key={index}>{error}</li>
                    )}
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
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => changeUserInfoHandler("email", e.target.value)}
                    placeholder="Email пользователя..."
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
                />

                <span className="centerContainer">
                    <button type="submit" className="blackButton">Зарегестрироваться</button>
                </span>
            </form>

            <div className="centerContainer" style={{alignItems: 'center', color:'gray'}}>
                <hr style={{display: 'inline-block', backgroundColor:'gray', width:'5%', height:'1px'}}/>
                <p style={{display:'inline', padding:'15px'}}>или</p>
                <hr style={{display: 'inline-block', backgroundColor:'gray', width:'5%', height:'1px'}}/>
            </div>

            <div className="centerContainer">
                <GoogleSignInButton>Зарегестрироваться используя Google</GoogleSignInButton>
            </div>

            <span className="centerContainer">
                <Link href="signin" className="grayButton">Уже есть аккаунт? Войти...</Link>
            </span>
        </div>
    )
}

export default Register