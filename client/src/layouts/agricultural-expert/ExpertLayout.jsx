import { ActorDashboardLayout } from '../common/ActorDashboardLayout';

const navigation = [
  { path: 'dashboard', labelKey: 'labels.dashboard', label: 'Dashboard', icon: '⌂' },
  { path: 'profile', labelKey: 'agricultural-expert:profile.title', label: 'Profile', icon: '👤' },
  { path: 'requests', labelKey: 'agricultural-expert:consultationRequests.title', label: 'Requests', icon: '📩' },
  { path: 'consultations', labelKey: 'agricultural-expert:consultations.title', label: 'Consultations', icon: '🩺' },
  { path: 'schedule', labelKey: 'agricultural-expert:scheduling.title', label: 'Schedule', icon: '📅' },
  { path: 'messages', labelKey: 'labels.messages', label: 'Messages', icon: '💬' },
  { path: 'notifications', labelKey: 'labels.notifications', label: 'Notifications', icon: '🔔' },
  { path: 'settings', labelKey: 'labels.settings', label: 'Settings', icon: '⚙' },
];

export function ExpertLayout() {
  return <ActorDashboardLayout basePath="/expert" navigation={navigation} />;
}
