export function formatMessageTime(date) {
  const now = new Date();
  const msgTime = new Date(date);
  const diffMs = now - msgTime;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours   = Math.floor(minutes / 60);
  const days    = Math.floor(hours / 24);

  if (seconds < 5) return "Just now";
  if (seconds < 60) return `${seconds}s ago`;
  if (minutes === 1) return "1 minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours === 1) return "1 hour ago"
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return "Yesterday"
  return `${days} days ago`;
}