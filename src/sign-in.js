"use server"
import { signIn } from "./app/api/auth/[...nextauth]/auth";

export const SignIn = async (data) => {
    return await signIn("credentials", data)
}

export const SignInGoogle = async () => {
    return await signIn("google")
}