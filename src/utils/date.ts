// src/utils/date.ts
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';


export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function formatTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
}

export const formatTimeAgo = (dateValue: string | Date | number) => {
  if (!dateValue) return 'Just now';

  try {
    const date = new Date(dateValue);
    
    // Safety check for Invalid Date
    if (isNaN(date.getTime())) return 'Just now';

    // 1. If message is from today: show "10:51 AM"
    if (isToday(date)) {
      return format(date, 'hh:mm a'); 
    }

    // 2. If message is from yesterday: show "Yesterday"
    if (isYesterday(date)) {
      return 'Yesterday';
    }

    // 3. Older messages: show "2 days ago" or "Dec 18"
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return 'Just now';
  }
};

export function formatDateTime(date: string | Date): string {
  return `${formatDate(date)} at ${formatTime(date)}`
}

export function getRelativeTime(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diffInMs = now.getTime() - then.getTime()
  const diffInMins = Math.floor(diffInMs / 60000)

  if (diffInMins < 1) return "Just now"
  if (diffInMins < 60) return `${diffInMins} minute${diffInMins > 1 ? "s" : ""} ago`

  const diffInHours = Math.floor(diffInMins / 60)
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`

  return formatDate(date)
}