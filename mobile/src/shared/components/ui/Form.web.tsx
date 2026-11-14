import React from 'react';
import { spacing } from '@styles/spacing';

interface FormProps {
  children: React.ReactNode;
  onSubmit: () => void;
}

export function Form({ children, onSubmit }: FormProps): React.ReactElement {
  return React.createElement(
    'form',
    {
      onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit();
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.md,
      },
    },
    children,
  );
}
