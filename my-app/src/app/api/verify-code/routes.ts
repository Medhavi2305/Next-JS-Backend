import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export async function POST(request: Request){
    await dbConnect()
    try {
        const {username, code} = await request.json()
        const decodedUsername = decodeURIComponent(username)
        const user = UserModel.findOne({username: decodedUsername})
        if(!user){
           return Response.json({
            success: false,
            message: 'User not found'
        }, {status: 500}) 
        }
        
    } catch (error) {
        console.error(`Error verifying user ${error}`)
        return Response.json({
            success: false,
            message: 'Error verifying user'
        }, {status: 500})
    }
}