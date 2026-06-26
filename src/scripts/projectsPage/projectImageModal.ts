const MODAL_SELECTOR = "[data-project-modal]";
const MODAL_IMAGE_SELECTOR = "[data-project-modal-image]";
const MODAL_CLOSE_SELECTOR = "[data-project-modal-close]";
const PROJECT_THUMB_SELECTOR = "[data-project-thumb]";
const PROJECT_IMAGE_TRIGGER_SELECTOR = "[data-project-image-trigger]";

const updateThumbState = (image: HTMLImageElement) => {
  const trigger = image.closest(PROJECT_IMAGE_TRIGGER_SELECTOR);

  if (trigger instanceof HTMLElement) {
    trigger.dataset.loaded = "true";
  }
};

export const createProjectImageModalController = (root: HTMLElement) => {
  const modal = document.querySelector(MODAL_SELECTOR);
  const modalImage = document.querySelector(MODAL_IMAGE_SELECTOR);
  const modalCloseButton = document.querySelector(MODAL_CLOSE_SELECTOR);
  let previousBodyOverflow = "";
  let previousHtmlOverflow = "";

  const lockScroll = (locked: boolean) => {
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

  const closeModal = () => {
    if (modal instanceof HTMLDialogElement) {
      modal.close();
    }
  };

  const initializeThumbStates = () => {
    root.querySelectorAll(PROJECT_THUMB_SELECTOR).forEach((image) => {
      if (!(image instanceof HTMLImageElement)) {
        return;
      }

      if (image.complete) {
        updateThumbState(image);
      } else {
        image.addEventListener("load", () => updateThumbState(image), {
          once: true,
        });
      }
    });
  };

  const bindModalOpen = () => {
    root.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const trigger = target.closest(PROJECT_IMAGE_TRIGGER_SELECTOR);

      if (
        !(trigger instanceof HTMLAnchorElement) ||
        !(modal instanceof HTMLDialogElement) ||
        !(modalImage instanceof HTMLImageElement)
      ) {
        return;
      }

      event.preventDefault();
      modalImage.src = trigger.href;
      modal.showModal();
      lockScroll(true);
    });
  };

  const bindModalClose = () => {
    if (modalCloseButton instanceof HTMLButtonElement) {
      modalCloseButton.addEventListener("click", closeModal);
    }

    if (modal instanceof HTMLDialogElement) {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) {
          closeModal();
        }
      });

      modal.addEventListener("close", () => {
        lockScroll(false);

        if (modalImage instanceof HTMLImageElement) {
          modalImage.removeAttribute("src");
        }
      });
    }
  };

  const init = () => {
    initializeThumbStates();
    bindModalOpen();
    bindModalClose();
  };

  return {
    init,
  };
};
