import { useEffect, useState } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { acceptRequest, fetchReceivedRequests, fetchSentRequests, rejectRequest } from "@/api/exchange-request"
import { IexchangeRequest } from "@/types/swal-request"
import { Clock, Check, Loader2, MessageSquare, X } from "lucide-react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const SkillExchangeRequests = () => {
  const navigate = useNavigate()
  const [sent, setSent] = useState<IexchangeRequest[]>([])
  const [received, setReceived] = useState<IexchangeRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const loadAllRequests = async () => {
    try {
      setLoading(true)
      const [sentRes, receivedRes] = await Promise.all([
        fetchSentRequests(),
        fetchReceivedRequests(),
      ])

      if (sentRes.success) setSent(sentRes.data)
      if (receivedRes.success) setReceived(receivedRes.data)
    } catch (err) {
      toast.error("Failed to load requests")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllRequests()
  }, [])

  const onAccept = async (id: string, skill: string) => {
    try {
      setIsProcessing(id)
      const res = await acceptRequest(id, skill)
      if (res.success) {
        toast.success("Request Accepted")
        await loadAllRequests(); // Refresh data to update status and open chat
      }
    } catch (err) {
      toast.error("Failed to accept")
    } finally {
      setIsProcessing(null)
    }
  }

  const onReject = async (id: string) => {
    try {
      setIsProcessing(id)
      const res = await rejectRequest(id)
      if (res.success) {
        toast.success("Request Rejected")
        await loadAllRequests()
      }
    } catch (err) {
      toast.error("Failed to reject")
    } finally {
      setIsProcessing(null)
    }
  }

  // Helper function to render Request Cards
  const RequestCard = ({ req, type }: { req: IexchangeRequest; type: "sent" | "received" }) => (
    <Card key={req.id}>
      <CardContent className="flex items-center justify-between pt-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              {type === "received" ? req.sender.fullName?.charAt(0) : req.receiver.fullName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">
              {type === "received" ? req.sender.fullName : req.receiver.fullName}
            </p>
            <p className="text-sm text-muted-foreground">
              {type === "received" ? "Wants to learn" : "You requested"}: {req.requestedSkill}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <Badge
                variant="outline"
                className={`gap-1 ${
                  req.status === "ACCEPTED"
                    ? "border-green-500 text-green-500"
                    : req.status === "REJECTED"
                      ? "border-destructive text-destructive"
                      : ""
                }`}
              >
                {req.status === "PENDING" && <Clock className="h-3 w-3" />}
                {req.status === "ACCEPTED" && <Check className="h-3 w-3" />}
                {req.status === "REJECTED" && <X className="h-3 w-3" />}
                {req.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {type === "received" && req.status === "PENDING" && (
            <>
              <Button 
                size="sm" 
                disabled={isProcessing === req.id}
                onClick={() => onAccept(req.id, req.requestedSkill)}
              >
                {isProcessing === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="mr-1 h-4 w-4" />} 
                Accept
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                disabled={isProcessing === req.id}
                onClick={() => onReject(req.id)}
              >
                <X className="mr-1 h-4 w-4" /> Decline
              </Button>
            </>
          )}
          {req.status === "ACCEPTED" && (
            <Button size="sm" variant="outline" onClick={() => navigate("/chats")}>
              <MessageSquare className="mr-1 h-4 w-4" /> Message
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  // Grouping logic for tabs
  const allRequests = [
    ...sent.map((r) => ({ ...r, side: "sent" })),
    ...received.map((r) => ({ ...r, side: "received" })),
  ]
  const pending = allRequests.filter((r) => r.status === "PENDING")
  const accepted = allRequests.filter((r) => r.status === "ACCEPTED")
  const rejected = allRequests.filter((r) => r.status === "REJECTED")
  
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Requests</h1>
        <p className="text-muted-foreground">Manage your skill exchange connections</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending
            {pending.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pending.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pending.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">No pending requests.</p>
          ) : (
            pending.map((req) => <RequestCard key={req.id} req={req} type={req.side as any} />)
          )}
        </TabsContent>

        <TabsContent value="accepted" className="space-y-4">
          {accepted.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">No accepted requests yet.</p>
          ) : (
            accepted.map((req) => <RequestCard key={req.id} req={req} type={req.side as any} />)
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejected.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">No rejected requests.</p>
          ) : (
            rejected.map((req) => <RequestCard key={req.id} req={req} type={req.side as any} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
};

export default SkillExchangeRequests;