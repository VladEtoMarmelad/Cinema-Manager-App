import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { SignIn } from "@/sign-in";
import { z } from 'zod';

const userSchema = z.object({
    name: z.string().min(1, "Имя пользователя не должно быть пустой строкой"),
    password: z.string().min(8, "Длина пароля должна быть как минимум 8 символов")
})

export const addUser = createAsyncThunk("users/addUser", async (userData) => {
    const {name, password, repeatPassword} = userData

    const result = userSchema.safeParse({
        name: name,
        password:  password
    });

    console.log(result)

    if (result.success) {
        console.log('Valid user data:', result.data);
        if (name !== "" && password === repeatPassword) {
            let allUsers = await axios.get("http://127.0.0.1:8000/users/")
            allUsers = allUsers.data
            if (allUsers.find(user => user.name === name)) {
                alert("Пользователь с таким именем уже существует")
            } else {
                await axios.post("http://127.0.0.1:8000/users/", {
                    name: name,
                    password: password,
                    admin: false
                })
                SignIn({name, password})
            }
        } else {
            alert("Убедитесь, что все поля заполнены и пароль введён правильно")
        }
    } else {
        console.error('Validation errors:', result.error.format());
    }
})

const usersSlice = createSlice({
    name: "users",
    initialState: {
        userInfo: {
            name: "",
            password: "",
            repeatPassword: ""
        },
        status: "idle",
        error: null
    },
    reducers: {
        changeUserInfo: (state, action) => {
            const {field, value} = action.payload
            state.userInfo[field] = value
        }
    }
});

export default usersSlice.reducer;
export const { changeUserInfo } = usersSlice.actions;