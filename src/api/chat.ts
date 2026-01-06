import { ICreateChatFormData } from "@/types/chat"

import { api } from "./auth"

/**
 * Chat API helpers.
 *
 * All functions below talk to the backend using the shared axios `api` client.
 * To run the UI against dummy data only, you can temporarily replace each
 * `api.*` call with a `Promise.resolve({ success: true, data: [...] })`.
 */

// Create a new chat room for a specific exchange request / user pair.
export const createChatRoom = async (payload: ICreateChatFormData) => {
  const token = localStorage.getItem("token")

  const response = await api.post("/chat/rooms", payload, {
    headers: { Authorization: `Bearer ${token}` },
  })

  return response.data
}

// Fetch all chat rooms for a user by their user id.
export const getChats = async (id: string) => {
  const token = localStorage.getItem("token")

  const response = await api.get(`chat/rooms/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  return response.data
}

// Fetch all messages for a particular chat room.
export const getChat = async (chatRoomId: string) => {
  const token = localStorage.getItem("token")

  const response = await api.get(`chat/rooms/${chatRoomId}/messages`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  return response.data
}
