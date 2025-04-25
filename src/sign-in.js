"use server"
import { signIn } from "./auth";

export const SignIn = async (data) => {
    return await signIn("credentials", data)
}