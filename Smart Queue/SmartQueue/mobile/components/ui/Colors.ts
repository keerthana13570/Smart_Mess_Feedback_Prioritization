export const Colors = {
  bg: '#F6F7FB',
  card: '#FFFFFF',
  text: '#101828',
  muted: '#667085',
  border: '#EAECF0',
  primary: '#2563EB',
  danger: '#DC2626',
  warn: '#F59E0B',
  success: '#16A34A',
};

export function severityColor(sev: 'minor' | 'moderate' | 'serious') {
  if (sev === 'serious') return Colors.danger;
  if (sev === 'moderate') return Colors.warn;
  return Colors.success;
}

