import React, { useEffect } from 'react';

import './Modal.scss';

interface IProps {
  children: React.ReactNode;
  customClassNames?: string;
  onEscapeKeyPress?: () => void;
}

export default function Modal({ children, customClassNames, onEscapeKeyPress = () => {} }: IProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      onEscapeKeyPress();
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  return (
    <div className="modal">
      <div className="modal-backdrop">
        <div className={`modal-window ${customClassNames || ''}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
