'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback} from 'usehooks-ts'
import { Toaster } from "@/components/ui/sonner"
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from 'axios'
import { ApiResponce } from "@/types/ApiResponse";
import { toast } from "sonner";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function page() {
  const [username, setUsername]= useState('');
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debounced = useDebounceCallback(setUsername, 500)
  const router = useRouter()

  // ZOD IMPLEMENTATION
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
        if (!username) {
            setUsernameMessage("");
            return;
        }

        setIsCheckingUsername(true);
        setUsernameMessage("");
      try {
        const response = await axios.get(`/api/check-unique-username?username=${username}`)
        console.log(response)
        setUsernameMessage(response.data.message)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponce>
        setUsernameMessage(axiosError.response?.data.message ?? 'Error in checking username')
      } finally {
        setIsCheckingUsername(false)
      }
    }
     checkUsernameUnique()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post('/api/sign-up', data)
      console.log('onSubmit sign-in button response :-', response)
      toast.success('user signed-in', {description: response.data.message})
      router.replace(`/verify/${username}`)
    } catch (error) {
      console.log('Error in sign-up user', error)
      const axiosError = error as AxiosError<ApiResponce>
      const errorMessage = axiosError.response?.data.message
      toast.error('sign-up failed', {description: errorMessage})
      setIsSubmitting(false)
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Message App</h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
            name="username"
            control={form.control}
            render={({field, fieldState}) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>
                  Username
                </FieldLabel>
                <Input 
                {...field}
                onChange={(e) => {
                  field.onChange(e)
                  debounced(e.target.value)
                }}
                />
                {isCheckingUsername && (<Loader2 className="h-3 w-3 animate-spin" />)}
                {!isCheckingUsername && usernameMessage && (
                  <p className={`text-sm ${usernameMessage === "Username is available"? "text-green-500": "text-red-500"}`}>{usernameMessage}</p>
                )}
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
            />
            <Controller 
            name="email"
            control={form.control}
            render={({field, fieldState}) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Email</FieldLabel>
                <Input 
                {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
            />
            <Controller 
            name="password"
            control={form.control}
            render={({field, fieldState}) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Passowrd</FieldLabel>
                <Input 
                type="password"
                {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
            />
          </FieldGroup>
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {
              isSubmitting ? (
                <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Please Wait
                </>
              ) : ('Sign-Up')
            }
          </Button>
        </form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href={'/sign-in'} className="text-blue-600 hover:text-blue-800">
            Sign-in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default page