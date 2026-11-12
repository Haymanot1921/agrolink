// client/src/shared/hooks/useDebounce.js
// Debounces a value. Used by SearchInput and any live-search field.
// SRS refs: FR-SEARCH-001, NFR-PERF-002.

import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

export default useDebounce;