import React, { useMemo } from 'react';
import { createPortal } from 'react-dom';

interface OverlayPortalProps {
  children: React.ReactNode;
}

export default function OverlayPortal({ children }: OverlayPortalProps) {
  const container = useMemo(() => {
    if (typeof document === 'undefined') return null;

    let node = document.getElementById('lc-overlay-root');
    if (!node) {
      node = document.createElement('div');
      node.id = 'lc-overlay-root';
      document.body.appendChild(node);
    }
    return node;
  }, []);

  if (!container) return null;
  return createPortal(children, container);
}
