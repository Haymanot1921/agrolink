import { ActorDashboardLayout } from '../common/ActorDashboardLayout';

const navigation = [
  { path: 'dashboard', labelKey: 'labels.dashboard', label: 'Dashboard', icon: '⌂' },
  { path: 'products', labelKey: 'farmer:products.title', label: 'My products', icon: '🌱' },
  { path: 'orders', labelKey: 'farmer:orders.title', label: 'Orders', icon: '📦' },
  { path: 'consultations', labelKey: 'farmer:consultations.title', label: 'Consultations', icon: '🩺' },
  { path: 'messages', labelKey: 'labels.messages', label: 'Messages', icon: '💬' },
  { path: 'market-prices', labelKey: 'farmer:marketPrices.title', label: 'Market prices', icon: '📈' },
  { path: 'articles', labelKey: 'farmer:articles.title', label: 'Articles', icon: '📚' },
  { path: 'notifications', labelKey: 'labels.notifications', label: 'Notifications', icon: '🔔' },
  { path: 'profile', labelKey: 'labels.profile', label: 'Profile', icon: '👤' },
  { path: 'settings', labelKey: 'labels.settings', label: 'Settings', icon: '⚙' },
];

export function FarmerLayout() {
  return <ActorDashboardLayout basePath="/farmer" navigation={navigation} />;
}
