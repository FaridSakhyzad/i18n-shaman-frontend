import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeLanguage } from 'i18next';
import { setUserLanguage } from 'store/user';
import { IRootState, AppDispatch } from 'store';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t } = useTranslation();

  const { id: userId } = useSelector(({ user }: IRootState) => user);

  const dispatch = useDispatch<AppDispatch>();

  const handleChangeLanguage = async (e: React.MouseEvent<HTMLElement>, language: string) => {
    e.preventDefault();

    await changeLanguage(language);
    localStorage.setItem('language', language);

    if (userId) {
      dispatch(setUserLanguage({ userId, language }));
    }
  };

  return (
    <header>
      <div className="container">
        <h1>{t('Welcome to React')}</h1>
        <button type="button" onClick={(e) => handleChangeLanguage(e, 'en')}>en</button>
        <button type="button" onClick={(e) => handleChangeLanguage(e, 'fr')}>fr</button>
      </div>
    </header>
  );
}
