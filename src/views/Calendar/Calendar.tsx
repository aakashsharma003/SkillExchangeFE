import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ChevronLeft,
    ChevronRight,
    CalendarDays,
    Clock,
    Users,
    Video,
    BookOpen,
} from "lucide-react"

/* ── Static demo events ── */
const DEMO_EVENTS = [
    {
        id: "1",
        title: "Guitar Session with Sarah",
        date: new Date(),
        time: "10:00 AM",
        duration: 60,
        type: "session" as const,
        participant: "Sarah Johnson",
    },
    {
        id: "2",
        title: "Photography Review",
        date: new Date(),
        time: "2:30 PM",
        duration: 45,
        type: "meeting" as const,
        participant: "Mike Chen",
    },
    {
        id: "3",
        title: "Spanish Practice",
        date: (() => { const d = new Date(); d.setDate(d.getDate() + 2); return d })(),
        time: "11:00 AM",
        duration: 30,
        type: "session" as const,
        participant: "Emma Davis",
    },
    {
        id: "4",
        title: "Cooking Masterclass",
        date: (() => { const d = new Date(); d.setDate(d.getDate() + 5); return d })(),
        time: "4:00 PM",
        duration: 90,
        type: "session" as const,
        participant: "James Lee",
    },
    {
        id: "5",
        title: "Team Skill Review",
        date: (() => { const d = new Date(); d.setDate(d.getDate() - 1); return d })(),
        time: "9:00 AM",
        duration: 60,
        type: "meeting" as const,
        participant: "All Members",
    },
    {
        id: "6",
        title: "Piano Lesson",
        date: (() => { const d = new Date(); d.setDate(d.getDate() + 7); return d })(),
        time: "3:00 PM",
        duration: 45,
        type: "session" as const,
        participant: "Sarah Johnson",
    },
    {
        id: "7",
        title: "Design Workshop",
        date: (() => { const d = new Date(); d.setDate(d.getDate() + 10); return d })(),
        time: "1:00 PM",
        duration: 120,
        type: "meeting" as const,
        participant: "Anna Kim",
    },
]

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
]

const typeConfig = {
    session: { icon: BookOpen, bg: "bg-teal-100 text-teal-600", dot: "bg-teal-500", label: "Session" },
    meeting: { icon: Video, bg: "bg-indigo-100 text-indigo-600", dot: "bg-indigo-500", label: "Meeting" },
}

export default function Calendar() {
    const today = new Date()
    const [year, setYear] = useState(today.getFullYear())
    const [month, setMonth] = useState(today.getMonth())
    const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate())

    /* ── Calendar grid math ── */
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    /* Map date → events for quick lookup */
    const eventsByDay = useMemo(() => {
        const map: Record<number, typeof DEMO_EVENTS> = {}
        DEMO_EVENTS.forEach((evt) => {
            if (evt.date.getFullYear() === year && evt.date.getMonth() === month) {
                const d = evt.date.getDate()
                    ; (map[d] ??= []).push(evt)
            }
        })
        return map
    }, [year, month])

    const selectedEvents = selectedDay ? eventsByDay[selectedDay] ?? [] : []

    const prev = () => {
        if (month === 0) { setMonth(11); setYear(year - 1) }
        else setMonth(month - 1)
        setSelectedDay(null)
    }
    const next = () => {
        if (month === 11) { setMonth(0); setYear(year + 1) }
        else setMonth(month + 1)
        setSelectedDay(null)
    }

    return (
        <main className="flex-1 p-4 md:p-8 lg:p-8 space-y-6 bg-background">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                        <CalendarDays className="h-6 w-6" />
                    </div>
                    Calendar
                </h1>
                <p className="text-sm text-muted-foreground md:text-base mt-1">
                    View your upcoming sessions and meetings at a glance.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
                {/* ── Month Grid ── */}
                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <button onClick={prev} className="p-2 rounded-lg hover:bg-muted transition-colors">
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <CardTitle className="text-lg">{MONTHS[month]} {year}</CardTitle>
                        <button onClick={next} className="p-2 rounded-lg hover:bg-muted transition-colors">
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </CardHeader>

                    <CardContent>
                        {/* Day-of-week header */}
                        <div className="grid grid-cols-7 mb-2">
                            {DAYS.map((d) => (
                                <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>
                            ))}
                        </div>

                        {/* Day cells */}
                        <div className="grid grid-cols-7">
                            {Array.from({ length: firstDay }).map((_, i) => (
                                <div key={`empty-${i}`} className="aspect-square" />
                            ))}
                            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                                const isSelected = day === selectedDay
                                const hasEvents = !!eventsByDay[day]

                                return (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDay(day)}
                                        className={`
                      relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all duration-200
                      ${isSelected ? "bg-primary text-primary-foreground shadow-md scale-105" : ""}
                      ${isToday && !isSelected ? "ring-2 ring-primary/40 font-bold" : ""}
                      ${!isSelected ? "hover:bg-muted/60" : ""}
                    `}
                                    >
                                        {day}
                                        {hasEvents && (
                                            <div className="flex gap-0.5 mt-0.5">
                                                {eventsByDay[day]!.slice(0, 3).map((evt) => (
                                                    <span
                                                        key={evt.id}
                                                        className={`h-1.5 w-1.5 rounded-full ${typeConfig[evt.type].dot} ${isSelected ? "opacity-80" : ""}`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* ── Day Detail Panel ── */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">
                                {selectedDay
                                    ? `${MONTHS[month]} ${selectedDay}, ${year}`
                                    : "Select a day"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {selectedDay && selectedEvents.length === 0 && (
                                <div className="py-8 text-center text-muted-foreground">
                                    <CalendarDays className="mx-auto h-10 w-10 mb-2 opacity-40" />
                                    <p className="text-sm">No events on this day</p>
                                </div>
                            )}
                            {selectedEvents.map((evt) => {
                                const cfg = typeConfig[evt.type]
                                const Icon = cfg.icon
                                return (
                                    <div
                                        key={evt.id}
                                        className="group flex items-start gap-3 rounded-lg border p-3 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                                    >
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cfg.bg} transition-transform duration-200 group-hover:scale-110`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate">{evt.title}</p>
                                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                <span>{evt.time} · {evt.duration}min</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                                                <Users className="h-3 w-3" />
                                                <span>{evt.participant}</span>
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="shrink-0 text-[10px]">{cfg.label}</Badge>
                                    </div>
                                )
                            })}
                        </CardContent>
                    </Card>

                    {/* Upcoming summary */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Upcoming</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {DEMO_EVENTS
                                .filter((e) => e.date >= today)
                                .sort((a, b) => a.date.getTime() - b.date.getTime())
                                .slice(0, 4)
                                .map((evt) => {
                                    const cfg = typeConfig[evt.type]
                                    return (
                                        <div key={evt.id} className="flex items-center gap-3 text-sm">
                                            <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                                            <span className="flex-1 truncate font-medium">{evt.title}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {evt.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                            </span>
                                        </div>
                                    )
                                })}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}
