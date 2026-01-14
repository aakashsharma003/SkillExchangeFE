import type { ICreateChatFormData, IChat, IMessage } from "@/types/chat"
import { api } from "@/api/auth"

/**
 * Real backend-backed Chat API.
 *
 * Endpoints (Spring Boot):
 * - POST /api/chat/rooms
 * - GET  /api/chat/rooms/{userId}
 * - GET  /api/chat/rooms/{roomId}/messages
 */

export const createChatRoom = async (payload: ICreateChatFormData) => {
  const token = localStorage.getItem("token")

  const response = await api.post("/chat/rooms", payload, {
    headers: { Authorization: `Bearer ${token}` },
  })

  return response.data
}

export const getChats = async (userId: string) => {
  const token = localStorage.getItem("token")

  const response = await api.get(`/chat/rooms/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  // Normalize backend payload -> frontend IChat shape
  const res = response.data
  if (res?.success && Array.isArray(res.data)) {
    res.data = res.data.map((room: any): IChat => ({
      chatRoomId: room.chatRoomId || room.id,
      otherUser: room.otherUser,
      offeredSkill: room.offeredSkill || "",
      requestedSkill: room.requestedSkill || "",
      lastActivityAt: room.lastActivityAt,
      exchangeRequestId: room.exchangeRequestId,
    }))
  }

  return res
}

export const getChat = async (chatRoomId: string) => {
  const token = localStorage.getItem("token")

  const response = await api.get(`/chat/rooms/${chatRoomId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const res = response.data
  if (res?.success && Array.isArray(res.data)) {
    res.data = res.data.map((m: any): IMessage => ({
      id: m.id,
      chatRoomId: m.chatRoomId,
      senderId: m.senderId,
      senderEmail: m.senderEmail,
      content: m.content,
      createdAt: m.createdAt,
    }))
  }

  return res
}
