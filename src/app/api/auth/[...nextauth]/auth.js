import axios from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google"
import { URLSlice } from "@/utils/URLSlice.mjs"

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            authorize: async (credentials) => {
                try {
                    if (credentials.password === "null") {
                        credentials.password = null
                    }

                    let user = null
                    user = await axios.get("http://127.0.0.1:8000/users/", {
                        params: {
                            name: credentials.name,
                            password: credentials.password
                        }
                    })
                    user = user.data[0]
                    user = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        admin: user.admin,
                        cinemaAdmin: user.cinemaAdmin ? Number(URLSlice(user.cinemaAdmin, 30)) : null
                    }
                    return user
                } catch (error) {
                    return null
                }
            }
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (account.provider === "google") {
                if (profile.email_verified) {
                    const user = await axios.get("http://127.0.0.1:8000/users/", {
                        params: {email: profile.email}
                    })
                    const userExists = user.data.length > 0 ? true : false
                    if (!userExists) {
                        await axios.post("http://127.0.0.1:8000/users/", {
                            name: profile.name,
                            email: profile.email,
                            password: null,
                            admin: false,
                            cinemaAdmin: null
                        })
                    }
                }
            }
            return true
        },
        async jwt({ token, user, account, profile }) {
            if (user) {
                token.id = user.id;
                token.name = user.name
                token.email = user.email
                token.admin = user.admin;
                token.cinemaAdmin = user.cinemaAdmin;
            }

            if (account && account.provider === "google") {
                let DBuser = await axios.get("http://127.0.0.1:8000/users/", {params: {email: profile.email}})
                DBuser = DBuser.data[0]
                token.id = DBuser.id
                token.name = DBuser.name
                token.email = profile.email
                token.admin = false
                token.cinemaAdmin = DBuser.cinemaAdmin ? Number(URLSlice(DBuser.cinemaAdmin, 30)) : null
            }

            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.name = token.name
            session.user.email = token.email
            session.user.admin = token.admin;
            session.user.cinemaAdmin = token.cinemaAdmin;
            return session;
        },
        async redirect({baseUrl}) {
            return baseUrl
        }
    },
    secret: process.env.NEXTAUTH_SECRET
})
