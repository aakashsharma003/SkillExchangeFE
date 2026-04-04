import { useRef, useCallback, useState, useEffect } from 'react'

const ICE_SERVERS: RTCConfiguration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ],
}

interface UseWebRTCOptions {
    /** STOMP client publish function */
    sendSignal: (type: string, payload: Record<string, unknown>) => void
    onRemoteStream: (stream: MediaStream) => void
    onCallEnded?: () => void
}

export interface WebRTCControls {
    localStream: MediaStream | null
    remoteStream: MediaStream | null
    isMuted: boolean
    isVideoOff: boolean
    isScreenSharing: boolean
    startLocalMedia: (video: boolean) => Promise<MediaStream>
    createOffer: () => Promise<void>
    handleOffer: (sdp: RTCSessionDescriptionInit) => Promise<void>
    handleAnswer: (sdp: RTCSessionDescriptionInit) => Promise<void>
    handleIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>
    toggleMute: () => void
    toggleVideo: () => void
    toggleScreenShare: () => Promise<void>
    cleanup: () => void
}

export function useWebRTC({ sendSignal, onRemoteStream, onCallEnded }: UseWebRTCOptions): WebRTCControls {
    const pcRef = useRef<RTCPeerConnection | null>(null)
    const localStreamRef = useRef<MediaStream | null>(null)
    const [localStream, setLocalStream] = useState<MediaStream | null>(null)
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
    const [isMuted, setIsMuted] = useState(false)
    const [isVideoOff, setIsVideoOff] = useState(false)
    const [isScreenSharing, setIsScreenSharing] = useState(false)
    const screenStreamRef = useRef<MediaStream | null>(null)

    // Store callbacks in refs so the PeerConnection event handlers always use latest versions
    const sendSignalRef = useRef(sendSignal)
    const onRemoteStreamRef = useRef(onRemoteStream)
    const onCallEndedRef = useRef(onCallEnded)
    sendSignalRef.current = sendSignal
    onRemoteStreamRef.current = onRemoteStream
    onCallEndedRef.current = onCallEnded

    const getOrCreatePC = useCallback((): RTCPeerConnection => {
        if (pcRef.current && pcRef.current.signalingState !== 'closed') {
            return pcRef.current
        }

        console.log('🔗 Creating new RTCPeerConnection')
        const pc = new RTCPeerConnection(ICE_SERVERS)

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                sendSignalRef.current('ice', { candidate: event.candidate.toJSON() })
            }
        }

        pc.ontrack = (event) => {
            console.log('🔗 Remote track received')
            const remote = event.streams[0]
            setRemoteStream(remote)
            onRemoteStreamRef.current(remote)
        }

        pc.onconnectionstatechange = () => {
            console.log('🔗 Connection state:', pc.connectionState)
            if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
                onCallEndedRef.current?.()
            }
        }

        pc.onsignalingstatechange = () => {
            console.log('🔗 Signaling state:', pc.signalingState)
        }

        pcRef.current = pc
        return pc
    }, [])

    const startLocalMedia = useCallback(async (video: boolean) => {
        // Reuse existing stream if available
        if (localStreamRef.current) {
            console.log('🔗 Reusing existing local media stream')
            const pc = getOrCreatePC()
            // Re-add tracks if PC was recreated
            if (pc.getSenders().length === 0) {
                localStreamRef.current.getTracks().forEach((track) => pc.addTrack(track, localStreamRef.current!))
            }
            return localStreamRef.current
        }

        console.log('🔗 Starting local media, video:', video)
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: video ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
        })
        localStreamRef.current = stream
        setLocalStream(stream)

        const pc = getOrCreatePC()
        stream.getTracks().forEach((track) => pc.addTrack(track, stream))

        return stream
    }, [getOrCreatePC])

    const createOffer = useCallback(async () => {
        const pc = getOrCreatePC()
        if (pc.signalingState === 'closed') {
            console.error('🔗 Cannot create offer: PC is closed')
            return
        }
        console.log('🔗 Creating offer, PC state:', pc.signalingState)
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        sendSignalRef.current('offer', { sdp: offer })
    }, [getOrCreatePC])

    const handleOffer = useCallback(async (sdp: RTCSessionDescriptionInit) => {
        const pc = getOrCreatePC()
        if (pc.signalingState === 'closed') {
            console.error('🔗 Cannot handle offer: PC is closed')
            return
        }
        // Don't process offer if we already have a remote description
        if (pc.signalingState !== 'stable') {
            console.warn('🔗 Skipping duplicate offer, PC state:', pc.signalingState)
            return
        }
        console.log('🔗 Handling offer, PC state:', pc.signalingState)
        await pc.setRemoteDescription(new RTCSessionDescription(sdp))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        sendSignalRef.current('answer', { sdp: answer })
    }, [getOrCreatePC])

    const handleAnswer = useCallback(async (sdp: RTCSessionDescriptionInit) => {
        const pc = pcRef.current
        if (!pc || pc.signalingState === 'closed') {
            console.error('🔗 Cannot handle answer: PC is null or closed')
            return
        }
        if (pc.signalingState !== 'have-local-offer') {
            console.warn('🔗 Skipping answer, wrong state:', pc.signalingState)
            return
        }
        console.log('🔗 Handling answer, PC state:', pc.signalingState)
        await pc.setRemoteDescription(new RTCSessionDescription(sdp))
    }, [])

    const handleIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
        const pc = pcRef.current
        if (!pc || pc.signalingState === 'closed') {
            console.warn('🔗 Cannot add ICE candidate: PC is null or closed')
            return
        }
        try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate))
        } catch (e) {
            console.warn('🔗 Failed to add ICE candidate:', e)
        }
    }, [])

    const toggleMute = useCallback(() => {
        localStreamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !t.enabled })
        setIsMuted((prev) => !prev)
    }, [])

    const toggleVideo = useCallback(() => {
        localStreamRef.current?.getVideoTracks().forEach((t) => { t.enabled = !t.enabled })
        setIsVideoOff((prev) => !prev)
    }, [])

    const toggleScreenShare = useCallback(async () => {
        const pc = pcRef.current
        if (!pc || !localStreamRef.current) return

        if (isScreenSharing && screenStreamRef.current) {
            // Switch back to camera
            screenStreamRef.current.getTracks().forEach((t) => t.stop())
            const camTrack = localStreamRef.current.getVideoTracks()[0]
            const sender = pc.getSenders().find((s) => s.track?.kind === 'video')
            if (sender && camTrack) await sender.replaceTrack(camTrack)
            setIsScreenSharing(false)
        } else {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
            screenStreamRef.current = screenStream
            const screenTrack = screenStream.getVideoTracks()[0]
            const sender = pc.getSenders().find((s) => s.track?.kind === 'video')
            if (sender) await sender.replaceTrack(screenTrack)
            screenTrack.onended = () => toggleScreenShare()
            setIsScreenSharing(true)
        }
    }, [isScreenSharing])

    const cleanup = useCallback(() => {
        console.log('🔗 Cleanup: stopping streams and closing PC')
        localStreamRef.current?.getTracks().forEach((t) => t.stop())
        screenStreamRef.current?.getTracks().forEach((t) => t.stop())
        pcRef.current?.close()
        pcRef.current = null
        localStreamRef.current = null
        screenStreamRef.current = null
        setLocalStream(null)
        setRemoteStream(null)
        setIsMuted(false)
        setIsVideoOff(false)
        setIsScreenSharing(false)
    }, [])

    // Cleanup on unmount — use refs so we always stop the actual streams
    useEffect(() => {
        return () => {
            console.log('🔗 useWebRTC unmount cleanup')
            localStreamRef.current?.getTracks().forEach((t) => t.stop())
            screenStreamRef.current?.getTracks().forEach((t) => t.stop())
            pcRef.current?.close()
            pcRef.current = null
            localStreamRef.current = null
        }
    }, [])

    return {
        localStream,
        remoteStream,
        isMuted,
        isVideoOff,
        isScreenSharing,
        startLocalMedia,
        createOffer,
        handleOffer,
        handleAnswer,
        handleIceCandidate,
        toggleMute,
        toggleVideo,
        toggleScreenShare,
        cleanup,
    }
}
