import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"

import { getChats } from "@/api/chat"
import SidebarPage from "@/components/Dashboard/SideBar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "@/context/auth/useUser"
import { cn } from "@/lib/utils"
import ChatRoom from "@/components/Chat/ChatRoom"
import { IChat } from "@/types/chat"
import { Client } from "@stomp/stompjs"
import { Loader2, MessageSquare, MoreVertical, Search } from "lucide-react"
import SockJS from "sockjs-client"
import toast from "react-hot-toast"

import { BASE_URL } from "@/api/auth"

// WebSocket endpoint for live chat updates.
const WEBSOCKET_URL = BASE_URL + "/ws-chat"

const Chat: React.FC = () => {
    const { id } = useUser().user
    const navigate = useNavigate()
    const [chats, setChats] = useState<IChat[]>([])
    const [chatsLoading, setChatsLoading] = useState(false)
    const [selectedChat, setSelectedChat] = useState<IChat | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const clientRef = useRef<any>(null)

    useEffect(() => {
        (async () => {
            try {
                setChatsLoading(true)

                // Load all chat rooms for the current user.
                const res = await getChats(id)

                setChats(res.data)
                if (res.data.length > 0) setSelectedChat(res.data[0])
                setChatsLoading(false)
            } catch (err) {
                console.error(err)
                toast.error("Something went wrong. Unable to fetch all chats")
                setChatsLoading(false)
            }
        })()
    }, [id])

    useEffect(() => {
        if (chats.length === 0) return

        const stompClient = new Client({
            webSocketFactory: () => new SockJS(WEBSOCKET_URL),
            reconnectDelay: 5000,
            debug: (str) => console.log(str),
        })

        // Subscribe to user-specific topic so we can re-order chats on new messages.
        stompClient.onConnect = () => {
            stompClient.subscribe(`/topic/user/${id}`, (message) => {
                const receivedMessage = JSON.parse(message.body)
                updateChats(receivedMessage.chatRoomId)
            })
        }

        stompClient.activate()
        clientRef.current = stompClient

        return () => {
            stompClient.deactivate()
        }
    }, [chats, id])

    const handleNavigate = (href: string) => {
        navigate(href)
        console.log(`Navigating to: ${href}`)
    }

    const updateChats = (chatRoomId: string) => {
        // Move the updated chat to the top of the list while preserving order.
        setChats((prevChats) => {
            const updatedChat = prevChats.find((chat) => chat.chatRoomId === chatRoomId)
            if (!updatedChat) return prevChats
            const otherChats = prevChats.filter((chat) => chat.chatRoomId !== chatRoomId)
            return [updatedChat, ...otherChats]
        })
    };

    const handleLogout = () => {
        navigate("/login")
    }

    const filteredChats = chats.filter((chat) =>
        chat.otherUser?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    // FIX: Removed margins from main tag here
    if (!chatsLoading && chats.length === 0) {
        return (
            <div className="flex min-h-screen bg-background">
                <SidebarPage onNavigate={handleNavigate} />
                <main className="flex flex-1 items-center justify-center">
                    <div className="text-center">
                        <MessageSquare className="mx-auto mb-4 h-16 w-16 text-muted-foreground/40" />
                        <h1 className="text-2xl font-semibold">No chats found.</h1>
                        <p className="mt-2 text-muted-foreground">Make some exchange requests to access chats.</p>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Global Navigation Sidebar (Fixed w-64) */}
            <SidebarPage onNavigate={handleNavigate} />

            {/* FIX: Removed lg:ml-64 and ml-20. Flex will handle the positioning */}
            <main className="flex flex-1 h-screen overflow-hidden">
                {/* Chat List Sidebar (The middle column) */}
                <div className={cn(
                    "w-full md:w-80 lg:w-96 border-r border-border/30 bg-card flex flex-col",
                    selectedChat && "hidden md:flex"
                )}>
                    <div className="border-b border-border/30 p-4 flex-shrink-0">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Chats</h2>
                            <Button size="icon" variant="ghost" className="h-9 w-9">
                                <MoreVertical className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search conversations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-10"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {chatsLoading ? (
                            <div className="flex justify-center items-center h-32">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : (
                            filteredChats.map((chat) => (
                                <button
                                    key={chat.chatRoomId}
                                    onClick={() => setSelectedChat(chat)}
                                    className={cn(
                                        "w-full border-b border-border/20 p-4 text-left transition-colors hover:bg-accent/50",
                                        selectedChat?.chatRoomId === chat.chatRoomId && "bg-accent"
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="relative flex-shrink-0">
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-base">
                                                {chat.otherUser?.fullName?.charAt(0) || "U"}
                                            </div>
                                            <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-card bg-green-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <span className="font-semibold text-sm truncate">
                                                    {chat.otherUser?.fullName}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {chat.lastActivityAt ? "Active" : ""}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {chat.requestedSkill ? `Interested in ${chat.requestedSkill}` : "Start a conversation"}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Main Message Window */}
                <div className="flex-1 flex flex-col bg-background min-w-0">
                    {selectedChat ? (
                        <ChatRoom chat={selectedChat} updateChats={updateChats} />
                    ) : (
                        <div className="flex flex-1 items-center justify-center bg-muted/10">
                            <div className="text-center p-4">
                                <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
                                <h3 className="text-xl font-semibold text-muted-foreground">Select a conversation</h3>
                                <p className="mt-2 text-sm text-muted-foreground">Choose a chat from the list to start messaging</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Chat;