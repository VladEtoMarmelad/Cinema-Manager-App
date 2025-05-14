import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { SignIn } from "@/sign-in";
import { z } from 'zod';
import { userSchema } from '@/zod/userSchema';
import { signInSchema } from '@/zod/signInSchema';

export const addUser = createAsyncThunk("users/addUser", async (userData) => {
    const {name, password, repeatPassword} = userData

    try {
        await userSchema.parseAsync({
            name: name,
            password: password, 
            repeatPassword: repeatPassword
        });

        await axios.post("http://127.0.0.1:8000/users/", {
            name: name,
            password: password,
            admin: false
        })
        SignIn({name, password})

    } catch (error) {
        if (error instanceof z.ZodError) {
            const validationErrors = []

            for (let i=0; i<error.errors.length; i+=1) {
                validationErrors.push(error.errors[i].message)
            }

            return validationErrors
        } else {
            console.error("Unexpected error:", error);
        }
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
        if (error instanceof z.ZodError) {
            const validationErrors = []

            for (let i=0; i<error.errors.length; i+=1) {
                validationErrors.push(error.errors[i].message)
            }

            return validationErrors
        } else {
            console.error("Unexpected error:", error);
        }
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