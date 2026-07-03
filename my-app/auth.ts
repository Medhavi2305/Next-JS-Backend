import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const{handlers, signIn, signOut, auth} = NextAuth({
    providers: [
        Credentials({
            id: 'credentials',
            name: 'credentials',
            credentials: {
                identifier: {
                    label: 'Email or Username',
                    type: 'text',
                    placeholder: 'Enter your email or username'
                },
                password: {
                    label: 'Email or Username',
                    type: 'text',
                    placeholder: 'Enter your email or username'
                }
            },
            authorize: async(credentials) => {
                if (!credentials?.identifier || !credentials?.password) {
                return null;
            }
            const identifier = credentials.identifier as string
            const password = credentials.identifier as string

                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            {email: identifier},
                            {username: identifier}
                        ]
                    })
                    if(!user){
                        throw new Error('No user found with this email')
                    }
                    if(!user.isVerifyed) throw new Error('Please verify your account before login')

                    const isPassowrdCorrect = await bcrypt.compare(password, user.password)
                    if(isPassowrdCorrect){
                        return {
                        _id: user._id.toString(),
                        email: user.email,
                        username: user.username,
                        isVerified: user.isVerifyed ,
                        isAcceptingMessage: user.isAcceptingMessage,
                    };
                    }else{
                        throw new Error('Incorrect password')
                    }
                } catch (error: any) {
                    throw new Error(error)
                }
                return null
            }
        })
    ],
    callbacks: {
        async jwt({token, user}){
            if(user){
                token._id = user._id?.toString()
                token.username = user.username
                token.isVerified = user.isVerified
                token.isAcceptingMessage = user.isAcceptingMessage
            }
            return token
        },
        async session({session, token}){
            if(token){
                session.user._id = token._id as string
                session.user.username = token.username as string 
                session.user.isVerified = token.isVerified as boolean 
                session.user.isAcceptingMessage = token.isAcceptingMessage as boolean 
            }
            return session
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET
})