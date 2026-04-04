import { api } from './auth'
import { withCache, invalidateCacheByPrefix } from '@/utils/cache'

const CACHE_PREFIX = 'meetings'

export interface MeetingResponse {
    id: string
    title: string
    description: string
    organizerId: string
    organizerName: string
    participantId: string
    participantName: string
    scheduledAt: string
    durationMinutes: number
    meetingLink: string
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
    createdAt: string
}

export const getMeetings = () => {
    return withCache(`${CACHE_PREFIX}-all`, async () => {
        const token = localStorage.getItem('token')
        const response = await api.get('/meetings', {
            headers: { Authorization: `Bearer ${token}` },
        })
        return response.data.data as MeetingResponse[]
    }, 60_000)
}

export const getMeetingsByRange = (start: string, end: string) => {
    return withCache(`${CACHE_PREFIX}-range-${start}-${end}`, async () => {
        const token = localStorage.getItem('token')
        const response = await api.get('/meetings/range', {
            params: { start, end },
            headers: { Authorization: `Bearer ${token}` },
        })
        return response.data.data as MeetingResponse[]
    }, 60_000)
}

export const createMeeting = async (payload: {
    title: string
    description?: string
    participantId: string
    scheduledAt: string
    durationMinutes: number
    meetingLink?: string
}) => {
    const token = localStorage.getItem('token')
    const response = await api.post('/meetings', payload, {
        headers: { Authorization: `Bearer ${token}` },
    })
    invalidateCacheByPrefix(CACHE_PREFIX)
    return response.data
}

export const cancelMeeting = async (id: string) => {
    const token = localStorage.getItem('token')
    const response = await api.put(`/meetings/${id}/cancel`, null, {
        headers: { Authorization: `Bearer ${token}` },
    })
    invalidateCacheByPrefix(CACHE_PREFIX)
    return response.data
}
