import { User } from "next-auth";
import { auth } from "../../../../auth";
import UserModel from "@/model/user.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request){
    const session = await auth()
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: 'Not Authenticated'
        }, {status: 401})
    }

    const userId = user._id
    const {acceptMessage} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage: acceptMessage},
            {new: true}
        )
        if(!updatedUser){
            return Response.json({
            success: false,
            message: 'User not updated to accept message'
        }, {status: 401})
        }

        return Response.json({
            success: true,
            message: 'message acceptance updated successfully'
        }, {status: 200})
    } catch (error) {
        console.log('Failed to update user status to accept message', error)
        return Response.json({
            success: false,
            message: 'Failed to update user status to accept message'
        }, {status: 500})
    }
}

export async function GET(request: Request){
    await dbConnect()
    const session = await auth()
    const user: User = session?.user as User
    if(!session || !session.user){
        return Response.json({
            success: false,
            message: 'Not authenticated'
        }, {status: 401})
    }

    const userId = user._id

    try {
        const foundUser = await UserModel.findById(userId)

        if(!foundUser){
            return Response.json({
                success: false,
                message: 'User not found'
            }, {status: 404})
        }

            return Response.json({
                success: true,
                isAcceptinMessages: foundUser.isAcceptingMessage
            }, {status: 200})
    } catch (error) {
        console.log('Error in getting acceptance from user', error)
        return Response.json({
            success: false,
            message: 'Error in getting acceptance from user'
        }, {status: 500})
    }
}