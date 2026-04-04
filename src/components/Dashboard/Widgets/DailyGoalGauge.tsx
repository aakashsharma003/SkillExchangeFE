import React from "react"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MoreVertical } from "lucide-react"

interface DailyGoalGaugeProps {
    progressPercentage: number
    goalMinutes?: number
}

const DailyGoalGauge = React.memo(({ progressPercentage, goalMinutes = 60 }: DailyGoalGaugeProps) => {
    const percentage = Math.min(100, Math.max(0, progressPercentage)) || 0
    const completedMinutes = Math.round((percentage / 100) * goalMinutes)
    const remainder = 100 - percentage

    // Data for the semi-circle gauge
    const data = [
        { name: "Completed", value: percentage },
        { name: "Remaining", value: remainder },
    ]

    // The gradient colors from the design (orange to red)
    const COLORS = ["url(#colorGauge)", "#f3f4f6"]

    return (
        <Card className="rounded-[24px] border-none shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] bg-white h-full relative overflow-hidden">
            <div className="flex items-center justify-between p-6 pb-0">
                <h3 className="font-semibold text-sm">Daily Goal Progress</h3>
                <div className="flex gap-2">
                    <button className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
                        <Calendar className="h-4 w-4" />
                    </button>
                    <button className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
                        <MoreVertical className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <CardContent className="p-6 pt-2 flex flex-col md:flex-row items-center gap-8 md:gap-4 h-[220px]">
                {/* Left Side: Gauge */}
                <div className="relative w-full md:w-1/2 h-full flex items-center justify-center pt-8">
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <defs>
                                <linearGradient id="colorGauge" x1="0" y1="1" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#fca5a5" />
                                    <stop offset="50%" stopColor="#f59e0b" />
                                    <stop offset="100%" stopColor="#ef4444" />
                                </linearGradient>
                            </defs>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="70%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius="80%"
                                outerRadius="100%"
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                                cornerRadius={10}
                            >
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    {/* Centered Text inside Gauge */}
                    <div className="absolute inset-x-0 bottom-4 flex flex-col items-center justify-end pointer-events-none">
                        <span className="text-3xl font-bold tracking-tight text-slate-900">{completedMinutes} <span className="text-xl">mins</span></span>
                        <span className="text-xs font-medium text-slate-400 mt-1">Goal: {goalMinutes} mins</span>
                    </div>
                </div>

                {/* Right Side: Skill Legend */}
                <div className="w-full md:w-1/2 flex flex-col gap-4 pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-sm font-medium text-slate-700">React</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">25 m</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-orange-400" />
                            <span className="text-sm font-medium text-slate-700">UX Design</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">15 m</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-400" />
                            <span className="text-sm font-medium text-slate-700">Python</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">5 m</span>
                    </div>
                    <div className="flex items-center justify-between opacity-50">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                            <span className="text-sm font-medium text-slate-700">Remaining</span>
                        </div>
                        <span className="text-sm font-bold text-slate-400">{remainder > 0 ? goalMinutes - completedMinutes : 0} m</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
})

export default DailyGoalGauge
