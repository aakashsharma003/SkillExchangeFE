// src/utils/date.ts
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';

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