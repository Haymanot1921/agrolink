// mobile/src/shared/hooks/useKeyboard.ts
// Keyboard visibility + height. Use for input spacing, scroll-to-input, etc.
// SRS refs: NFR-USE-005 (mobile-friendly), FR-AUTH-001 (form UX).

import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

export interface UseKeyboardResult {
  isVisible: boolean;
  height: number;
}

export function useKeyboard(): UseKeyboardResult {
  const [state, setState] = useState<UseKeyboardResult>({
    isVisible: false,
    height: 0,
  });

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e: KeyboardEvent) => {
      setState({ isVisible: true, height: e.endCoordinates.height });
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setState({ isVisible: false, height: 0 });
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return state;
}

/** Imperatively dismiss the keyboard. */
export function dismissKeyboard(): void {
  Keyboard.dismiss();
}