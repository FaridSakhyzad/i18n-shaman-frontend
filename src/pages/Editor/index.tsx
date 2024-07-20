import { useEffect } from 'react';
import { getTranslations } from '../../api/translations';

export default function Editor() {

  const data = {
    key: 'value',
    'virtual.key': 'value',
    folder: {
      folder1Key: 'folder1Value',
      folder2Key: 'folder2Value',
    }
  };

  useEffect(() => {
    getTranslations();
  }, []);

  return (
    <>
      <div className="container">
        <h1>Editor</h1>
        <input type="file" />
      </div>
    </>
  )
}