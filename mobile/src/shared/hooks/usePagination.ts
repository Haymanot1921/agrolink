// mobile/src/shared/hooks/usePagination.ts
// Server-side pagination for lists (products, orders, messages, tickets).
// SRS refs: FR-SEARCH-008 (pagination), NFR-PERF-003.

import { useCallback, useRef, useState } from 'react';

export interface PaginationState {
  page: number;
  perPage: number;
  hasMore: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
}

export interface UsePaginationOptions<T> {
  /** Fetcher — receives (page, perPage), returns { items, hasMore }. */
  fetchPage: (page: number, perPage: number) => Promise<{ items: T[]; hasMore: boolean }>;
  perPage?: number;
  /** Initial data (optional — skips the first fetch if provided). */
  initialData?: T[];
  initialHasMore?: boolean;
}

export interface UsePaginationResult<T> extends PaginationState {
  items: T[];
  loadInitial: () => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
  /** Manually update an item by index. */
  updateItem: (index: number, patch: Partial<T>) => void;
  /** Remove an item by index. */
  removeItem: (index: number) => void;
  /** Prepend an item (optimistic insert). */
  prependItem: (item: T) => void;
}

export function usePagination<T>({
  fetchPage,
  perPage = 20,
  initialData,
  initialHasMore = true,
}: UsePaginationOptions<T>): UsePaginationResult<T> {
  const [items, setItems] = useState<T[]>(initialData ?? []);
  const [state, setState] = useState<PaginationState>({
    page: initialData ? 1 : 0,
    perPage,
    hasMore: initialHasMore,
    isLoading: false,
    isLoadingMore: false,
    error: null,
  });

  const loadingRef = useRef(false);

  const loadInitial = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const { items: pageItems, hasMore } = await fetchPage(1, perPage);
      setItems(pageItems);
      setState((s) => ({
        ...s,
        page: 1,
        hasMore,
        isLoading: false,
        error: null,
      }));
    } catch (e) {
      setState((s) => ({ ...s, isLoading: false, error: (e as Error).message }));
    } finally {
      loadingRef.current = false;
    }
  }, [fetchPage, perPage]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !state.hasMore) return;
    loadingRef.current = true;
    setState((s) => ({ ...s, isLoadingMore: true }));
    try {
      const nextPage = state.page + 1;
      const { items: pageItems, hasMore } = await fetchPage(nextPage, perPage);
      setItems((prev) => [...prev, ...pageItems]);
      setState((s) => ({ ...s, page: nextPage, hasMore, isLoadingMore: false }));
    } catch (e) {
      setState((s) => ({ ...s, isLoadingMore: false, error: (e as Error).message }));
    } finally {
      loadingRef.current = false;
    }
  }, [fetchPage, perPage, state.page, state.hasMore]);

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, page: 0, hasMore: true }));
    await loadInitial();
  }, [loadInitial]);

  const reset = useCallback(() => {
    setItems([]);
    setState({ page: 0, perPage, hasMore: true, isLoading: false, isLoadingMore: false, error: null });
  }, [perPage]);

  const updateItem = useCallback((index: number, patch: Partial<T>) => {
    setItems((prev) => {
      const next = [...prev];
      if (next[index]) next[index] = { ...next[index], ...patch };
      return next;
    });
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const prependItem = useCallback((item: T) => {
    setItems((prev) => [item, ...prev]);
  }, []);

  return {
    ...state,
    items,
    loadInitial,
    loadMore,
    refresh,
    reset,
    updateItem,
    removeItem,
    prependItem,
  };
}