import React, { useEffect } from 'react';

import './Modal.scss';

interface IProps {
  children: React.ReactNode;
  customClassNames?: string;
}

export default function Modal({ children, customClassNames }: IProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
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
