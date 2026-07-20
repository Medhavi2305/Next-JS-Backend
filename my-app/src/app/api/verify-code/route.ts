import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export async function POST(request: Request){
    await dbConnect()

    try {
        const {username, code} = await request.json()
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username: decodedUsername})
        if(!user){
            return Response.json({
                success: false,
                message: 'user not found'
            }, {status: 500})
        }
        const isCodeValid = user.verifyCode === code
        const isCodeNotExpierd = new Date(user.verifyCodeExpiry) > new Date()

        if(isCodeValid && isCodeNotExpierd){
            user.isVerifyed = true 
            await user.save()

            return Response.json({
                success: true,
                message: 'Account Verified Successfully'
            }, {status: 200})
        }else if(!isCodeNotExpierd){
            return Response.json({
                success: false,
                message: 'User code expired'
            }, {status: 500})
        }else if(!isCodeValid){
            return Response.json({
                success: false,
                message: 'Code incorrect'
            }, {status: 500})
        }
    } catch (error) {
        console.log('verifing user', error)
        return Response.json({
            success: false,
            message: 'Error in verifing code'
        },{status: 500})
    }
}