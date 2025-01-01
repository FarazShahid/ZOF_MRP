import { FC, Fragment, ReactNode } from "react";

interface ModalLayoutProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  classNames?: string;
}

const ModalLayout: FC<ModalLayoutProps> = ({
  isOpen,
  onClose,
  children,
  classNames,
}) => {
  return (
    isOpen && (
      <div
        className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
        onClick={onClose}
      >
        <div
          className={`bg-white p-5 rounded-lg ${classNames === undefined? "" : classNames}`}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    )
  );
};

export default ModalLayout;

export const ModalHeader: FC<{
  onClose: () => void;
  title: string;
}> = ({ onClose, title }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      <button
        onClick={onClose}
        className="text-2xl font-bold text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
    </div>
  );
};

export const ModalBody: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <div className="mt-4 flex flex-col gap-2 lg:h-auto h-[50vh] overflow-auto">
      {children}
    </div>
  );
};

export const ModalFooter: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="mt-6 flex justify-end items-center gap-2">{children}</div>
  );
};
