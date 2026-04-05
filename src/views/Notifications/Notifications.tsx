import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Check, X, Clock, ArrowRight, MessageSquare, UserPlus, AlertCircle, Loader2 } from "lucide-react"
import { fetchSentRequests, fetchReceivedRequests } from "@/api/exchange-request"
import appRoutes from "@/routes/appRoutes"

/* ─── Notification shape ─── */
interface NotificationItem {
    id: string
    type: "request" | "accepted" | "pending" | "rejected"
    title: string
    message: string
    time: string
    status: "pending" | "accepted" | "rejected"
    senderName: string
    receiverName: string
    skill: string
}

/* ─── helper: icon per status ─── */
function StatusIcon({ status }: { status: string }) {
    if (status === "accepted") return <Check className="h-5 w-5" />
    if (status === "rejected") return <X className="h-5 w-5" />
    return <Clock className="h-5 w-5" />
}

function statusIconBg(status: string) {
    if (status === "accepted") return "bg-emerald-100 text-emerald-600"
    if (status === "rejected") return "bg-rose-100 text-rose-600"
    return "bg-indigo-100 text-indigo-600"
}

function TypeIcon({ type }: { type: string }) {
    if (type === "request") return <UserPlus className="h-4 w-4" />
    if (type === "accepted") return <MessageSquare className="h-4 w-4" />
    return <AlertCircle className="h-4 w-4" />
}

function formatTimeAgo(dateStr: string): string {
    const now = Date.now()
    const then = new Date(dateStr).getTime()
    if (isNaN(then)) return "Recently"
    const diffMs = now - then
    const mins = Math.floor(diffMs / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function Notifications() {
    const navigate = useNavigate()
    const [notifications, setNotifications] = useState<NotificationItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            try {
                setLoading(true)
                const [sentRes, receivedRes] = await Promise.all([
                    fetchSentRequests(),
                    fetchReceivedRequests(),
                ])

                const sentData = sentRes?.data || sentRes || []
                const receivedData = receivedRes?.data || receivedRes || []

                // Map sent requests
                const sentNotifs: NotificationItem[] = (Array.isArray(sentData) ? sentData : []).map((req: any) => ({
                    id: req.id,
                    type: req.status === "ACCEPTED" ? "accepted" : req.status === "REJECTED" ? "rejected" : "pending",
                    title: req.status === "ACCEPTED"
                        ? "Request Accepted"
                        : req.status === "REJECTED"
                            ? "Request Declined"
                            : "Pending Response",
                    message: req.status === "ACCEPTED"
                        ? `${req.receiver?.fullName || "User"} accepted your ${req.requestedSkill} exchange request`
                        : req.status === "REJECTED"
                            ? `${req.receiver?.fullName || "User"} declined your ${req.requestedSkill} request`
                            : `Your request to learn ${req.requestedSkill} from ${req.receiver?.fullName || "user"} is pending`,
                    time: formatTimeAgo(req.createdAt),
                    status: (req.status || "PENDING").toLowerCase() as "pending" | "accepted" | "rejected",
                    senderName: req.sender?.fullName || "You",
                    receiverName: req.receiver?.fullName || "User",
                    skill: req.requestedSkill || "",
                }))

                // Map received requests
                const receivedNotifs: NotificationItem[] = (Array.isArray(receivedData) ? receivedData : []).map((req: any) => ({
                    id: req.id,
                    type: req.status === "ACCEPTED" ? "accepted" : req.status === "REJECTED" ? "rejected" : "request",
                    title: req.status === "ACCEPTED"
                        ? "Connection Active"
                        : req.status === "REJECTED"
                            ? "You Declined"
                            : "New Exchange Request",
                    message: req.status === "ACCEPTED"
                        ? `You and ${req.sender?.fullName || "user"} are exchanging ${req.requestedSkill}`
                        : req.status === "REJECTED"
                            ? `You declined ${req.sender?.fullName || "user"}'s ${req.requestedSkill} request`
                            : `${req.sender?.fullName || "Someone"} wants to learn ${req.requestedSkill} from you`,
                    time: formatTimeAgo(req.createdAt),
                    status: (req.status || "PENDING").toLowerCase() as "pending" | "accepted" | "rejected",
                    senderName: req.sender?.fullName || "User",
                    receiverName: req.receiver?.fullName || "You",
                    skill: req.requestedSkill || "",
                }))

                // Combine & sort by recency
                const combined = [...sentNotifs, ...receivedNotifs]

                setNotifications(combined)
            } catch (err) {
                console.error("Failed to load notifications:", err)
            } finally {
                setLoading(false)
            }
        })()
    }, [])

    // Filtered lists
    const all = notifications
    const requests = useMemo(() => notifications.filter((n) => n.type === "request" || n.type === "pending"), [notifications])
    const accepted = useMemo(() => notifications.filter((n) => n.status === "accepted"), [notifications])
    const rejected = useMemo(() => notifications.filter((n) => n.status === "rejected"), [notifications])

    const handleClick = (notification: NotificationItem) => {
        if (notification.status === "accepted") {
            navigate(appRoutes.chats)
        }
    }

    /* ─── single notification card ─── */
    const NotificationCard = ({ notification }: { notification: NotificationItem }) => {
        const isClickable = notification.status === "accepted"
        return (
            <Card
                onClick={() => handleClick(notification)}
                className={`group overflow-hidden transition-all duration-300 hover:shadow-md ${isClickable ? "cursor-pointer hover:-translate-y-0.5" : ""
                    }`}
            >
                <CardContent className="flex items-center gap-4 py-4">
                    {/* Status icon */}
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${statusIconBg(notification.status)} transition-transform duration-300 group-hover:scale-110`}>
                        <StatusIcon status={notification.status} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold truncate">{notification.title}</p>
                            <Badge
                                variant={
                                    notification.status === "accepted"
                                        ? "default"
                                        : notification.status === "rejected"
                                            ? "destructive"
                                            : "secondary"
                                }
                                className="text-xs shrink-0"
                            >
                                {notification.status}
                            </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <TypeIcon type={notification.type} />
                            <span>{notification.time}</span>
                            {notification.skill && (
                                <Badge variant="outline" className="text-[10px] ml-1">{notification.skill}</Badge>
                            )}
                        </div>
                    </div>

                    {/* Navigate arrow */}
                    {isClickable && (
                        <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    )}
                </CardContent>
            </Card>
        )
    }

    /* ─── empty state ─── */
    const EmptyState = ({ message }: { message: string }) => (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">{message}</p>
        </div>
    )

    return (
        <main className="flex-1 space-y-6 p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                        <Bell className="h-6 w-6" />
                    </div>
                    Notifications
                </h1>
                <p className="text-sm text-muted-foreground md:text-base mt-1">
                    Stay updated with your skill exchange activity
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <Tabs defaultValue="all" className="space-y-4">
                    <TabsList className="w-full justify-start overflow-x-auto h-auto py-2">
                        <TabsTrigger value="all">
                            All
                            {all.length > 0 && (
                                <Badge variant="secondary" className="ml-2">{all.length}</Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="requests">
                            Requests
                            {requests.length > 0 && (
                                <Badge variant="secondary" className="ml-2">{requests.length}</Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="accepted">Accepted</TabsTrigger>
                        <TabsTrigger value="rejected">Rejected</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-3">
                        {all.length === 0 ? (
                            <EmptyState message="No notifications yet." />
                        ) : (
                            all.map((n) => <NotificationCard key={n.id} notification={n} />)
                        )}
                    </TabsContent>

                    <TabsContent value="requests" className="space-y-3">
                        {requests.length === 0 ? (
                            <EmptyState message="No pending requests." />
                        ) : (
                            requests.map((n) => <NotificationCard key={n.id} notification={n} />)
                        )}
                    </TabsContent>

                    <TabsContent value="accepted" className="space-y-3">
                        {accepted.length === 0 ? (
                            <EmptyState message="No accepted notifications." />
                        ) : (
                            accepted.map((n) => <NotificationCard key={n.id} notification={n} />)
                        )}
                    </TabsContent>

                    <TabsContent value="rejected" className="space-y-3">
                        {rejected.length === 0 ? (
                            <EmptyState message="No rejected notifications." />
                        ) : (
                            rejected.map((n) => <NotificationCard key={n.id} notification={n} />)
                        )}
                    </TabsContent>
                </Tabs>
            )}
        </main>
    )
}
