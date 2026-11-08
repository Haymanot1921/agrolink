// mobile/src/shared/services/pushNotificationService.ts
// Registers device tokens + routes notification deep-links.
// SRS refs: §5.12 FR-NOTIFY-001..010, §11.7.

import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { api } from './apiClient';
import { navigate } from '@app/navigationRef';

export interface PushNotificationData {
  type?: string;
  relatedType?: string;
  relatedId?: string;
  [key: string]: unknown;
}

export const notificationsService = {
  async registerDevice(token: string): Promise<void> {
    await api.post('/notifications/devices', {
      token,
      platform: Platform.OS,
    });
  },

  async unregisterDevice(token: string): Promise<void> {
    try {
      await api.delete(`/notifications/devices/${encodeURIComponent(token)}`);
    } catch {
      // ignore
    }
  },

  /** Route based on notification payload — SRS §11.7 deep link into relevant screen. */
  handleDeepLink(data: PushNotificationData): void {
    if (!data?.type) return;

    switch (data.type) {
      // Orders (all actor contexts)
      case 'order.created':
      case 'order.status_changed':
        if (data.relatedId) {
          navigate('Buyer', { screen: 'BuyerOrderDetails', params: { orderId: String(data.relatedId) } });
        }
        break;

      // Farmer order
      case 'farmer.order.created':
        if (data.relatedId) {
          navigate('Farmer', { screen: 'OrderDetails', params: { orderId: String(data.relatedId) } });
        }
        break;

      // Messages
      case 'message.created':
        if (data.relatedId) {
          // Try a generic messaging route; each actor stack has its own messaging screen.
          navigate('Buyer', { screen: 'BuyerMessages' });
        }
        break;

      // Consultations
      case 'consultation.assigned':
      case 'consultation.status_changed':
        if (data.relatedId) {
          navigate('AgriculturalExpert', { screen: 'ExpertConsultationDetails', params: { consultationId: String(data.relatedId) } });
        }
        break;

      // Support
      case 'ticket.assigned':
      case 'ticket.status_changed':
        if (data.relatedId) {
          navigate('SupportAgent', { screen: 'TicketDetails', params: { ticketId: String(data.relatedId) } });
        }
        break;

      // Assisted farmer
      case 'assisted.consent_recorded':
      case 'assisted.suspicious_activity':
        if (data.relatedId) {
          navigate('Administrator', { screen: 'AssistedActionDetails', params: { actionId: String(data.relatedId) } });
        }
        break;

      // Disputes
      case 'dispute.created':
      case 'dispute.updated':
        if (data.relatedId) {
          navigate('Administrator', { screen: 'DisputeDetails', params: { disputeId: String(data.relatedId) } });
        }
        break;

      default:
        // Fall back to opening the notification list
        navigate('Buyer', { screen: 'BuyerNotifications' });
        break;
    }
  },

  async clearAll(): Promise<void> {
    await Notifications.dismissAllNotificationsAsync();
    await Notifications.setBadgeCountAsync(0);
  },
};