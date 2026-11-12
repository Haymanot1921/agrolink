import { ActorDashboardLayout } from '../common/ActorDashboardLayout';

const navigation = [
  { path: 'dashboard', labelKey: 'labels.dashboard', label: 'Dashboard', icon: '⌂' },
  { path: 'assisted-farmers', labelKey: 'support-agent:assistedFarmers.title', label: 'Assisted farmers', icon: '🌱' },
  { path: 'consents', labelKey: 'support-agent:consent.title', label: 'Consents', icon: '✅' },
  { path: 'tickets', labelKey: 'support-agent:tickets.title', label: 'Tickets', icon: '🎫' },
  { path: 'messages', labelKey: 'labels.messages', label: 'Messages', icon: '💬' },
  { path: 'notifications', labelKey: 'labels.notifications', label: 'Notifications', icon: '🔔' },
  { path: 'settings', labelKey: 'labels.settings', label: 'Settings', icon: '⚙' },
];

export function SupportAgentLayout() {
  return <ActorDashboardLayout basePath="/support-agent" navigation={navigation} />;
}
