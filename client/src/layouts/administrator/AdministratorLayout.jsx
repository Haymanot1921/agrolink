import { ActorDashboardLayout } from '../common/ActorDashboardLayout';

const navigation = [
  { path: 'dashboard', labelKey: 'labels.dashboard', label: 'Dashboard', icon: '⌂' },
  { path: 'assisted-farmers', labelKey: 'administrator:assistedFarmers.title', label: 'Assisted farmers', icon: '🌱' },
  { path: 'users', labelKey: 'administrator:users.title', label: 'Users', icon: '👥' },
  { path: 'verification', labelKey: 'administrator:verification.title', label: 'Verification', icon: '✅' },
  { path: 'listing-moderation', labelKey: 'administrator:listingModeration.title', label: 'Listing moderation', icon: '🛍️' },
  { path: 'review-moderation', labelKey: 'administrator:reviewModeration.title', label: 'Review moderation', icon: '⭐' },
  { path: 'disputes', labelKey: 'administrator:disputes.title', label: 'Disputes', icon: '⚖' },
  { path: 'reports', labelKey: 'administrator:reports.title', label: 'Reports', icon: '📊' },
  { path: 'audit-logs', labelKey: 'administrator:auditLogs.title', label: 'Audit logs', icon: '📋' },
  { path: 'notifications', labelKey: 'labels.notifications', label: 'Notifications', icon: '🔔' },
  { path: 'profile', labelKey: 'labels.profile', label: 'Profile', icon: '👤' },
  { path: 'settings', labelKey: 'labels.settings', label: 'Settings', icon: '⚙' },
];

export function AdministratorLayout() {
  return <ActorDashboardLayout basePath="/admin" navigation={navigation} />;
}
