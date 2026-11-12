// client/src/shared/store/index.js
// Central store barrel — every store accessible via single import.
// SRS refs: NFR-MAINT-001 (modular frontend).

export { useAuthStore } from './authStore';
export { useSettingsStore } from './settingsStore';
export { useNotificationStore } from './notificationStore';