"use client"

import Link from "next/link";
import { SignInRedux } from "@/features/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import { changeUserInfo } from "@/features/usersSlice";
import { GoogleSignInButton } from "../components/GoogleSignInButton";

const SignInPage = () => {
    const userInfo = useSelector((state) => state.users.userInfo)
    const validationErrors = useSelector((state) => state.users.validationErrors)
    const dispatch = useDispatch();

    const changeUserInfoHandler = (field, value) => {
        dispatch(changeUserInfo({field: field, value: value}))
    }

    const formAuthorizeHandler = (e) => {
        e.preventDefault();
        dispatch(SignInRedux({
            name: userInfo.name,
            password: userInfo.password
        }))
    }

    return (
        <div style={{position:'relative', top:'15px'}}>

            {validationErrors.length > 0 && 
                <section className="errorSection">
                    {
                        validationErrors.map((message, index) => 
                            <li key={index}>{message}</li>
                        )
                    }
                </section>
            }

            <form onSubmit={formAuthorizeHandler}>
                <input 
                    type="text"
                    value={userInfo.name} 
                    onChange={(e) => changeUserInfoHandler("name", e.target.value)} 
                    placeholder="Имя пользователя..."
                /><br/>

                <input 
                    type="password" 
                    value={userInfo.password} 
                    onChange={(e) => changeUserInfoHandler("password", e.target.value)} 
                    placeholder="Пароль..."
                /><br/>

                <span className="centerContainer">
                    <button type="submit" className="blackButton">Войти в аккаунт</button>
                </span>
            </form>

            <div className="centerContainer" style={{alignItems: 'center', color:'gray'}}>
                <hr style={{display: 'inline-block', backgroundColor:'gray', width:'5%', height:'1px'}}/>
                <p style={{display:'inline', padding:'15px'}}>или</p>
                <hr style={{display: 'inline-block', backgroundColor:'gray', width:'5%', height:'1px'}}/>
            </div>

            <div className="centerContainer">
                <GoogleSignInButton/>
            </div>

            <span className="centerContainer">
                <Link href="/register" className="grayButton">Нету аккаунта? Зарегестрируйтесь!</Link>
            </span>

        </div>
    )
}

export default SignInPage;