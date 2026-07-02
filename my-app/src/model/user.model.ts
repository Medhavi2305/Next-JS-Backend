import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date
}

const MessageSchema : Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    }
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerifyed: boolean,
    isAcceptingMessage: boolean;
    messages: Message[]
}

const userSchema : Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true 
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/, 'Please use a Valid Email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        unique: true,
    },
    verifyCode: {
        type: String,
        required: [true, 'Verify Code is required'],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify Code Expiry is required'],
    },
    isVerifyed: {
        type: Boolean,
        default: true 
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true 
    },
    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', userSchema)

export default UserModel