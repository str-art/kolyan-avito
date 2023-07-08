import { useState } from "react";

export type DialogController = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
};

export function useDialogController(): DialogController {
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  return {
    open,
    close,
    toggle,
    isOpen,
  };
}
