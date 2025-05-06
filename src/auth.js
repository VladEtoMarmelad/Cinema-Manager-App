import axios from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { auth, handlers, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            //credentials: {
            //    name: {},
            //    password: {}
            //},
            authorize: async (credentials) => {
                try {
                    let user = null
                    
                    console.log(credentials.name)
                    console.log(credentials.password)

                    user = await axios.get("http://127.0.0.1:8000/users/")
                    user = user.data.find(user => user.name === credentials.name && user.password === credentials.password)
                    user = {
                        id: user.id,
                        name: user.name,
                        admin: user.admin
                    }

                    return {
                        id: user.id,
                        name: user.name,
                        admin: user.admin
                    }
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
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.admin = user.admin;
            }
            return token;
        }
    }
    //secret: process.env.NEXTAUTH_SECRET
})
