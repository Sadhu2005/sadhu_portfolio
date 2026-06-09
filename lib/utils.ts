export function asset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${base}${path}`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Completed':
      return '#10b981';
    case 'In Progress':
      return '#f59e0b';
    case 'Adding Features':
      return '#8b5cf6';
    default:
      return '#6b7280';
  }
}

export function getStatusIcon(status: string): string {
  switch (status) {
    case 'Completed':
      return '✅';
    case 'In Progress':
      return '🚧';
    case 'Adding Features':
      return '🔧';
    default:
      return '⏳';
  }
}

export function getProgressColor(progress: number): string {
  if (progress >= 90) return '#10b981';
  if (progress >= 70) return '#f59e0b';
  return '#ef4444';
}
