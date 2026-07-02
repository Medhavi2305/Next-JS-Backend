import z from "zod";

export const usernameValidation = z
    .string()
    .min(2, 'Username must contain atleast 2 Characters')
    .max(20, 'username should nott contain more than 20 characters')
    .regex(/[a-zA-Z][a-zA-Z0-9-_]/, 'Username should not contain special characters/symbol except -, _')

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: 'Invalid Email Address'}),
    password: z.string().min(6, {message: 'Password must be atleast 6 characters'})
})