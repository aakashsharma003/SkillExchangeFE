import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import { getChats } from "@/api/chat"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "@/context/auth/useUser"
import { cn } from "@/lib/utils"
import ChatRoom from "@/components/Chat/ChatRoom"
import { IChat } from "@/types/chat"
import { Client } from "@stomp/stompjs"
import { Loader2, MessageSquare, MoreVertical, Search, Edit, Pin, Check, CheckCheck, ArrowLeft } from "lucide-react"
import SockJS from "sockjs-client"
import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css'
import { useSidebar } from "@/routes/DashboardLayout"

import { WS_URL } from "@/api/auth"

const WEBSOCKET_URL = WS_URL

const Chat: React.FC = () => {
    const { id } = useUser().user
    const navigate = useNavigate()
    const { setSidebarOpen } = useSidebar()
    const [chats, setChats] = useState<IChat[]>([])
    const [chatsLoading, setChatsLoading] = useState(false)
    const [selectedChat, setSelectedChat] = useState<IChat | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const clientRef = useRef<Client | null>(null)

    useEffect(() => {
        (async () => {
            try {
                setChatsLoading(true)
                const res = await getChats(id)
                setChats(res.data)
                if (res.data.length > 0 && window.innerWidth >= 768) {
                    setSelectedChat(res.data[0])
                }
                setChatsLoading(false)
            } catch (err) {
                console.error(err)
                setChatsLoading(false)
            }
        })()
    }, [id])

    useEffect(() => {
        if (chats.length === 0 || !id) return

        const stompClient = new Client({
            webSocketFactory: () => new SockJS(WEBSOCKET_URL),
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            onConnect: () => {
                console.log("Chat sidebar WebSocket connected")
                stompClient.subscribe(`/topic/user/${id}`, (message) => {
                    try {
                        const receivedMessage = JSON.parse(message.body)
                        updateChats(receivedMessage.chatRoomId)
                    } catch (error) {
                        console.error("Error parsing chat sidebar message:", error)
                    }
                })
            },
            onStompError: (frame) => {
                console.error("Chat sidebar STOMP error:", frame)
            },
            onWebSocketError: (event) => {
                console.error("Chat sidebar WebSocket error:", event)
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
                console.error("Error deactivating chat sidebar WebSocket:", error)
            }
        }
    }, [chats.length, id])

    const updateChats = (chatRoomId: string) => {
        setChats((prevChats) => {
            const updatedChat = prevChats.find((chat) => chat.chatRoomId === chatRoomId)
            if (!updatedChat) return prevChats
            const otherChats = prevChats.filter((chat) => chat.chatRoomId !== chatRoomId)
            return [updatedChat, ...otherChats]
        })
    }

    const handleSelectChat = (chat: IChat) => {
        setSelectedChat(chat)
        if (window.innerWidth < 768) {
            setSidebarOpen(false)
        }
    }

    const filteredChats = chats.filter((chat) =>
        chat.otherUser?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    if (!chatsLoading && chats.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center h-full bg-[#fdfdfd]">
                <div className="text-center animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center">
                    <div className="w-48 h-48 bg-muted/20 rounded-full flex items-center justify-center mb-6 overflow-hidden">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/30">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-black/80">No Messages Yet</h1>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">Make some exchange requests to access chats and connect with others.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-1 w-full h-full min-h-0 min-w-0 overflow-hidden bg-gradient-to-br from-[#e4efe8] via-[#eef4f1] to-[#f9fbfb] p-0 md:p-6 gap-0 md:gap-6 relative">
            {/* Chat List Sidebar (Left Column) */}
            <div className={cn(
                "w-full md:w-[340px] lg:w-[380px] flex flex-col gap-0 md:gap-6 flex-shrink-0 h-full min-h-0",
                selectedChat && "hidden md:flex",
                !selectedChat && "p-3 sm:p-5 md:p-0"
            )}>
                {/* Search Box - Separated Pill */}
                <div className="bg-white rounded-[24px] p-2 sm:p-3 md:shadow-sm flex-shrink-0 mb-3 md:mb-0">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/50" />
                        <Input
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-12 h-10 bg-transparent border-none focus-visible:ring-0 shadow-none text-[15px] placeholder:text-muted-foreground/60"
                        />
                    </div>
                </div>

                {/* Messages List - Main Block */}
                <div className="bg-white rounded-[32px] shadow-sm flex-1 flex flex-col overflow-hidden">
                    <div className="p-6 pb-2 flex-shrink-0">
                        <h2 className="text-[26px] font-medium tracking-tight text-black ml-1">Messages</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-0.5 mt-2 custom-scroll">
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
                        {chatsLoading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-2.5">
                                    <Skeleton circle width={46} height={46} />
                                    <div className="flex-1">
                                        <Skeleton width="60%" height={15} />
                                        <Skeleton width="80%" height={12} className="mt-2" />
                                    </div>
                                </div>
                            ))
                        ) : filteredChats.length > 0 ? (
                            filteredChats.map((chat) => {
                                const isSelected = selectedChat?.chatRoomId === chat.chatRoomId
                                const lastActivity = chat.lastActivityAt
                                    ? new Date(chat.lastActivityAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()
                                    : ""
                                const preview = chat.requestedSkill
                                    ? `Interested in ${chat.requestedSkill}`
                                    : chat.offeredSkill
                                        ? `Offering ${chat.offeredSkill}`
                                        : "Start a conversation"

                                return (
                                    <button
                                        key={chat.chatRoomId}
                                        onClick={() => handleSelectChat(chat)}
                                        className={cn(
                                            "w-full p-2.5 rounded-[20px] text-left transition-all duration-200 ease-out group",
                                            isSelected
                                                ? "bg-[#F4F9F6]"
                                                : "hover:bg-muted/30"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative flex-shrink-0">
                                                <div className="h-[46px] w-[46px] rounded-full overflow-hidden bg-muted/40 text-black flex items-center justify-center font-semibold text-lg shadow-sm border border-black/5">
                                                    {chat.otherUser?.fullName?.charAt(0)?.toUpperCase() || "U"}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0 pr-1">
                                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                                    <span className="font-semibold text-[14.5px] truncate text-black/90">
                                                        {chat.otherUser?.fullName}
                                                    </span>
                                                    <span className="text-[11px] text-muted-foreground/70 font-medium">
                                                        {lastActivity}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[13px] truncate text-muted-foreground/80">
                                                        {preview}
                                                    </p>
                                                    <div className="flex-shrink-0 ml-2">
                                                        <Check className="h-3.5 w-3.5 text-[#4ade80]" strokeWidth={3} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                )
                            })
                        ) : (
                            <div className="flex items-center justify-center h-32 text-muted-foreground/50 text-sm">
                                No chats found
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Message Window container matches the faint background tint */}
            <div className={cn(
                "flex-1 flex flex-col bg-gradient-to-br from-[#f8fbf9] to-[#fcfdfc] md:rounded-[32px] md:shadow-sm overflow-hidden min-w-0 h-full min-h-0 relative",
                !selectedChat && "hidden md:flex"
            )}>
                {selectedChat ? (
                    <>
                        {/* Mobile back button */}
                        <div className="md:hidden flex flex-row items-center p-3 bg-white border-b border-gray-100 z-10 sticky top-0 shadow-sm shrink-0">
                            <button 
                                onClick={() => setSelectedChat(null)}
                                className="flex items-center gap-1.5 text-[#7c6df7] font-semibold text-[15px] hover:bg-slate-50 px-3 py-1.5 rounded-full transition-colors leading-none"
                            >
                                <ArrowLeft className="h-[18px] w-[18px] stroke-[2.5]" />
                                Back
                            </button>
                            <div className="flex-1 text-center font-bold text-gray-900 pr-[82px] truncate">
                                {selectedChat.otherUser?.fullName || "Chat"}
                            </div>
                        </div>
                        <ChatRoom chat={selectedChat} updateChats={updateChats} />
                    </>
                ) : (
                    <div className="hidden md:flex flex-1 items-center justify-center">
                        <div className="text-center p-8 animate-in fade-in duration-500 flex flex-col items-center">
                            <div className="w-48 h-48 bg-muted/10 rounded-full flex items-center justify-center mb-6 text-muted-foreground/20">
                                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold tracking-tight text-black/40">Select a conversation</h3>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
