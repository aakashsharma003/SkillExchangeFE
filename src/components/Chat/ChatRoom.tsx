import { useEffect, useRef, useState, useCallback } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "@/context/auth/useUser"
import { formatTimeAgo } from "@/utils/date"
import { Client } from "@stomp/stompjs"
import {
  Loader2, Paperclip, Phone, PhoneIncoming,
  PhoneOff, Send, Video, AlertCircle, Pin, CheckCheck, ShieldAlert
} from "lucide-react"
import SockJS from "sockjs-client"
import toast from "react-hot-toast"

import { getChat } from "@/api/chat"
import { getRecordingUrl } from "@/api/calls"
import { moderateMessage, type ModerationResult } from "@/utils/groqModeration"
import type { IChat, IMessage } from "@/types/chat"
import { WS_URL } from "@/api/auth"
import VideoCall from "./VideoCall"

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
  const [isModerating, setIsModerating] = useState(false)

  // Call state
  const [showCall, setShowCall] = useState(false)
  const [isIncomingCall, setIsIncomingCall] = useState(false)
  const [incomingPayload, setIncomingPayload] = useState<Record<string, unknown> | undefined>()
  const [incomingCallVisible, setIncomingCallVisible] = useState(false)

  // Buffer for signaling messages that arrive before VideoCall mounts
  const pendingSignalsRef = useRef<Array<Record<string, unknown>>>([])

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

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: (str) => {
        if (str.includes("CONNECTED") || str.includes("CONNECT") || str.includes("ERROR")) {
          console.log("STOMP:", str)
        }
      },
      onConnect: () => {
        console.log("✅ WebSocket connected and ready")
        setIsConnected(true)
        setConnectionError(null)

        // Subscribe to chat messages
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

        // Subscribe to call signaling
        stompClient.subscribe(`/topic/room/${actualRoomId}/call`, (payload) => {
          try {
            const data = JSON.parse(payload.body)
            // Only process signals from the other user
            if (data.senderId === currentUser.id) return
            console.log(`📞 ChatRoom received call signal: ${data.type}`)

            if (data.type === "incoming-call") {
              // Clear any previous buffered signals
              pendingSignalsRef.current = []
              setIncomingPayload(data)
              setIncomingCallVisible(true)
            } else if (data.type === "offer") {
              // Offer goes into incomingPayload so VideoCall can access it on mount.
              // NOT buffered in pendingSignals to avoid double processing.
              setIncomingPayload(prev => prev ? { ...prev, sdp: data.sdp } : prev)
              console.log(`📞 ChatRoom stored offer SDP in incomingPayload`)
            } else if (data.type === "ice-candidate") {
              // Buffer ICE candidates — VideoCall will process these on mount
              pendingSignalsRef.current.push(data)
              console.log(`📞 ChatRoom buffered ICE candidate, total: ${pendingSignalsRef.current.length}`)
            }
            // Note: 'answer' signals are handled by VideoCall's own subscription
          } catch (error) {
            console.error("Error parsing call signal:", error)
          }
        })
      },
      onStompError: (frame) => {
        console.error("STOMP error:", frame)
        setIsConnected(false)
        setConnectionError("Connection error: " + (frame.headers?.message || "Unknown error"))
      },
      onWebSocketError: (event) => {
        console.error("WebSocket error:", event)
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
        if (stompClient.active) {
          stompClient.deactivate()
        }
      } catch (error) {
        console.error("Error deactivating STOMP:", error)
      }
    }
  }, [actualRoomId, updateChats])

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !actualRoomId) return

    if (!clientRef.current?.active) {
      toast.error("Not connected. Please wait...")
      return
    }

    const messageText = newMessage.trim()
    setNewMessage("") // Clear immediately for UX

    // ── Groq AI Moderation Check ──
    setIsModerating(true)
    let modResult: ModerationResult = { safe: true, category: "", description: "", recommendation: "" }
    try {
      modResult = await moderateMessage(messageText)
    } catch (err) {
      console.error("Moderation check failed:", err)
    }
    setIsModerating(false)

    if (!modResult.safe) {
      // Show the flagged message locally with a warning — DO NOT send via WebSocket
      const flaggedMsg: IMessage = {
        id: `flagged-${Date.now()}`,
        chatRoomId: actualRoomId,
        senderId: currentUser.id,
        content: messageText,
        createdAt: new Date().toISOString(),
        messageType: "TEXT",
      }
        ; (flaggedMsg as any)._flagged = true
        ; (flaggedMsg as any)._category = modResult.category
        ; (flaggedMsg as any)._description = modResult.description

      setMessages(prev => [...prev, flaggedMsg])

      // Send a moderation warning to the other user
      try {
        clientRef.current.publish({
          destination: "/app/chat.send",
          body: JSON.stringify({
            senderId: currentUser.id,
            receiverId: otherUser.id,
            content: `⚠️ [Content Moderation] A message was flagged as "${modResult.category}". ${modResult.recommendation}`,
            chatRoomId: actualRoomId,
          }),
        })
      } catch (e) {
        console.error("Failed to send moderation warning:", e)
      }

      toast.error(`Message blocked: ${modResult.category}`, { duration: 4000 })
      return
    }

    // ── Safe Message — Send normally ──
    const msgPayload = {
      senderId: currentUser.id,
      receiverId: otherUser.id,
      content: messageText,
      chatRoomId: actualRoomId,
    }

    try {
      clientRef.current.publish({
        destination: "/app/chat.send",
        body: JSON.stringify(msgPayload),
      })
    } catch (error: any) {
      console.error("Send error:", error)
      toast.error("Failed to send message. Please try again.")
      setNewMessage(messageText) // Restore the message on failure
      if (error?.message?.includes("no underlying STOMP connection")) {
        setIsConnected(false)
      }
    }
  }

  const initiateCall = () => {
    setIsIncomingCall(false)
    setIncomingPayload({ receiverId: otherUser.id })
    setShowCall(true)
  }

  const acceptIncomingCall = () => {
    setIsIncomingCall(true)
    setIncomingCallVisible(false)
    setShowCall(true)
  }

  const declineIncomingCall = () => {
    setIncomingCallVisible(false)
    setIncomingPayload(undefined)
    // Send rejection signal
    if (clientRef.current?.active) {
      clientRef.current.publish({
        destination: `/app/call.reject/${actualRoomId}`,
        body: JSON.stringify({ senderId: currentUser.id }),
      })
    }
  }

  useEffect(() => {
    if (incomingCallVisible) {
      window.dispatchEvent(new CustomEvent('trigger-island', {
        detail: {
          state: 'call',
          name: otherUser?.fullName || "Video Call",
          avatarStr: (otherUser?.fullName?.charAt(0) || "U").toUpperCase(),
          onAccept: acceptIncomingCall,
          onDecline: declineIncomingCall
        }
      }));
    } else if (!incomingCallVisible) {
      window.dispatchEvent(new CustomEvent('trigger-island', { detail: { state: 'default' } }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingCallVisible]);

  /** Render a call-type message (CALL_STARTED, CALL_ENDED, RECORDING) */
  const renderCallMessage = (msg: IMessage) => {
    const isCallStart = msg.messageType === "CALL_STARTED"
    const isCallEnd = msg.messageType === "CALL_ENDED"
    const isRecording = msg.messageType === "RECORDING"

    return (
      <div className="flex justify-center my-2" key={msg.id || Math.random()}>
        {isRecording ? (
          <div className="bg-card border border-border/50 rounded-xl px-4 py-3 max-w-sm shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Video className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">Call Recording</span>
            </div>
            {msg.callRecordId && (
              <>
                <video
                  controls
                  className="w-full rounded-lg bg-black"
                  style={{ maxHeight: '200px' }}
                  src={getRecordingUrl(msg.callRecordId)}
                />
                <a
                  href={getRecordingUrl(msg.callRecordId)}
                  download={`recording-${msg.callRecordId}.webm`}
                  className="text-[11px] text-primary hover:underline mt-1.5 inline-block"
                >
                  ⬇ Download recording
                </a>
              </>
            )}
            <p className="text-[10px] text-muted-foreground mt-1 text-right">
              {formatTimeAgo(new Date(msg.createdAt || Date.now()))}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-muted/50 rounded-full px-4 py-1.5">
            {isCallStart ? (
              <Phone className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <PhoneOff className="h-3.5 w-3.5 text-red-400" />
            )}
            <span className="text-xs text-muted-foreground">{msg.content}</span>
            <span className="text-[10px] text-muted-foreground/60">
              {formatTimeAgo(new Date(msg.createdAt || Date.now()))}
            </span>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* VideoCall Overlay */}
      {showCall && (
        <VideoCall
          roomId={actualRoomId}
          userId={currentUser.id}
          otherUserName={otherUser?.fullName || "User"}
          stompClient={clientRef.current}
          isIncoming={isIncomingCall}
          incomingPayload={incomingPayload}
          pendingSignals={pendingSignalsRef.current}
          onClose={() => {
            setShowCall(false)
            pendingSignalsRef.current = []
          }}
        />
      )}

      {/* Incoming Call Dialog - Completely disabled in favor of DynamicIsland */}
      {incomingCallVisible && (
        <div className="hidden">
          <div className="bg-card rounded-2xl p-8 text-center shadow-2xl max-w-sm mx-4 animate-in fade-in zoom-in-95">
            <Avatar className="h-20 w-20 mx-auto mb-4">
              <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                {otherUser?.fullName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-lg font-semibold mb-1">{otherUser?.fullName}</h3>
            <p className="text-sm text-muted-foreground mb-6">Incoming video call...</p>
            <div className="flex justify-center gap-6">
              <Button
                size="icon"
                onClick={declineIncomingCall}
                className="h-14 w-14 rounded-full bg-red-600 hover:bg-red-700"
              >
                <PhoneOff className="h-6 w-6 text-white" />
              </Button>
              <Button
                size="icon"
                onClick={acceptIncomingCall}
                className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700"
              >
                <PhoneIncoming className="h-6 w-6 text-white" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 w-full h-full min-h-0 min-w-0 flex-col bg-transparent">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 md:px-8 bg-transparent z-10 shrink-0">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="relative shrink-0">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 shadow-sm border border-black/5">
                <AvatarFallback className="bg-muted text-black font-semibold text-base sm:text-lg">
                  {otherUser?.fullName?.charAt(0).toUpperCase() || "A"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-base sm:text-lg md:text-xl text-black truncate">{otherUser?.fullName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="h-2 w-2 rounded-full bg-[#4ade80]" />
                <p className="text-xs text-muted-foreground/80 font-medium">Online</p>
              </div>
            </div>
          </div>

          <div className="flex gap-1.5 sm:gap-2 shrink-0">
            <Button size="icon" variant="ghost" className="h-9 w-9 sm:h-10 sm:w-10 text-muted-foreground/60 hover:text-black">
              <Pin className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              size="icon"
              onClick={initiateCall}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-black text-white hover:bg-black/80 shadow-sm transition-transform hover:scale-105 active:scale-95"
            >
              <Video className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        {/* Connection Error Banner */}
        {connectionError && (
          <div className="bg-red-50 border-b border-red-200 p-3 text-sm text-red-700 flex items-center gap-2 px-8">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{connectionError}</span>
          </div>
        )}

        {/* Messages Area */}
        <div
          className="flex-1 overflow-y-auto bg-[#f0f7f5] rounded-t-[30px] md:rounded-t-[50px] p-4 md:px-8 space-y-6 custom-scroll"
          ref={containerRef}
        >
          <style>{`
              .custom-scroll::-webkit-scrollbar {
                  width: 5px;
              }
              .custom-scroll::-webkit-scrollbar-track {
                  background: transparent;
              }
              .custom-scroll::-webkit-scrollbar-thumb {
                  background-color: #e5e7eb;
                  border-radius: 10px;
              }
          `}</style>
          <div className="mx-auto max-w-4xl space-y-6 pb-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin mb-2" />
                <p className="text-sm">Syncing messages...</p>
              </div>
            ) : (
              <div className="flex flex-col space-y-5 pb-4 mt-4">
                {messages.map((msg, index) => {
                  const isMe = msg.senderId === currentUser.id
                  const msgType = (msg as any).messageType || "TEXT"

                  // Call-type messages render centered
                  if (msgType !== "TEXT") {
                    return renderCallMessage(msg)
                  }

                  const textContent = (msg as any).content || (msg as any).message
                  const dateObj = new Date(msg.createdAt || Date.now())
                  const displayTime = isNaN(dateObj.getTime()) ? "Just now" : dateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()

                  const isFlagged = (msg as any)._flagged === true
                  const flagCategory = (msg as any)._category || ""
                  const flagDesc = (msg as any)._description || ""

                  return (
                    <div
                      key={msg.id || index}
                      className={`flex flex-col gap-1 group ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div className={`flex items-end gap-3 min-w-0 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                        {!isMe && (
                          <Avatar className="h-10 w-10 shrink-0 mb-1 border border-black/5 shadow-sm">
                            <AvatarFallback className="text-[12px] bg-muted/60 text-black font-semibold">
                              {otherUser?.fullName?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={`w-fit min-w-[60px] max-w-[75%] sm:max-w-[80%] md:max-w-[70%] px-4 sm:px-5 py-3 shadow-sm transition-all duration-200 ${isFlagged
                            ? "rounded-[24px] bg-[#fdf2f2] border border-red-100"
                            : isMe
                              ? "rounded-[24px] rounded-br-[6px] bg-white text-black hover:shadow-md animate-in slide-in-from-right-2 fade-in border border-black/5"
                              : "rounded-[24px] rounded-bl-[6px] bg-black text-white hover:shadow-md animate-in slide-in-from-left-2 fade-in"
                            }`}
                        >
                          {!isFlagged && (textContent === "Call started" || textContent === "Missed call" || textContent === "Call ended") ? (
                            <div className="flex items-center gap-2 pr-2 whitespace-nowrap">
                              <div className={`p-1.5 rounded-full ${isMe ? 'bg-black/5' : 'bg-white/20'}`}>
                                <Video className={`h-4 w-4 ${isMe ? 'text-black/70' : 'text-white/90'}`} />
                              </div>
                              <span className="text-[14px] font-medium tracking-tight">
                                {textContent}
                              </span>
                            </div>
                          ) : !isFlagged ? (
                            <p className="text-[14.5px] leading-relaxed break-words">{textContent}</p>
                          ) : null}
                          {isFlagged && (
                            <div className="flex items-start gap-3 py-1 pr-2">
                              <div className="p-1.5 bg-red-100 rounded-full shrink-0">
                                <ShieldAlert className="h-4 w-4 text-red-500" />
                              </div>
                              <div className="flex flex-col">
                                <p className="text-[13px] font-semibold text-red-700">Message Restricted</p>
                                <p className="text-[12px] text-red-600 mt-0.5 leading-snug">This message was removed because it contains sensitive information.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Timestamp */}
                      <p className={`text-[11px] font-medium text-muted-foreground/50 ${isMe ? "mr-2" : "ml-[52px]"}`}>
                        {displayTime}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Input Bar */}
        <div className="bg-[#f0f7f5] p-2 sm:p-4 md:px-8 md:pb-8 shrink-0">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center gap-1.5 sm:gap-3 bg-white p-1.5 sm:p-2 rounded-full border border-border/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] focus-within:border-black/20 focus-within:shadow-[0_4px_15px_-4px_rgba(0,0,0,0.08)] transition-all duration-300">
              <Button size="icon" variant="ghost" className="shrink-0 text-muted-foreground hover:bg-muted/40 rounded-full h-9 w-9 sm:h-10 sm:w-10 ml-0.5 sm:ml-1">
                <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>

              <Input
                placeholder="Write a Message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 bg-transparent border-none focus-visible:ring-0 shadow-none px-1 sm:px-2 h-10 sm:h-12 disabled:opacity-50 text-sm sm:text-[15px] placeholder:text-muted-foreground/60"
              />
              <div className="mr-0.5 sm:mr-1">
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isModerating}
                  className="shrink-0 rounded-full h-10 w-10 sm:h-12 sm:w-12 bg-black text-white hover:bg-black/80 shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isModerating ? (
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 sm:h-5 sm:w-5 ml-0.5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
