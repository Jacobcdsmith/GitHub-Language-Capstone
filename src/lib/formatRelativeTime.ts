export function formatRelativeTime(isoDate: string): string {
  const diffMinutes = Math.round((Date.now() - new Date(isoDate).getTime()) / 60000);
  if (diffMinutes < 60) return `${Math.max(diffMinutes, 0)}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.round(diffHours / 24)}d ago`;
}
