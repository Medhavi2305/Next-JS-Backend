'use client'
import React from 'react'
import { Card, CardHeader, CardTitle } from './ui/card'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { Message } from '@/model/user.model'
import axios from 'axios'
import { ApiResponce } from '@/types/ApiResponse'
import { toast } from 'sonner'

type MessageCardProps = {
   message: Message;
   onMessageDelete: (messageId: string) => void
}

function MessageCard({message, onMessageDelete}: MessageCardProps) {
   const handleDeleteConfirm = async() => {
      const response = await axios.delete<ApiResponce>(`/api/delete-message/${message._id}`)
      toast(response.data.message, {position: "top-center"})
      onMessageDelete(message._id.toString())
   }
  return (
    <Card>
      <CardHeader>
         <div className="flex justify-between items-center">
            <CardTitle></CardTitle>
            <AlertDialog>
               <AlertDialogTrigger asChild>
                  <Button><X className="w-5 h-5"  /></Button>
               </AlertDialogTrigger>
               <AlertDialogContent>
                  <AlertDialogHeader>
                     <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                     <AlertDialogDescription>This action cannot be undone. This will permanently delete
                  this message.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                     <AlertDialogCancel>Cancel</AlertDialogCancel>
                     <AlertDialogAction >Continue</AlertDialogAction>
                  </AlertDialogFooter>
               </AlertDialogContent>
            </AlertDialog>
         </div>
         <div>

         </div>
      </CardHeader>
    </Card>
  )
}

export default MessageCard