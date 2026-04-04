import { IexchangeRequestFormData } from "@/types/swal-request"
import { api } from "./auth"
import { withCache, invalidateCacheByPrefix } from "@/utils/cache"

/**
 * Skill-exchange request API helpers.
 *
 * These functions follow the same pattern:
 * - read the JWT from localStorage,
 * - call the REST endpoint using the shared axios `api` instance,
 * - return the backend response payload (which includes `success`, `data`, etc.).
 *
 * GET requests are cached for 30 seconds for smooth navigation.
 * Mutations (accept / reject) invalidate the cache so the next read is fresh.
 */

const CACHE_PREFIX = "exchange-requests"

export const requestSkillExchange = async (payload: IexchangeRequestFormData) => {
  const token = localStorage.getItem("token")

  const response = await api.post("/exchange-requests", payload, {
    headers: { Authorization: `Bearer ${token}` },
  })

  // Invalidate cached lists so they refresh on next visit
  invalidateCacheByPrefix(CACHE_PREFIX)

  return response.data
}

export const fetchSentRequests = () => {
  return withCache(`${CACHE_PREFIX}-sent`, async () => {
    const token = localStorage.getItem("token")

    const response = await api.get("/exchange-requests/sent", {
      headers: { Authorization: `Bearer ${token}` },
    })

    return response.data
  }, 30_000)
}

export const fetchReceivedRequests = () => {
  return withCache(`${CACHE_PREFIX}-received`, async () => {
    const token = localStorage.getItem("token")

    const response = await api.get("/exchange-requests/received", {
      headers: { Authorization: `Bearer ${token}` },
    })

    return response.data
  }, 30_000)
}

export const acceptRequest = async (id: string, offeredSkill: string) => {
  const token = localStorage.getItem("token")

  const response = await api.put(
    `/exchange-requests/${id}`,
    { accepted: true, offeredSkill },
    { headers: { Authorization: `Bearer ${token}` } },
  )

  // Invalidate so subsequent reads get updated status
  invalidateCacheByPrefix(CACHE_PREFIX)

  return response.data
}

export const rejectRequest = async (id: string) => {
  const token = localStorage.getItem("token")

  const response = await api.put(
    `/exchange-requests/${id}`,
    { status: false },
    { headers: { Authorization: `Bearer ${token}` } },
  )

  invalidateCacheByPrefix(CACHE_PREFIX)

  return response.data
}
