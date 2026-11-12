import { ActorDashboardLayout } from '../common/ActorDashboardLayout';

const navigation = [
  { path: 'dashboard', labelKey: 'labels.dashboard', label: 'Dashboard', icon: '⌂' },
  { path: 'catalog', labelKey: 'input-supplier:catalog.title', label: 'Catalog', icon: '🌾' },
  { path: 'inventory', labelKey: 'input-supplier:inventory.title', label: 'Inventory', icon: '📦' },
  { path: 'orders', labelKey: 'input-supplier:orders.title', label: 'Orders', icon: '🧾' },
  { path: 'messages', labelKey: 'labels.messages', label: 'Messages', icon: '💬' },
  { path: 'notifications', labelKey: 'labels.notifications', label: 'Notifications', icon: '🔔' },
  { path: 'profile', labelKey: 'input-supplier:profile.title', label: 'Profile', icon: '👤' },
  { path: 'settings', labelKey: 'labels.settings', label: 'Settings', icon: '⚙' },
];

export function InputSupplierLayout() {
  return <ActorDashboardLayout basePath="/supplier" navigation={navigation} />;
}
