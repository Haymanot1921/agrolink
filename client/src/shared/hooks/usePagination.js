// client/src/shared/hooks/usePagination.js
// Page state + slice helper + URL sync (optional).
// SRS refs: FR-SEARCH-008 pagination.

import { useCallback, useMemo, useState } from 'react';

export function usePagination({
  initialPage = 1,
  initialPerPage = 20,
  total = 0,
  onChange,
} = {}) {
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const setPageSafe = useCallback(
    (p) => {
      const next = Math.max(1, Math.min(p, totalPages));
      setPage(next);
      onChange?.({ page: next, perPage });
    },
    [totalPages, perPage, onChange],
  );

  const setPerPageSafe = useCallback(
    (pp) => {
      const next = Math.max(1, pp);
      setPerPage(next);
      setPage(1); // reset to page 1 on page-size change
      onChange?.({ page: 1, perPage: next });
    },
    [onChange],
  );

  const range = useMemo(
    () => ({
      start: (page - 1) * perPage,
      end: page * perPage,
      page,
      perPage,
      total,
      totalPages,
    }),
    [page, perPage, total, totalPages],
  );

  return {
    page,
    perPage,
    totalPages,
    ...range,
    setPage: setPageSafe,
    setPerPage: setPerPageSafe,
    next: () => setPageSafe(page + 1),
    prev: () => setPageSafe(page - 1),
    first: () => setPageSafe(1),
    last: () => setPageSafe(totalPages),
  };
}

export default usePagination;