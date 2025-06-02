"use server"
import { signOut } from "./app/api/auth/[...nextauth]/auth";

export const SignOut = async () => {
    return await signOut()
}