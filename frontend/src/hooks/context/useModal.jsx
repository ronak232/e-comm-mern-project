import { createContext, useState, useContext, useRef, useEffect } from "react";

// Create a Context for the Modal
const ModalContext = createContext();

// Provide Modal Context to children components
export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null); // to access the modal element's DOM node...
  const [modalTop, setModalTop] = useState(0);

  const openModal = () => {
    if (modalRef.current && isModalOpen) {
      const viewPortHeight = window.innerHeight;

      const modalHeight = modalRef.current.offsetHeight;
      const setPosition = (viewPortHeight - modalHeight) / 2;
      setModalTop(setPosition > 0 ? setPosition : 0);
      console.log(modalHeight);
    }
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  return (
    <ModalContext.Provider
      value={{ isModalOpen, openModal, closeModal, modalTop, modalRef }}
    >
      {children}
    </ModalContext.Provider>
  );
};

// Custom hook to use modal context
export const useModal = () => useContext(ModalContext);
