import React, { useEffect } from 'react';
import { getTranslations } from '../../api/translations';

export default function Editor() {
  useEffect(() => {
    getTranslations();
  }, []);

  return (
    <div className="container">
      <h1>Editor</h1>
      <input type="file" />
    </div>
  );
}
