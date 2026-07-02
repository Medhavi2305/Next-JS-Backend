import z from "zod";

export const messageSchema = z.object({
    content: z
    .string()
    .min(1, 'message should contain atLeaast one character')
    .max(300, 'Message should not contain more than 300 character')
})