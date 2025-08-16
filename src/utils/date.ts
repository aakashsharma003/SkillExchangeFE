import { formatDistanceToNow } from 'date-fns';

export const formatTimeAgo = (timestamp: string) => {
  const timeAgo = formatDistanceToNow(new Date(timestamp + 'Z'), {
    addSuffix: true,
  });

  return timeAgo;
};
