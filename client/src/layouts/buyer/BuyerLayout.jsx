import { ActorDashboardLayout } from '../common/ActorDashboardLayout';

const navigation = [
  { path: 'dashboard', labelKey: 'labels.dashboard', label: 'Dashboard', icon: '⌂' },
  { path: 'marketplace', labelKey: 'buyer:marketplace.title', label: 'Marketplace', icon: '🛒' },
  { path: 'cart', labelKey: 'buyer:cart.title', label: 'Cart', icon: '🧺' },
  { path: 'orders', labelKey: 'buyer:orders.title', label: 'Orders', icon: '📦' },
  { path: 'consultations', labelKey: 'buyer:consultations.title', label: 'Consultations', icon: '🩺' },
  { path: 'messages', labelKey: 'labels.messages', label: 'Messages', icon: '💬' },
  { path: 'notifications', labelKey: 'labels.notifications', label: 'Notifications', icon: '🔔' },
  { path: 'profile', labelKey: 'labels.profile', label: 'Profile', icon: '👤' },
  { path: 'settings', labelKey: 'labels.settings', label: 'Settings', icon: '⚙' },
];

export function BuyerLayout() {
  return <ActorDashboardLayout basePath="/buyer" navigation={navigation} />;
}
