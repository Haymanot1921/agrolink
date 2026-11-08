// mobile/src/shared/hooks/useNetworkStatus.ts
// Re-export the network status from NetworkStatusProvider.
// SRS refs: NFR-REL-004, NFR-USE-006.

export { useNetworkStatus } from '@layouts/common/NetworkStatusProvider';
export type { NetworkStatus } from '@layouts/common/NetworkStatusProvider';