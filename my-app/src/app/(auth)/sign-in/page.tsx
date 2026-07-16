'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue } from 'usehooks-ts'
import { Toaster } from "@/components/ui/sonner"
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from 'axios'
import { ApiResponce } from "@/types/ApiResponse";
import { toast } from "sonner";

function page() {
  const [username, setUsername]= useState('');
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debounceUsername = useDebounceValue(username, 500)
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
      if (debounceUsername) {
        setIsCheckingUsername(true)
        setUsername('')
      }
      try {
        const response = await axios.get(`/api/check-unique-username?username=${debounceUsername}`)
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
  }, [debounceUsername])

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
      toast.success('signed-up failed', {description: errorMessage})
      setIsSubmitting(false)
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Message App</h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        
      </div>
    </div>
  )
}

export default page