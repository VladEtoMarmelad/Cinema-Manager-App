import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SignIn } from "@/sign-in";
import { userSchema } from '@/zod/userSchema';
import { signInSchema } from '@/zod/signInSchema';
import { catchValidationErrors } from '@/zod/catchValidationErrors';
import axios from 'axios';

export const addUser = createAsyncThunk("users/addUser", async (userData) => {
    const {name, email, password, repeatPassword} = userData

    try {
        await userSchema.parseAsync({
            name: name,
            email: email,
            password: password, 
            repeatPassword: repeatPassword
        });

        await axios.post("http://127.0.0.1:8000/users/", {
            name: name,
            email: email,
            password: password,
            admin: false
        })
        SignIn({name, email, password})

    } catch (error) {
        return catchValidationErrors(error)
    }
})

export const SignInRedux = createAsyncThunk("users/signIn", async (userData) => {
    const {name, password} = userData

    try {
        await signInSchema.parseAsync({
            name: name,
            password: password
        })

        SignIn({name, password})

    } catch (error) {
        return catchValidationErrors(error)
    }
    
})

const usersSlice = createSlice({
    name: "users",
    initialState: {
        userInfo: {
            name: "",
            email: "",
            password: "",
            repeatPassword: ""
        },
        status: "idle",
        error: null,
        validationErrors: []
    },
    reducers: {
        changeUserInfo: (state, action) => {
            const {field, value} = action.payload
            state.userInfo[field] = value
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addUser.fulfilled, (state, action) => {
                if (action.payload) {
                    state.validationErrors = action.payload
                }
            })
            .addCase(addUser.pending, (state) => {
                state.validationErrors = []
            })

            .addCase(SignInRedux.fulfilled, (state, action) => {
                if (action.payload) {
                    state.validationErrors = action.payload
                }
            })
            .addCase(SignInRedux.pending, (state) => {
                state.validationErrors = []
            })
    }
});

export default usersSlice.reducer;
export const { changeUserInfo } = usersSlice.actions;