import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { auth } from "../../../../auth";
import mongoose from "mongoose";
import UserModel from "@/model/user.model";

export async function GET(request: Request){
    await dbConnect()
    const session = await auth()
    const user: User = session?.user as User

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: 'Not Authenticated'
        }, {status: 401})
    }

    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const user = await UserModel.aggregate([
            {$match: {id: userId}},
            {$unwind: '$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {
                _id: '$_id',
                messages: {$push: '$messages'}
            }}
        ])
        if(!user){
            return Response.json({
                success: false,
                message: 'User not found',
            },{status: 401})
        }else if(user.length === 0){
            return Response.json({
                success: false,
                message: 'You dont have any message to show',
            },{status: 401})
        }

        return Response.json({
                success: true,
                message: user[0].messages,
            },{status: 200})
    } catch (error) {
        console.log('An unexpected error occur: ', error)
        return Response.json({
                success: false,
                message: 'Unable to sent message',
            },{status: 500})
    }
}