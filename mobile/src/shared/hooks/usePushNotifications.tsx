// mobile/src/shared/hooks/usePushNotifications.ts
// Push notification provider + device token registration.
// SRS refs: §5.12 FR-NOTIFY-001..010, FR-NOTIFY-007 (in-app).

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

import { notificationsService } from '@services/pushNotificationService';
import { useAuth } from './useAuth';

// Configure default presentation (foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface PushNotificationData {
  type?: string;
  relatedType?: string;
  relatedId?: string;
  [key: string]: unknown;
}

interface NotificationContextValue {
  /** Expo push token (null until registered). */
  token: string | null;
  /** Last received notification. */
  lastNotification: Notifications.Notification | null;
  /** Request permission + register. */
  register: () => Promise<string | null>;
  /** Mark badge count. */
  setBadgeCount: (n: number) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }): React.ReactElement {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [lastNotification, setLastNotification] =
    useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const register = useCallback(async () => {
    if (!Device.isDevice) return null;

    const { status: existing } = await Notifications.getPermissionsAsync();
    let status = existing;
    if (existing !== 'granted') {
      const req = await Notifications.requestPermissionsAsync();
      status = req.status;
    }
    if (status !== 'granted') return null;

    // Android channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'AgroLink',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2E7D32',
      });
    }

    const projectId =
      (Constants.expoConfig?.extra?.eas?.projectId as string | undefined) ??
      Constants.easConfig?.projectId;

    if (!projectId) return null;

    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    setToken(tokenData.data);

    if (user) {
      await notificationsService.registerDevice(tokenData.data).catch(() => {});
    }

    return tokenData.data;
  }, [user]);

  const setBadgeCount = useCallback(async (n: number) => {
    await Notifications.setBadgeCountAsync(n);
  }, []);

  // Register when user logs in
  useEffect(() => {
    if (user) register();
  }, [user, register]);

  // Subscribe to notifications
  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((n) => {
      setLastNotification(n);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as PushNotificationData;
      notificationsService.handleDeepLink(data);
    });
    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ token, lastNotification, register, setBadgeCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function usePushNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('usePushNotifications must be used inside NotificationProvider');
  return ctx;
}