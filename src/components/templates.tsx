import { ReactNode, useEffect } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const FollowingsModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  useEffect(() => {
    const bodyElement = document.body;

    if (isOpen) {
      bodyElement.style.overflow = "hidden";
    } else {
      bodyElement.style.overflow = "";
    }

    const handleClickOutside = (event: MouseEvent) => {
      const modalElement = document.getElementById("modal");
      if (modalElement && !modalElement.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      bodyElement.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="modal"
      className="fixed inset-0 flex items-center justify-center bg-opacity-70 bg-black-light "
    >
      <div className="bg-white rounded-lg shadow-md w-8/12 sm:w-3/12">
        {children}
      </div>
    </div>
  );
};

export const FollowersModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  useEffect(() => {
    const bodyElement = document.body;

    if (isOpen) {
      bodyElement.style.overflow = "hidden";
    } else {
      bodyElement.style.overflow = "";
    }

    const handleClickOutside = (event: MouseEvent) => {
      const modalElement = document.getElementById("modal");
      if (modalElement && !modalElement.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      bodyElement.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="modal"
      className="fixed inset-0 flex items-center justify-center bg-opacity-70 bg-black-light "
    >
      <div className="bg-white rounded-lg shadow-md w-8/12 sm:w-3/12">
        {children}
      </div>
    </div>
  );
};

export const UserSettingsModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  useEffect(() => {
    const bodyElement = document.body;

    if (isOpen) {
      bodyElement.style.overflow = "hidden";
    } else {
      bodyElement.style.overflow = "";
    }

    const handleClickOutside = (event: MouseEvent) => {
      const modalElement = document.getElementById("modal");
      if (modalElement && !modalElement.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      bodyElement.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      id="modal"
      className="fixed inset-0 flex items-center justify-center bg-opacity-70 bg-black-light "
    >
      <div className="bg-white rounded-lg shadow-md w-8/12 sm:w-3/12">
        {children}
      </div>
    </div>
  );
};
