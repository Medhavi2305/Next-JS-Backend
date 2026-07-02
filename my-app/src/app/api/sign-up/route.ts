import { sendVerificationEmail } from "@/helpers/sendVErificationEmails";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs";
import { success } from "zod";

export async function POST(request: Request){
    await dbConnect()
    try {
    const {username, email, password} = await request.json()
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

    const existingUserVerifedByUsername = await UserModel.findOne({
        username,
        isVerifyed: true
    })
    if(existingUserVerifedByUsername){
        return Response.json({
            success: false,
            message: 'Username is already taken'
        },{status: 400})
    }

    // FINDING USER BY EMAIL
    const existingUserByEmail = await UserModel.findOne({email})
    if (existingUserByEmail) {
        if(existingUserByEmail.isVerifyed){
            return Response.json({
            success: false,
            message: 'User already exist with this email'
        }, {status: 400})
        }else{
            const hasedPassword = await bcrypt.hash(password, 10)
            existingUserByEmail.password = hasedPassword
            existingUserByEmail.verifyCode = verifyCode
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
            await existingUserByEmail.save()
        }
    }else{
        const hashPassword = await bcrypt.hash(password, 10)
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 1)

        const newUser = new UserModel({
                username,
                email,
                password: hashPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerifyed: false,
                isAcceptingMessage: true,
                messages: []
        })

        await newUser.save()
    }

    // SEND VERIFICATION EMAIL
    const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
    )
    if(!emailResponse.success){
        return Response.json({
            success: false,
            message: emailResponse.message
        }, {status: 500})
    }
    return Response.json({
            success: true,
            message: 'User registerd successfully. please verify your email'
    }, {status: 201})
    } catch (error) {
        console.log('Error registering user', error)
        return Response.json({
            success: false,
            message: 'Error registering user'
        },{
            status: 500
        })
    }
}