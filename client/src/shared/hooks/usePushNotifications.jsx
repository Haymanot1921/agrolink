import { useAllRealtimeUpdates } from './useRealtimeUpdates';
import { ToastProvider, useToast } from '../components/ui/Toast';
import { useNotificationStore } from '../store/notificationStore';

function RealtimeNotificationBridge() {
  const toast = useToast();

  useAllRealtimeUpdates((event, payload) => {
    if (event !== 'notification:new' || !payload || typeof payload !== 'object') {
      return;
    }

    const id = payload.id ?? payload._id;
    if (id != null) {
      useNotificationStore.getState().addItem({
        ...payload,
        id,
        isRead: Boolean(payload.isRead),
        createdAt: payload.createdAt ?? new Date().toISOString(),
      });
    }

    const message = [payload.title, payload.body]
      .filter((part) => typeof part === 'string' && part.length > 0)
      .join(' — ');
    const fallbackMessage =
      typeof payload.message === 'string' ? payload.message : '';

    if (message || fallbackMessage) {
      toast.info(message || fallbackMessage);
    }
  });

  return null;
}

export function NotificationProvider({ children }) {
  return (
    <ToastProvider>
      <RealtimeNotificationBridge />
      {children}
    </ToastProvider>
  );
}
