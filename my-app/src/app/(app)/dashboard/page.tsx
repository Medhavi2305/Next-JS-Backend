'use client'

import { Message } from "@/model/user.model"
import { acceptingMessagesSchema } from "@/schemas/acceptingMessageSchema"
import { ApiResponce } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { useSession } from "next-auth/react"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

function page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const hadleDeleteSubmit = async(messageId: string) => {
    setMessages(messages.filter((message) => message._id.toString() !== messageId))
  }

  const {data: session} = useSession()

  const form = useForm({
    resolver: zodResolver(acceptingMessagesSchema)
  })

  const {register, watch, setValue} = form

  const acceptMessages = watch('acceptMessage')

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get<ApiResponce>('/api/accept-messages')
      setValue('acceptMessage', response.data.isAcceptingMessage ?? false)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponce>
      toast(axiosError.response?.data.message || 'Failed to fetch message data', {position: 'top-center'})
    } finally {
      setIsSwitchLoading(false)
    }

  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsSwitchLoading(false)
    setLoading(true)
    try {
      const response = await axios.get<ApiResponce>('/api/accept-messages')
      setMessages(response.data.messages || [])
    } catch (error) {
      
    }
  }, [])
  return (
    <div>page</div>
  )
}

export default page