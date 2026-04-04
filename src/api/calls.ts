import { api } from './auth'

const TOKEN = () => localStorage.getItem('token')
const authHeaders = () => ({ Authorization: `Bearer ${TOKEN()}` })

export interface CallRecord {
    id: string
    chatRoomId: string
    callerId: string
    receiverId: string
    status: 'RINGING' | 'IN_PROGRESS' | 'COMPLETED' | 'MISSED' | 'REJECTED' | 'FAILED'
    startedAt: string
    answeredAt?: string
    endedAt?: string
    durationSeconds?: number
    recordingPath?: string
    hasRecording: boolean
}

export const startCall = async (roomId: string, receiverId: string): Promise<CallRecord> => {
    const res = await api.post(`/calls/${roomId}/start`, { receiverId }, { headers: authHeaders() })
    return res.data.data
}

export const answerCall = async (callId: string): Promise<CallRecord> => {
    const res = await api.put(`/calls/${callId}/answer`, null, { headers: authHeaders() })
    return res.data.data
}

export const endCall = async (callId: string): Promise<CallRecord> => {
    const res = await api.put(`/calls/${callId}/end`, null, { headers: authHeaders() })
    return res.data.data
}

export const rejectCallApi = async (callId: string): Promise<CallRecord> => {
    const res = await api.put(`/calls/${callId}/reject`, null, { headers: authHeaders() })
    return res.data.data
}

export const uploadRecording = async (callId: string, blob: Blob): Promise<CallRecord> => {
    const form = new FormData()
    form.append('file', blob, `recording_${callId}.webm`)
    const res = await api.post(`/calls/${callId}/recording`, form, {
        headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' },
    })
    return res.data.data
}

export const getRecordingUrl = (callId: string): string => {
    return `${api.defaults.baseURL}/calls/${callId}/recording`
}

export const getCallHistory = async (roomId: string): Promise<CallRecord[]> => {
    const res = await api.get(`/calls/room/${roomId}`, { headers: authHeaders() })
    return res.data.data
}
