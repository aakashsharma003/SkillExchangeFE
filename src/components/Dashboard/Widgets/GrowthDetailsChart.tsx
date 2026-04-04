import React from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { MoreVertical } from "lucide-react"

const data = [
    { name: 'Week 1', request: 8, engaged: 32, completed: 60 },
    { name: 'Week 2', request: 12, engaged: 28, completed: 55 },
    { name: 'Week 3', request: 25, engaged: 15, completed: 40 },
    { name: 'Week 4', request: 10, engaged: 38, completed: 65 },
    { name: 'Week 5', request: 5, engaged: 22, completed: 50 },
    { name: 'Week 6', request: 28, engaged: 18, completed: 45 },
    { name: 'Week 7', request: 4, engaged: 21, completed: 12 },
]

const GrowthDetailsChart = React.memo(() => {
    return (
        <Card className="rounded-[24px] border-none shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] bg-white h-full">
            <div className="flex items-center justify-between p-6 pb-2">
                <h3 className="font-semibold text-sm">Engagement Details</h3>
                <button className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
                    <MoreVertical className="h-4 w-4" />
                </button>
            </div>

            <CardContent className="p-6 pt-0">
                <div className="flex items-center gap-8 mb-6">
                    <div>
                        <p className="text-2xl font-bold font-mono tracking-tight text-slate-900">124</p>
                        <p className="text-xs font-medium text-slate-400 mt-1">Opened Requests</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold font-mono tracking-tight text-slate-900">86%</p>
                        <p className="text-xs font-medium text-slate-400 mt-1">Engaged Swaps</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold font-mono tracking-tight text-slate-900">42</p>
                        <p className="text-xs font-medium text-slate-400 mt-1">Sessions Held</p>
                    </div>
                </div>

                <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="colorEngaged" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id="colorRequest" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" hide />
                            <YAxis hide domain={['dataMin', 'dataMax + 20']} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                itemStyle={{ fontSize: '12px' }}
                                labelStyle={{ fontWeight: 'bold', marginBottom: '4px', color: '#64748b' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="completed"
                                name="Completed Sessions"
                                stroke="#ef4444"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorCompleted)"
                                stackId="1"
                            />
                            <Area
                                type="monotone"
                                dataKey="engaged"
                                name="Engaged Swaps"
                                stroke="#f97316"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorEngaged)"
                                stackId="1"
                            />
                            <Area
                                type="monotone"
                                dataKey="request"
                                name="Opened Requests"
                                stroke="#22c55e"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorRequest)"
                                stackId="1"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
})

export default GrowthDetailsChart
