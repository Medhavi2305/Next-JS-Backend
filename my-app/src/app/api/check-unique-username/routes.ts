import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import z from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){
    await dbConnect()
    try {
        const {searchParams} = new URL(request.url)
        const queryParams = {
            username: searchParams.get('username')
        }
        // VALIDATION WITH ZOD
        const result = usernameQuerySchema.safeParse(queryParams)
        console.log(result)
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
            success: false,
            message: usernameErrors?.length > 0 ? usernameErrors.join(',') : 'Invalid query parameters'
        },{status: 400})
        }
        const {username} = result.data
        console.log(username)

        const existingVerifiedUser = await UserModel.findOne({username, isVerifyed: true})
        if(existingVerifiedUser){
            return Response.json({
            success: false,
            message: 'Username is already exist'
        },{status: 400})
        }

        return Response.json({
            success: true,
            message: 'Username is available'
        },{status: 201})
    } catch (error) {
        console.error(`Error checking username ${error}`)
        return Response.json({
            success: false,
            message: 'Error checking username'
        },{status: 500})
    }
}