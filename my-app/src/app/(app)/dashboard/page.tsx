'use client'

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Message, User } from "@/model/user.model"
import { acceptingMessagesSchema } from "@/schemas/acceptingMessageSchema"
import { ApiResponce } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

function page() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteSubmit = async(messageId: string) => {
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
    setIsSwitchLoading(true)
    setLoading(true)
    try {
      const response = await axios.get<ApiResponce>('/api/accept-messages')
      setMessages(response.data.messages || [])
      if(refresh){
        toast('Showing latest messages', {position: 'top-center'})
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponce>
      toast(axiosError.response?.data.message || 'Failed to fetch message data', {position: 'top-center'})
    } finally {
      setIsSwitchLoading(false)
      setLoading(false)
    }
  }, [setLoading, setMessages])

  useEffect(() => {
    if(!session || !session.user) return
    fetchMessages()
    fetchAcceptMessage()
  }, [session, setValue, fetchAcceptMessage, fetchMessages])

  // HANDLE SWITCH CHANGE
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponce>('/api/accept-messages', {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessage', !acceptMessages)
      toast(response.data.message, {position: 'top-center'})
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponce>
      toast(axiosError.response?.data.message || 'Failed to fetch message data', {position: 'top-center'})
    }
  }

  // const {username} = session?.user as User

  if(!session || !session.user){
    return <div>Please login</div>
  }

  const username = session.user.username
  // TODO: DO MORE RESEARCH ON THIS HOW TO FIND BASE URL
  const baseURL = `${window.location.protocol}//${window.location.host}`
  const profileURL = `${baseURL}/u/${username}`

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(profileURL)
    toast('URL copied to clip board', {position: 'top-center'})
  }
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy your unique link</h2>{' '}
        <div className="flex items-center">
          <input 
          type="text" 
          value={profileURL}
          disabled
          className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipBoard}>Copy</Button>
        </div>
      </div>
      <div className="mb-4">
        <Switch 
        {...register('acceptMessage')}
        checked={acceptMessages}
        onCheckedChange={handleSwitchChange}
        disabled={isSwitchLoading}
        />
        <span>
          Accept Messages: {acceptMessages ? 'on' : 'off'}
        </span>
      </div>
      <Separator />
      <Button 
      className="mt-4" 
      variant='outline' 
      onClick={(e) => {
        e.preventDefault()
        fetchMessages(true)
      }}
      >
        {loading ? (
          <Loader2 className="mt-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard 
            key={message._id.toString()}
            message={message}
            onMessageDelete={handleDeleteSubmit}
            />
          ))
        ) : (
          <p>No Message to display</p>
        )}
      </div>
    </div>
  )
}

export default page