import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uiToggle } from 'store/ui';
import { IRootState } from 'store';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t, i18n } = useTranslation();

  const { text: headerText, show } = useSelector(({ ui }: IRootState) => ui);

  const dispatch = useDispatch();

  const handleButtonClick = () => {
    dispatch(uiToggle());
  };

  return (
    <header>
      <div className="container">
        <h1>{t('Welcome to React')}</h1>
        <hr/>
        <button type="button" onClick={handleButtonClick}>Button</button>
        <hr/>
        {show && (
          <h1>HEADER TEXT: {headerText}</h1>
        )}
      </div>
    </header>
  );
}
