"use client";

import { useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Drawer({ open, onClose, children }: DrawerProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const dragging = useRef(false);

  if (!open) return null;

  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true;
    dragStartY.current = e.clientY;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current || !sheetRef.current) return;
    const delta = Math.max(0, e.clientY - dragStartY.current);
    sheetRef.current.style.transition = "none";
    sheetRef.current.style.transform = `translateY(${delta}px)`;
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!dragging.current || !sheetRef.current) return;
    dragging.current = false;
    const delta = Math.max(0, e.clientY - dragStartY.current);
    sheetRef.current.style.transition = "";

    if (delta > 100) {
      sheetRef.current.style.transform = "translateY(100%)";
      setTimeout(onClose, 270);
    } else {
      sheetRef.current.style.transform = "";
    }
  }

  return createPortal(
    <div className="drawer-root">
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer-sheet" ref={sheetRef}>
        <div
          className="drawer-handle-wrap"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <div className="drawer-handle" />
        </div>
        <div className="drawer-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}
