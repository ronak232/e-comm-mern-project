import React, { createContext, useState, useContext } from 'react';

// Create a Context for the Modal
const ModalContext = createContext();

// Provide Modal Context to children components
export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

// Custom hook to use modal context
export const useModal = () => useContext(ModalContext);
