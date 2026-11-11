// client/src/shared/components/ui/SearchInput.jsx
// Debounced search input with clear button.
// SRS refs: FR-SEARCH-001, NFR-USE-001.

import React, { useState, useEffect } from 'react';

export function SearchInput({ value, onChange, placeholder, debounce = 300, disabled }) {
  const [local, setLocal] = useState(value ?? '');

  useEffect(() => {
    setLocal(value ?? '');
  }, [value]);

  useEffect(() => {
    if (local === (value ?? '')) return undefined;
    const id = setTimeout(() => onChange?.(local), debounce);
    return () => clearTimeout(id);
  }, [local, debounce, onChange, value]);

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <span style={{ position: 'absolute', left: 12, color: 'var(--color-text-muted, #5F6368)' }} aria-hidden>
        🔍
      </span>
      <input
        type="search"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={placeholder}
        style={{
          width: '100%',
          padding: '10px 36px 10px 40px',
          fontSize: 15,
          fontFamily: 'inherit',
          border: '1px solid var(--color-border, #E0E0E0)',
          borderRadius: 8,
          background: 'var(--color-card, #fff)',
        }}
      />
      {local && (
        <button
          type="button"
          onClick={() => {
            setLocal('');
            onChange?.('');
          }}
          aria-label="Clear search"
          style={{ position: 'absolute', right: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted, #5F6368)' }}
        >
          ×
        </button>
      )}
    </div>
  );
}

export default SearchInput;