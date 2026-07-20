'use client'
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { verifySchema } from "@/schemas/verifySchema"
import { ApiResponce } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useParams, useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

function page() {
   const router = useRouter()
   const params = useParams<{username: string}>()
   const form = useForm<z.infer<typeof verifySchema>>({
      resolver: zodResolver(verifySchema),
   })

   const onsubmit = async(data: z.infer<typeof verifySchema>) => {
      try {
         const response = await axios.post('/api/verify-code',{
            username: params.username,
            code: data.code
         })
         toast.success('Verified Successfully', {position: "top-center", description: response.data.message})
         router.replace('/sign-in')
      } catch (error) {
         console.error('Error in verifying code', error)
         const axiosError = error as AxiosError<ApiResponce>
         toast.error('error in verifying code', {description: axiosError.response?.data.message, position: "top-center"})
      }
   }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
         <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Verify your account</h1>
            <p className="mb-4">Enter the verification code sent to your email</p>
         </div>
         <form onSubmit={form.handleSubmit(onsubmit)}>
            <FieldGroup>
               <Controller 
               name="code"
               control={form.control}
               render={({field, fieldState}) => (
                  <Field>
                     <FieldLabel>Code</FieldLabel>
                     <Input {...field} />
                     {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                     )}
                  </Field>
               )}
               />
            </FieldGroup>
            <Button className="w-full" type="submit">
               Verify Code
            </Button>
         </form>
      </div>
    </div>
  )
}

export default page