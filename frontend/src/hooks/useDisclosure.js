'use client';

import { useState, useCallback } from 'react';

/**
 * Hook to manage boolean disclosure state (e.g., modals, drawers, dropdowns).
 *
 * @param {boolean} [initialState=false]
 * @returns {{ isOpen: boolean, open: () => void, close: () => void, toggle: () => void, setOpen: (v: boolean) => void }}
 */
export function useDisclosure(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle, setOpen: setIsOpen };
}

export default useDisclosure;

