import { useUser } from "@/context/auth/useUser"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Users, TrendingUp, Award, Activity, Bell, Check, X, Clock } from "lucide-react"


export default function Dashboard() {
  const { user } = useUser()

  const recentConnections = [
    { name: "Sarah Johnson", skill: "Piano", avatar: "SJ", time: "2h ago" },
    { name: "Mike Chen", skill: "Photography", avatar: "MC", time: "5h ago" },
    { name: "Emma Davis", skill: "Cooking", avatar: "ED", time: "1d ago" },
  ]

  const skillProgress = [
    { skill: "Guitar Playing", progress: 75, sessions: 12 },
    { skill: "Photography", progress: 45, sessions: 6 },
    { skill: "Spanish", progress: 60, sessions: 15 },
  ]

  const notifications = [
    {
      id: 1,
      type: "request",
      title: "New Connection Request",
      message: "Emma Davis wants to connect and learn Guitar from you",
      time: "5 mins ago",
      status: "pending",
    },
    {
      id: 2,
      type: "accepted",
      title: "Request Accepted",
      message: "Mike Chen accepted your photography lesson request",
      time: "1 hour ago",
      status: "accepted",
    },
    {
      id: 3,
      type: "pending",
      title: "Pending Response",
      message: "Your request to learn Spanish from Maria is pending",
      time: "2 hours ago",
      status: "pending",
    },
    {
      id: 4,
      type: "rejected",
      title: "Request Declined",
      message: "John could not accept your cooking class request",
      time: "5 hours ago",
      status: "rejected",
    },
  ]

  return (
    <main className="flex-1 p-8 space-y-8 bg-gray-100">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground md:text-base">
          Welcome back {user.fullName.split(" ")[0]}! Here&apos;s your skill exchange overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Connections</CardTitle>
            <Users className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills Exchanged</CardTitle>
            <TrendingUp className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Across 8 categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges Earned</CardTitle>
            <Award className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 more to next level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Activity className="h-6 w-6 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">2 scheduled today</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Connections and Learning Progress */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Connections */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Connections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentConnections.map((connection, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{connection.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{connection.name}</p>
                    <p className="text-xs text-muted-foreground">Teaching: {connection.skill}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{connection.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Learning Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {skillProgress.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{item.skill}</span>
                  <span className="text-muted-foreground">{item.sessions} sessions</span>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={item.progress} className="flex-1" />
                  <span className="text-sm font-medium">{item.progress}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="notifications-toggle" className="text-sm">
                Enable
              </Label>
              <Switch id="notifications-toggle" defaultChecked />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 space-y-3 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent"
              >
                <div
                  className={`mt-1 rounded-full p-1 ${
                    notification.status === "accepted"
                      ? "bg-green-100 text-green-600 dark:bg-green-950"
                      : notification.status === "rejected"
                        ? "bg-red-100 text-red-600 dark:bg-red-950"
                        : "bg-blue-100 text-blue-600 dark:bg-blue-950"
                  }`}
                >
                  {notification.status === "accepted" ? (
                    <Check className="h-4 w-4" />
                  ) : notification.status === "rejected" ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
                <Badge
                  variant={
                    notification.status === "accepted"
                      ? "default"
                      : notification.status === "rejected"
                        ? "destructive"
                        : "secondary"
                  }
                  className="text-xs"
                >
                  {notification.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 border-l-2 border-chart-1 pl-4">
            <div className="flex-1">
              <p className="text-sm font-medium">New skill request received</p>
              <p className="text-xs text-muted-foreground">Emma wants to learn Guitar from you</p>
            </div>
            <Badge variant="secondary">New</Badge>
          </div>
          <div className="flex items-start gap-3 border-l-2 border-chart-2 pl-4">
            <div className="flex-1">
              <p className="text-sm font-medium">Session completed</p>
              <p className="text-xs text-muted-foreground">Photography session with Mike Chen</p>
            </div>
            <span className="text-xs text-muted-foreground">2h ago</span>
          </div>
          <div className="flex items-start gap-3 border-l-2 border-chart-3 pl-4">
            <div className="flex-1">
              <p className="text-sm font-medium">Badge unlocked</p>
              <p className="text-xs text-muted-foreground">You earned the &quot;Master Teacher&quot; badge!</p>
            </div>
            <span className="text-xs text-muted-foreground">1d ago</span>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
