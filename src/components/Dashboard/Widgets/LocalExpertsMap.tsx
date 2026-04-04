import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MoreVertical, MapPin } from "lucide-react"
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

export interface ExpertLocation {
    lat: number
    lng: number
    skill: string
    count: number
    location: string
}

interface LocalExpertsMapProps {
    experts: ExpertLocation[]
}

// Center of Pune
const PUNE_CENTER: [number, number] = [18.5204, 73.8567]

const getSkillColor = (skill: string) => {
    switch (skill.toLowerCase()) {
        case 'java': return '#f97316' // orange
        case 'react': return '#3b82f6' // blue
        case 'python': return '#22c55e' // green
        default: return '#8b5cf6' // purple
    }
}

const LocalExpertsMap = React.memo(({ experts }: LocalExpertsMapProps) => {
    return (
        <Card className="rounded-[24px] border-none shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] bg-white h-full relative overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 pb-0 z-10">
                <h3 className="font-semibold text-sm">Local Experts (Pune)</h3>
                <div className="flex gap-2">
                    <button className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
                        <Calendar className="h-4 w-4" />
                    </button>
                    <button className="h-8 w-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 transition-colors">
                        <MoreVertical className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <CardContent className="p-6 pt-4 flex-1 flex items-center relative z-0">
                {/* Real Leaflet Map */}
                <div className="w-full h-[240px] relative rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
                    <MapContainer
                        center={PUNE_CENTER}
                        zoom={12}
                        scrollWheelZoom={false}
                        style={{ height: '100%', width: '100%', zIndex: 0 }}
                        attributionControl={false}
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />
                        {experts && experts.map((expert, idx) => (
                            <CircleMarker
                                key={idx}
                                center={[expert.lat, expert.lng]}
                                radius={expert.count + 5} // Scale radius by count
                                fillColor={getSkillColor(expert.skill)}
                                color={getSkillColor(expert.skill)}
                                weight={2}
                                opacity={0.8}
                                fillOpacity={0.4}
                            >
                                <Popup className="rounded-xl shadow-lg border-none" closeButton={false}>
                                    <div className="text-center p-1">
                                        <p className="font-bold text-sm" style={{ color: getSkillColor(expert.skill) }}>
                                            {expert.count} Mentors
                                        </p>
                                        <p className="text-xs font-semibold text-slate-700 mt-1">{expert.skill}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{expert.location}</p>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                </div>
            </CardContent>
        </Card>
    )
})

export default LocalExpertsMap
