import { useState, useEffect, useMemo } from "react"
import { useUser } from "@/context/auth/useUser"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Mail, Smartphone, Loader2, TrendingUp, Users, Zap, Award,
  ArrowUpRight, Clock, Target, BarChart3, Sparkles
} from "lucide-react"
import { getDashboardStats, type DashboardStats } from "@/api/dashboard"

// Import New Widgets
import DailyGoalGauge from "./Widgets/DailyGoalGauge"
import LocalExpertsMap from "./Widgets/LocalExpertsMap"
import GrowthDetailsChart from "./Widgets/GrowthDetailsChart"
import SkillLevelsTrend from "./Widgets/SkillLevelsTrend"

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

export default function Dashboard() {
  const { user } = useUser()
  const [emailNotif, setEmailNotif] = useState(() => localStorage.getItem("pref_email_notif") !== "false")
  const [smsNotif, setSmsNotif] = useState(() => localStorage.getItem("pref_sms_notif") === "true")
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        const data = await getDashboardStats()
        setStats(data)
      } catch (err) {
        console.error("Failed to load dashboard stats:", err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const greeting = useMemo(() => getGreeting(), [])
  const firstName = user?.fullName?.split(" ")[0] || "there"

  const topMetrics = useMemo(() => [
    {
      label: "Total Connections",
      value: stats?.totalConnections || 0,
      change: stats?.weekChange ? `+${stats.weekChange} this week` : "Steady",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Skills Exchanged",
      value: stats?.skillsExchanged || 0,
      change: "Progress",
      icon: Zap,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Skills Mastered",
      value: stats?.skillsMastered || 0,
      change: "Lifetime",
      icon: Award,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Active Sessions",
      value: stats?.activeSessions || 0,
      change: "Scheduled",
      icon: Target,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ], [stats])

  return (
    <main className="flex-1 max-w-[1600px] mx-auto w-full space-y-6 pt-2 sm:pt-4 px-1 sm:px-2 md:px-0 min-h-screen">

      {/* ── Greeting Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4 animate-in fade-in duration-500">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="h-10 w-10 rounded-xl bg-black flex items-center justify-center shadow-sm">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              {greeting}, {firstName}
            </h1>
          </div>
          <p className="text-sm font-medium text-slate-500 mt-2 ml-[52px]">
            Here's what's happening with your skill exchanges today.
          </p>
        </div>

        <p className="text-sm font-medium text-slate-500 flex items-center gap-1 cursor-pointer hover:text-slate-800 transition-colors border border-slate-200 rounded-full px-4 py-2 bg-white shadow-sm self-start md:self-auto">
          <Clock className="h-3.5 w-3.5" />
          {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-32">
          <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
        </div>
      ) : (
        <>
          {/* ── Top Metrics Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {topMetrics.map((metric, i) => {
              const Icon = metric.icon
              return (
                <Card
                  key={metric.label}
                  className="rounded-[20px] sm:rounded-[24px] border-none shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)] transition-all duration-300 group cursor-default"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-[14px] ${metric.bg} ${metric.color} transition-transform group-hover:scale-110 duration-300`}>
                        <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">{metric.value}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-xs sm:text-sm font-semibold text-slate-400">{metric.label}</span>
                      <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-100 shadow-sm">{metric.change}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* ── Widgets Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
            {/* Daily Goal Gauge */}
            <div className="lg:col-span-5">
              <DailyGoalGauge progressPercentage={stats?.dailyGoalProgress || 0} goalMinutes={60} />
            </div>

            {/* Map Preview */}
            <div className="lg:col-span-7">
              <LocalExpertsMap experts={stats?.localExperts || []} />
            </div>

            {/* Growth Chart */}
            <div className="lg:col-span-6">
              <GrowthDetailsChart />
            </div>

            {/* Skill Trends */}
            <div className="lg:col-span-6">
              <SkillLevelsTrend data={stats?.skillTrends || []} />
            </div>
          </div>

          {/* ── Recent Connections ── */}
          {stats?.recentConnections && stats.recentConnections.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-900">
              <Card className="rounded-[24px] border-none shadow-[0_4px_24px_-8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-300">
                <CardHeader className="pb-3 px-6">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-500" />
                    Recent Connections
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="space-y-3">
                    {stats.recentConnections.map((conn, i) => (
                      <div
                        key={conn.userId + i}
                        className="flex items-center gap-4 p-3 rounded-[16px] bg-slate-50/60 hover:bg-slate-50 transition-colors"
                      >
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center font-semibold text-sm text-slate-600 shrink-0">
                          {conn.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{conn.name}</p>
                          <p className="text-xs text-slate-500 truncate">{conn.skill}</p>
                        </div>
                        <span className="text-xs text-slate-400 font-medium shrink-0">{conn.timeAgo}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* ── Notification Preferences ── */}
      <div className="pt-4 pb-8 w-full max-w-2xl mx-auto animate-in fade-in duration-500">
        <Card className="rounded-[24px] border-none shadow-[0_4px_24px_-8px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-3 px-6">
            <CardTitle className="text-base font-semibold">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-slate-50 text-slate-600 border border-slate-100">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Email Notifications</p>
                  <p className="text-xs font-medium text-slate-500">Receive updates via email</p>
                </div>
              </div>
              <Switch
                checked={emailNotif}
                onCheckedChange={(v) => { setEmailNotif(v); localStorage.setItem("pref_email_notif", String(v)) }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-slate-50 text-slate-600 border border-slate-100">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">SMS Notifications</p>
                  <p className="text-xs font-medium text-slate-500">Receive updates on your phone</p>
                </div>
              </div>
              <Switch
                checked={smsNotif}
                onCheckedChange={(v) => { setSmsNotif(v); localStorage.setItem("pref_sms_notif", String(v)) }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

    </main>
  )
}
