// mobile/src/shared/services/offlineQueue.ts
// Queue for actions attempted while offline. Replays when back online.
// SRS refs: NFR-REL-004 (offline reliability).

import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './apiClient';

export interface QueuedRequest {
  id: string;
  method: 'post' | 'put' | 'patch' | 'delete';
  url: string;
  body?: unknown;
  createdAt: number;
  attempts: number;
  lastError?: string;
}

const STORAGE_KEY = '@agrolink/offline-queue';
const MAX_ATTEMPTS = 5;

let flushing = false;
let onFlushed: ((count: number) => void) | null = null;
let onFailed: ((req: QueuedRequest, error: string) => void) | null = null;

async function readQueue(): Promise<QueuedRequest[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as QueuedRequest[]) : [];
  } catch {
    return [];
  }
}

async function writeQueue(queue: QueuedRequest[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
}

export const offlineQueue = {
  setFlushedHandler(handler: (count: number) => void): void {
    onFlushed = handler;
  },
  setFailedHandler(handler: (req: QueuedRequest, error: string) => void): void {
    onFailed = handler;
  },

  async enqueue(
    method: QueuedRequest['method'],
    url: string,
    body?: unknown,
  ): Promise<void> {
    const queue = await readQueue();
    queue.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      method,
      url,
      body,
      createdAt: Date.now(),
      attempts: 0,
    });
    await writeQueue(queue);
  },

  async size(): Promise<number> {
    return (await readQueue()).length;
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },

  async flush(): Promise<{ success: number; failed: number }> {
    if (flushing) return { success: 0, failed: 0 };
    flushing = true;
    let success = 0;
    let failed = 0;

    try {
      const queue = await readQueue();
      const remaining: QueuedRequest[] = [];

      for (const req of queue) {
        try {
          await apiClient.request({
            method: req.method,
            url: req.url,
            data: req.body,
          });
          success += 1;
        } catch (e) {
          const error = (e as Error).message;
          if (req.attempts + 1 >= MAX_ATTEMPTS) {
            failed += 1;
            onFailed?.(req, error);
          } else {
            remaining.push({
              ...req,
              attempts: req.attempts + 1,
              lastError: error,
            });
          }
        }
      }
      await writeQueue(remaining);
      if (success > 0) onFlushed?.(success);
      return { success, failed };
    } finally {
      flushing = false;
    }
  },
};