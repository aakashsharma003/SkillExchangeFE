import { useEffect, useRef, useState, useCallback } from 'react'
import { PhoneOff, Mic, MicOff, Video, VideoOff, Monitor, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useWebRTC } from '@/hooks/useWebRTC'
import { useCallRecording } from '@/hooks/useCallRecording'
import { startCall, answerCall, endCall, type CallRecord } from '@/api/calls'
import { Client } from '@stomp/stompjs'
import { motion, AnimatePresence } from 'framer-motion'

interface VideoCallProps {
    roomId: string
    userId: string
    otherUserName: string
    stompClient: Client | null
    isIncoming: boolean
    incomingPayload?: Record<string, unknown>
    pendingSignals?: Array<Record<string, unknown>>
    onClose: () => void
}

export default function VideoCall({
    roomId,
    userId,
    otherUserName,
    stompClient,
    isIncoming,
    incomingPayload,
    pendingSignals,
    onClose,
}: VideoCallProps) {
    const localVideoRef = useRef<HTMLVideoElement>(null)
    const remoteVideoRef = useRef<HTMLVideoElement>(null)
    const [callRecord, setCallRecord] = useState<CallRecord | null>(null)
    const [callState, setCallState] = useState<'ringing' | 'connecting' | 'connected' | 'ended'>('ringing')
    const [elapsed, setElapsed] = useState(0)
    const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

    /** Send a signaling message via STOMP */
    const sendSignal = useCallback(
        (type: string, payload: Record<string, unknown>) => {
            if (!stompClient?.active) {
                console.error('⚠️ sendSignal FAILED — stompClient not active. Type:', type)
                return
            }
            console.log(`📤 Sending signal: ${type}`)
            stompClient.publish({
                destination: `/app/call.${type}/${roomId}`,
                body: JSON.stringify({ ...payload, senderId: userId }),
            })
        },
        [stompClient, roomId, userId],
    )

    const webrtc = useWebRTC({
        sendSignal,
        onRemoteStream: (stream) => {
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = stream
            setCallState('connected')
            // Start timer
            timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
        },
        onCallEnded: () => handleHangup(),
    })

    const recording = useCallRecording()

    /* ── Attach local video ── */
    useEffect(() => {
        if (webrtc.localStream && localVideoRef.current) {
            localVideoRef.current.srcObject = webrtc.localStream
        }
    }, [webrtc.localStream])

    /* ── Subscribe to signaling messages ── */
    useEffect(() => {
        if (!stompClient?.active) return

        const sub = stompClient.subscribe(`/topic/room/${roomId}/call`, async (msg) => {
            try {
                const data = JSON.parse(msg.body)
                // Ignore own messages
                if (data.senderId === userId) return
                console.log(`📥 VideoCall received signal: ${data.type}`)

                switch (data.type) {
                    case 'offer':
                        await webrtc.handleOffer(data.sdp)
                        break
                    case 'answer':
                        await webrtc.handleAnswer(data.sdp)
                        break
                    case 'ice-candidate':
                        await webrtc.handleIceCandidate(data.candidate)
                        break
                    case 'hangup':
                        handleHangup()
                        break
                    case 'rejected':
                        setCallState('ended')
                        setTimeout(() => onClose(), 1500)
                        break
                }
            } catch (err) {
                console.error('📥 Error processing signal:', err)
            }
        })

        return () => sub.unsubscribe()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stompClient, roomId, userId])

    /* ── Process buffered ICE candidates from ChatRoom ── */
    useEffect(() => {
        if (!pendingSignals || pendingSignals.length === 0) return

        // Only process ICE candidates from pending buffer.
        // Offers are handled via incomingPayload.sdp in the init effect.
        // Answers should never arrive before mount.
        const iceCandidates = pendingSignals.filter(
            (s) => s.type === 'ice-candidate' && s.senderId !== userId
        )

        if (iceCandidates.length === 0) return
        console.log(`📋 Processing ${iceCandidates.length} buffered ICE candidates`)

        const processPending = async () => {
            for (const data of iceCandidates) {
                await webrtc.handleIceCandidate(data.candidate as RTCIceCandidateInit)
            }
        }
        processPending().catch(console.error)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingSignals])

    /* ── Initiate or answer the call ── */
    const hasInitRef = useRef(false)
    useEffect(() => {
        // Guard against React StrictMode double-mount
        if (hasInitRef.current) return
        hasInitRef.current = true

        let offerTimeout: ReturnType<typeof setTimeout> | undefined

        const init = async () => {
            console.log('🎬 VideoCall init. isIncoming:', isIncoming)
            if (isIncoming) {
                // Answer incoming call — start media first
                const stream = await webrtc.startLocalMedia(true)
                if (localVideoRef.current) localVideoRef.current.srcObject = stream

                // Handle the buffered offer SDP (set by ChatRoom)
                if (incomingPayload?.sdp) {
                    console.log('📞 Incoming: handling offer SDP from payload')
                    await webrtc.handleOffer(incomingPayload.sdp as RTCSessionDescriptionInit)
                } else {
                    console.log('📞 Incoming: no SDP in payload — will wait for offer via subscription')
                }

                // Answer the call on the backend
                if (incomingPayload?.callId) {
                    try {
                        const rec = await answerCall(incomingPayload.callId as string)
                        setCallRecord(rec)
                    } catch (err) {
                        console.error('📞 Failed to answer call on backend:', err)
                    }
                }
                setCallState('connecting')
            } else {
                // Outgoing call — start media
                const stream = await webrtc.startLocalMedia(true)
                if (localVideoRef.current) localVideoRef.current.srcObject = stream

                const receiverId = incomingPayload?.receiverId as string
                console.log('📞 Outgoing: calling startCall API. roomId:', roomId)
                const rec = await startCall(roomId, receiverId)
                setCallRecord(rec)

                // Ring the peer
                sendSignal('ring', { callId: rec.id, callerName: otherUserName })

                // Delay the offer slightly so the receiver has time to render the ring dialog
                offerTimeout = setTimeout(async () => {
                    try {
                        console.log('📞 Outgoing: creating offer')
                        await webrtc.createOffer()
                        setCallState('connecting')
                    } catch (err) {
                        console.error('📞 Failed to create offer:', err)
                    }
                }, 1000) // Increased to 1s to give receiver more time
            }
        }
        init().catch((err) => console.error('❌ VideoCall init error:', err))

        return () => {
            if (offerTimeout) clearTimeout(offerTimeout)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleHangup = useCallback(async () => {
        clearInterval(timerRef.current)
        setCallState('ended')

        // Stop recording and upload if recording
        if (recording.isRecording) {
            await recording.stopRecording()
            if (callRecord?.id) await recording.uploadAndSave(callRecord.id)
        }

        // End call on backend
        if (callRecord?.id) {
            try { await endCall(callRecord.id) } catch { /* already ended */ }
        }

        sendSignal('hangup', {})
        webrtc.cleanup()
        setTimeout(() => onClose(), 800)
    }, [callRecord, recording, sendSignal, webrtc, onClose])

    const toggleRecording = () => {
        if (recording.isRecording) {
            recording.stopRecording()
        } else if (webrtc.localStream && webrtc.remoteStream) {
            recording.startRecording(webrtc.localStream, webrtc.remoteStream)
        }
    }

    const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden"
            >
                {/* Remote Video (full background) */}
                <motion.video
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay gradient for better text legibility */}
                <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

                {/* Top Info Bar */}
                <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="absolute top-0 inset-x-0 p-6 md:p-8 flex items-start justify-between z-10"
                >
                    <div className="flex flex-col gap-1">
                        <h2 className="text-white text-xl md:text-2xl font-semibold tracking-tight shadow-black drop-shadow-md">
                            {otherUserName}
                        </h2>
                        <div className="flex items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${callState === 'connected' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                            <p className="text-white/80 text-sm font-medium uppercase tracking-wider shadow-black drop-shadow-md">
                                {callState === 'ringing' && 'Ringing...'}
                                {callState === 'connecting' && 'Connecting...'}
                                {callState === 'connected' && formatTime(elapsed)}
                                {callState === 'ended' && 'Call ended'}
                            </p>
                        </div>
                    </div>

                    {recording.isRecording && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-2 bg-red-500/20 backdrop-blur-md border border-red-500/30 px-4 py-2 rounded-full shadow-lg"
                        >
                            <Circle className="h-3.5 w-3.5 fill-red-500 text-red-500 animate-pulse" />
                            <span className="text-xs text-white font-medium tracking-wide">Recording</span>
                        </motion.div>
                    )}
                </motion.div>

                {/* Local Video (PiP) */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, x: 20 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                    className="absolute top-24 right-6 md:top-8 md:right-8 w-28 h-40 md:w-48 md:h-32 rounded-2xl md:rounded-3xl overflow-hidden border border-white/20 shadow-2xl z-20 bg-gray-900/50 backdrop-blur-sm"
                >
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1]"
                    />
                </motion.div>

                {/* Floating Bottom Controls (Glassmorphism Dock) */}
                <motion.div
                    initial={{ y: 60, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute bottom-8 md:bottom-12 inset-x-0 flex justify-center z-20 pointer-events-none px-4"
                >
                    <div className="flex items-center gap-3 md:gap-5 bg-black/40 backdrop-blur-xl border border-white/10 p-3 md:p-4 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl pointer-events-auto">
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={webrtc.toggleMute}
                            className={`h-12 w-12 md:h-14 md:w-14 rounded-full transition-all duration-300 ${webrtc.isMuted
                                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
                                : 'bg-white/10 hover:bg-white/20 text-white'
                                }`}
                        >
                            {webrtc.isMuted ? <MicOff className="h-5 w-5 md:h-6 md:w-6" /> : <Mic className="h-5 w-5 md:h-6 md:w-6" />}
                        </Button>

                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={webrtc.toggleVideo}
                            className={`h-12 w-12 md:h-14 md:w-14 rounded-full transition-all duration-300 ${webrtc.isVideoOff
                                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20'
                                : 'bg-white/10 hover:bg-white/20 text-white'
                                }`}
                        >
                            {webrtc.isVideoOff ? <VideoOff className="h-5 w-5 md:h-6 md:w-6" /> : <Video className="h-5 w-5 md:h-6 md:w-6" />}
                        </Button>

                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={webrtc.toggleScreenShare}
                            className={`hidden sm:flex h-12 w-12 md:h-14 md:w-14 rounded-full transition-all duration-300 ${webrtc.isScreenSharing
                                ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                : 'bg-white/10 hover:bg-white/20 text-white'
                                }`}
                        >
                            <Monitor className="h-5 w-5 md:h-6 md:w-6" />
                        </Button>

                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={toggleRecording}
                            className={`h-12 w-12 md:h-14 md:w-14 rounded-full transition-all duration-300 ${recording.isRecording
                                ? 'bg-red-600 animate-pulse text-white shadow-lg shadow-red-500/30'
                                : 'bg-white/10 hover:bg-white/20 text-white'
                                }`}
                        >
                            <Circle className="h-5 w-5 md:h-6 md:w-6" />
                        </Button>

                        {/* Divider */}
                        <div className="w-px h-8 bg-white/20 mx-1 md:mx-2 hidden sm:block" />

                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={handleHangup}
                            className="h-12 w-14 md:h-14 md:w-20 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/30 transition-transform hover:scale-105 active:scale-95"
                        >
                            <PhoneOff className="h-5 w-5 md:h-6 md:w-6" />
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
