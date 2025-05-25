import axios from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { URLSlice } from "./URLSlice.mjs";

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            authorize: async (credentials) => {
                try {
                    let user = null

                    user = await axios.get("http://127.0.0.1:8000/users/")
                    user = user.data.find(user => user.name === credentials.name && user.password === credentials.password)
                    user = {
                        id: user.id,
                        name: user.name,
                        admin: user.admin,
                        cinemaAdmin: Number(URLSlice(user.cinemaAdmin, 30))
                    }

                    return user
                } catch (error) {
                    return null
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.admin = token.admin;
            session.user.cinemaAdmin = token.cinemaAdmin;
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.admin = user.admin;
                token.cinemaAdmin = user.cinemaAdmin;
            }
            return token;
        }
    }
    //secret: process.env.NEXTAUTH_SECRET
})
