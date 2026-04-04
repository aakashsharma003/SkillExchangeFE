import { useRef, useCallback, useState } from 'react'
import { uploadRecording } from '@/api/calls'

export interface CallRecordingControls {
    isRecording: boolean
    recordingUrl: string | null
    startRecording: (localStream: MediaStream, remoteStream: MediaStream) => void
    stopRecording: () => Promise<Blob | null>
    downloadRecording: (filename?: string) => void
    uploadAndSave: (callId: string) => Promise<void>
}

/**
 * Custom hook that uses MediaRecorder API to record a call.
 * Mixes local + remote audio/video into a single WebM stream.
 * Auto-downloads the recording when stopped.
 */
export function useCallRecording(): CallRecordingControls {
    const recorderRef = useRef<MediaRecorder | null>(null)
    const chunksRef = useRef<Blob[]>([])
    const [isRecording, setIsRecording] = useState(false)
    const blobRef = useRef<Blob | null>(null)
    const [recordingUrl, setRecordingUrl] = useState<string | null>(null)

    const startRecording = useCallback((localStream: MediaStream, remoteStream: MediaStream) => {
        try {
            // Create AudioContext to mix both streams
            const ctx = new AudioContext()
            const dest = ctx.createMediaStreamDestination()

            // Mix local audio
            if (localStream.getAudioTracks().length > 0) {
                const localSource = ctx.createMediaStreamSource(localStream)
                localSource.connect(dest)
            }

            // Mix remote audio
            if (remoteStream.getAudioTracks().length > 0) {
                const remoteSource = ctx.createMediaStreamSource(remoteStream)
                remoteSource.connect(dest)
            }

            // Use remote video track (what the user sees) or local as fallback
            const videoTrack = remoteStream.getVideoTracks()[0] || localStream.getVideoTracks()[0]

            const mixedStream = new MediaStream()
            dest.stream.getAudioTracks().forEach((t) => mixedStream.addTrack(t))
            if (videoTrack) mixedStream.addTrack(videoTrack)

            const recorder = new MediaRecorder(mixedStream, {
                mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
                    ? 'video/webm;codecs=vp9'
                    : 'video/webm',
            })

            chunksRef.current = []
            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data)
            }

            recorder.start(1000) // collect chunks every second
            recorderRef.current = recorder
            setIsRecording(true)
        } catch (err) {
            console.error('Failed to start recording:', err)
        }
    }, [])

    const downloadRecording = useCallback((filename?: string) => {
        const blob = blobRef.current
        if (!blob || blob.size === 0) return

        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename || `call-recording-${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.webm`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        // Keep the URL for playback, revoke on next recording
        setRecordingUrl(url)
    }, [])

    const stopRecording = useCallback((): Promise<Blob | null> => {
        return new Promise((resolve) => {
            const recorder = recorderRef.current
            if (!recorder || recorder.state === 'inactive') {
                resolve(null)
                return
            }

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' })
                blobRef.current = blob
                setIsRecording(false)

                // Auto-download locally
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `call-recording-${new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')}.webm`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)

                setRecordingUrl(url)
                resolve(blob)
            }

            recorder.stop()
        })
    }, [])

    const uploadAndSave = useCallback(async (callId: string) => {
        const blob = blobRef.current
        if (!blob || blob.size === 0) return
        try {
            await uploadRecording(callId, blob)
        } catch (err) {
            console.error('Failed to upload recording:', err)
        }
        blobRef.current = null
    }, [])

    return { isRecording, recordingUrl, startRecording, stopRecording, downloadRecording, uploadAndSave }
}
