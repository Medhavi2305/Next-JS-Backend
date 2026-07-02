import { Message } from "@/model/user.model";

export interface ApiResponce{
    success: boolean,
    message: string,
    isAcceptingMessage?: boolean,
    messages?: Array<Message>
}