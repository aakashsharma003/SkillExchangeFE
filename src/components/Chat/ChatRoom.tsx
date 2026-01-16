import { useEffect, useRef, useState } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "@/context/auth/useUser"
import { formatTimeAgo } from "@/utils/date"
import { Client } from "@stomp/stompjs"
import { Loader2, Mic, MoreVertical, Paperclip, Phone, Send, Smile, Video, AlertCircle } from "lucide-react"
import SockJS from "sockjs-client"
import toast from "react-hot-toast"

import { getChat } from "@/api/chat"
import type { IChat, IMessage } from "@/types/chat"
import { WS_URL } from "@/api/auth"

// WebSocket endpoint for all room-specific messages.
const WEBSOCKET_URL = WS_URL

export default function ChatRoom({
  chat,
  updateChats,
}: {
  chat: IChat
  updateChats: (chatRoomId: string) => void
}) {
  const actualRoomId = chat.chatRoomId || (chat as any).chatroomId || (chat as any).id
  const { otherUser, offeredSkill, requestedSkill } = chat
  const currentUser = useUser().user

  const [messages, setMessages] = useState<IMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const clientRef = useRef<Client | null>(null)

  // Auto-scroll logic
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages])

  // Fetch Message History
  useEffect(() => {
    const fetchMessages = async () => {
      if (!actualRoomId) return
      try {
        setLoading(true)

        // Initial history load for the current room.
        // To work against dummy data only, you can stub `getChat` to return
        // a resolved Promise with mock messages.
        const res = await getChat(actualRoomId)
        if (res.success) {
          setMessages(res.data)
        } else {
          toast.error(res.message)
        }
      } catch (err) {
        console.error("API Fetch Error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [actualRoomId])

  // WebSocket Connection
  useEffect(() => {
    if (!actualRoomId) return

    console.log("Connecting to WebSocket:", WEBSOCKET_URL)

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (str) => console.log("STOMP:", str),
      onConnect: () => {
        console.log("WebSocket connected successfully")
        setIsConnected(true)
        setConnectionError(null)
        
        // Subscribe to messages for this specific room.
        stompClient.subscribe(`/topic/room/${actualRoomId}`, (payload) => {
          try {
            const receivedMessage = JSON.parse(payload.body)
            setMessages((prev) => {
              if (prev.find((m) => m.id === receivedMessage.id)) return prev
              return [...prev, receivedMessage]
            })
            updateChats(actualRoomId)
          } catch (error) {
            console.error("Error parsing message:", error)
          }
        })
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame)
        setIsConnected(false)
        setConnectionError("STOMP connection error")
        toast.error("Connection error occurred")
      },
      onWebSocketError: (event) => {
        console.error("WebSocket network error:", event)
        setIsConnected(false)
        setConnectionError("Network error")
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected")
        setIsConnected(false)
      },
    })

    stompClient.activate()
    clientRef.current = stompClient

    return () => {
      try {
        if (clientRef.current?.active) {
          clientRef.current.deactivate()
        }
      } catch (error) {
        console.error("Error deactivating STOMP:", error)
      }
    }
  }, [actualRoomId, updateChats])

  const handleSendMessage = () => {
    if (newMessage.trim() === "" || !actualRoomId) return

    if (!isConnected) {
      toast.error("Reconnecting to server... Please try again")
      return
    }

    if (clientRef.current?.connected) {
      const msgPayload = {
        senderId: currentUser.id,
        receiverId: otherUser.id,
        content: newMessage,
        chatRoomId: actualRoomId,
      }

      try {
        clientRef.current.publish({
          destination: "/app/chat.send",
          body: JSON.stringify(msgPayload),
        })

        setNewMessage("")
      } catch (error) {
        console.error("Send error:", error)
        toast.error("Failed to send message")
      }
    } else {
      toast.error("Still connecting to server...")
      setIsConnected(false)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* --- Refined Header --- */}
      <div className="flex items-center justify-between border-b border-border/50 p-4 md:px-6 bg-card">
        <div className="flex items-center gap-3 flex-1">
          <Avatar className="h-10 w-10 md:h-12 md:w-12">
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {otherUser?.fullName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-sm md:text-base">{otherUser?.fullName}</p>
            <p className="text-[11px] text-muted-foreground">
              Learning <span className="text-primary font-medium">{requestedSkill}</span> | Teaching{" "}
              <span className="text-primary font-medium">{offeredSkill}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-1">
          <Button size="icon" variant="ghost" className="h-9 w-9"><Phone className="h-4 w-4 text-muted-foreground" /></Button>
          <Button size="icon" variant="ghost" className="h-9 w-9"><Video className="h-4 w-4 text-muted-foreground" /></Button>
          <Button size="icon" variant="ghost" className="h-9 w-9"><MoreVertical className="h-4 w-4 text-muted-foreground" /></Button>
        </div>
      </div>

      {/* --- Connection Error Banner --- */}
      {connectionError && (
        <div className="bg-red-50 border-b border-red-200 p-3 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{connectionError}</span>
        </div>
      )}

      {/* --- Refined Messages Area --- */}
      <div 
        className="flex-1 overflow-y-auto bg-accent/5 p-4 md:p-6 space-y-4" 
        ref={containerRef}
      >
        <div className="mx-auto max-w-4xl space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mb-2" />
              <p className="text-sm">Syncing messages...</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id
              const textContent = (msg as any).content || (msg as any).message
              const dateObj = new Date(msg.createdAt || Date.now())
              const displayTime = isNaN(dateObj.getTime()) ? "Just now" : formatTimeAgo(dateObj)

              return (
                <div 
                  key={msg.id || Math.random()} 
                  className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
                >
                  {!isMe && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-[10px] bg-muted">
                        {otherUser?.fullName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[75%] md:max-w-[65%] rounded-2xl px-4 py-2 shadow-sm ${
                      isMe 
                        ? "rounded-br-sm bg-primary text-primary-foreground" 
                        : "rounded-bl-sm bg-card border border-border/50 text-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words">{textContent}</p>
                    <p className={`mt-1 text-[10px] opacity-60 ${isMe ? "text-right" : ""}`}>
                      {displayTime}
                    </p>
                  </div>

                  {isMe && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="text-[10px] bg-primary/20">You</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* --- Refined Input Bar --- */}
      <div className="border-t border-border/50 p-4 bg-card">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="shrink-0 text-muted-foreground">
              <Smile className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" className="shrink-0 text-muted-foreground">
              <Paperclip className="h-5 w-5" />
            </Button>
            
            <Input
              placeholder={isConnected ? "Type your message..." : "Connecting..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && isConnected && handleSendMessage()}
              className="flex-1 rounded-full bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary h-10 disabled:opacity-50"
              disabled={!isConnected}
            />

            <Button size="icon" variant="ghost" className="shrink-0 text-muted-foreground hidden sm:flex">
              <Mic className="h-5 w-5" />
            </Button>
            <Button 
              size="icon" 
              onClick={handleSendMessage}
              disabled={!isConnected || !newMessage.trim()}
              className="shrink-0 rounded-full h-10 w-10 shadow-md transition-transform active:scale-90 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}