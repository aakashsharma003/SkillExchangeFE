import React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { MoreVertical } from "lucide-react"

export interface SkillTrendData {
    month: string
    beginner: number
    intermediate: number
    advanced: number
}

interface SkillLevelsTrendProps {
    data: SkillTrendData[]
}

const SkillLevelsTrend = React.memo(({ data }: SkillLevelsTrendProps) => {
    return (
        <Card className="rounded-[24px] border-none shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] bg-white h-full relative overflow-hidden">
            <div className="flex items-center justify-between p-6 pb-2">
                <h3 className="font-semibold text-sm">Skill Levels Trend</h3>
                <button className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
                    <MoreVertical className="h-4 w-4" />
                </button>
            </div>

            <CardContent className="p-6 pt-0">
                <div className="flex flex-col md:flex-row h-[280px] gap-6">
                    <div className="w-full md:w-[70%] h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                    itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
                                    labelStyle={{ display: 'none' }}
                                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="advanced"
                                    name="Advanced"
                                    stroke="#ef4444"
                                    strokeWidth={4}
                                    dot={false}
                                    activeDot={{ r: 6, fill: "#ef4444", stroke: "#fff", strokeWidth: 2 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="intermediate"
                                    name="Intermediate"
                                    stroke="#94a3b8"
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 6, fill: "#94a3b8", stroke: "#fff", strokeWidth: 2 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="beginner"
                                    name="Beginner"
                                    stroke="#99f6e4"
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 6, fill: "#14b8a6", stroke: "#fff", strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="w-full md:w-[30%] flex flex-col justify-center gap-4 pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0">
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-semibold shadow-sm shadow-red-200">
                                Advanced
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-1.5 rounded-full bg-slate-200 text-slate-600 text-xs font-semibold">
                                Intermediate
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-1.5 rounded-full bg-teal-100 text-teal-700 text-xs font-semibold">
                                Beginner
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
})

export default SkillLevelsTrend
