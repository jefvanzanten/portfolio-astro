import { createSignal } from "solid-js";

const [imageUrl, setImageUrl] = createSignal("");
const [isOpen, setIsOpen] = createSignal(false);
let dialogRef: HTMLDialogElement | undefined;
let previousBodyOverflow = "";
let previousHtmlOverflow = "";

const setDocumentScrollLocked = (locked: boolean) => {
  if (typeof document === "undefined") {
    return;
  }

  if (locked) {
    previousBodyOverflow = document.body.style.overflow;
    previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return;
  }

  document.body.style.overflow = previousBodyOverflow;
  document.documentElement.style.overflow = previousHtmlOverflow;
};

export const useImageViewModal = () => {
  const setDialog = (el: HTMLDialogElement) => {
    dialogRef = el;
  };

  const openModal = () => {
    setIsOpen(true);
    setDocumentScrollLocked(true);
    dialogRef?.showModal();
  };

  const closeModal = () => {
    setIsOpen(false);
    setDocumentScrollLocked(false);
    dialogRef?.close();
  };

  return {
    imageUrl,
    setImageUrl,
    setDialog,
    openModal,
    closeModal,
    isOpen,
  };
};
