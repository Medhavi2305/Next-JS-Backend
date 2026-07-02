import z from "zod";

export const acceptingMessagesSchema = z.object({
    acceptMessage: z.boolean()
})