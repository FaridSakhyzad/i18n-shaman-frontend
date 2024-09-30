import React, { useEffect, useState, useRef } from 'react';
import Modal from 'components/Modal';

import './AddProjectLanguage.scss';
import getLanguages, { ILanguage } from './languages';

interface ILanguageListItemData {
  id: string;
}

interface ISelectedLanguage {
  [key: string]: number;
}

export default function AddProjectLanguage() {
  const fullLanguagesList = getLanguages();

  const [ languages, setLanguages ] = useState(getLanguages());
  const [ languagesPanelVisible, setLanguagesPanelVisible ] = useState<boolean>(false);
  const [ selectedLanguageMap, setSelectedLanguageMap ] = useState<ISelectedLanguage>({});
  const [ languageSearchQuery, setLanguageSearchQuery ] = useState('');
  const [ searchQueryPrevValue, setSearchQueryPrevValue ] = useState('');

  const languageSearchFieldRef = useRef<HTMLInputElement>(null);
  const languageSearchFieldWrapperRef = useRef<HTMLLabelElement>(null);

  const languagesMap = (() => {
    const result = {} as { [key: string]: number };

    for (let i = 0; i < fullLanguagesList.length; i++) {
      const { code } = fullLanguagesList[i];

      result[code] = i;
    }

    return result;
  })();

  const handleOutsideClick = (e: MouseEvent) => {
    if (e.target !== languageSearchFieldRef.current && e.target !== languageSearchFieldWrapperRef.current) {
      setLanguagesPanelVisible(false);
      window.removeEventListener('click', handleOutsideClick);
    }
  }

  const handleLanguagesListWrapperClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();

    languageSearchFieldRef.current && languageSearchFieldRef.current.focus();
  }

  const handleLanguagesListFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.stopPropagation();

    const newVisibilityState = !languagesPanelVisible;

    if (newVisibilityState) {
      window.addEventListener('click', handleOutsideClick);
    } else {
      window.removeEventListener('click', handleOutsideClick);
    }

    setLanguagesPanelVisible(newVisibilityState);
  }

  const handleLanguagesListBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.relatedTarget) {
      setLanguagesPanelVisible(false);
    }
  }

  const handleLanguageSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = e;

    setLanguageSearchQuery(value);

    if (value.length < 1) {
      setLanguages(fullLanguagesList);

      return;
    }

    const filtered = fullLanguagesList.filter(({ label, code }) => {
      const normalizedValue = value.toLowerCase().trim();

      if (normalizedValue.length < 1) {
        return true;
      }

      const normalizedLabel = `${label.toLowerCase()} (${code})`;

      return normalizedLabel.includes(normalizedValue);
    });

    setLanguages(filtered);
    setLanguagesPanelVisible(true);
  }

  const handleLanguageSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setSearchQueryPrevValue(e.currentTarget.value)
  }

  const handleLanguageSearchKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code !== 'Backspace' || e.currentTarget.value.length > 0 || searchQueryPrevValue.length > 0) {
      return;
    }

    const elToDelete = selectedLanguages[selectedLanguages.length - 1];

    if (elToDelete) {
      delete selectedLanguageMap[elToDelete.code];

      setSelectedLanguageMap({ ...selectedLanguageMap });
    }
  }

  const handleLanguagesListItemClick = (e: React.MouseEvent<HTMLUListElement>) => {
    const { target } = e;
    const { id } = target as HTMLLIElement;
    const langIndex: number = languagesMap[id];

    const result: ISelectedLanguage = {
      ...selectedLanguageMap
    }

    if (result[id] !== undefined) {
      delete result[id];
    } else {
      result[id] = langIndex;
    }

    setSelectedLanguageMap(result);
    setLanguagesPanelVisible(false);
    setLanguageSearchQuery('');

    languageSearchFieldRef.current && languageSearchFieldRef.current.focus();
  }

  const getSelectedLanguages = () => {
    const result: ILanguage[] = [];

    Object.values(selectedLanguageMap).forEach((languageIndex) => {
      if (fullLanguagesList[languageIndex]) {
        result.push(fullLanguagesList[languageIndex])
      }
    })

    return result;
  }

  const selectedLanguages = getSelectedLanguages();

  const handleChipClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('handleChipClick');
  }

  const handleChipDelete = (id: string) => {
    delete selectedLanguageMap[id];

    setSelectedLanguageMap({ ...selectedLanguageMap });
  }

  const theresMatchesToDisplay = () => {
    const allMatchesAreSelected = languages.every((language) => {
      return selectedLanguageMap[language.code] !== undefined;
    })

    return languages.length > 0 && !allMatchesAreSelected;
  }

  return (
    <Modal customClassNames="modal_withBottomButtons modal_addProjectLang">
      <div className="modal-header">
        <h4 className="modal-title">Add New Language</h4>
        <button
          type="button"
          className="modal-closeButton"
        />
      </div>
      <div className="modal-content">
        <form className="form">
          <div className="form-row">
            <div className="formControl">
              <div className="languagesSelector">
                <label
                  ref={languageSearchFieldWrapperRef}
                  className="select languagesSelector-chipBox"
                  onClick={handleLanguagesListWrapperClick}
                >
                  {selectedLanguages.length > 0 && selectedLanguages.map(({code, label}: ILanguage) => (
                    <span
                      className="languagesSelector-chip"
                      key={code}
                      onClick={handleChipClick}
                    >
                        {label}
                      <i
                        className="languagesSelector-chipDelete"
                        onClick={() => handleChipDelete(code)}
                      />
                      </span>
                  ))}
                  <input
                    ref={languageSearchFieldRef}
                    type="text"
                    className="languagesSelector-input"
                    value={languageSearchQuery}
                    size={languageSearchQuery.length || 1}
                    onChange={handleLanguageSearchQueryChange}
                    onKeyDown={handleLanguageSearchKeyDown}
                    onKeyUp={handleLanguageSearchKeyUp}
                    onFocus={handleLanguagesListFocus}
                    onBlur={handleLanguagesListBlur}
                    tabIndex={0}
                  />
                </label>

                {languagesPanelVisible && (
                  <div className="dropdownPanel languagesSelector-panel">
                    {theresMatchesToDisplay() ? (
                      <ul className="languagesSelector-list" onClick={handleLanguagesListItemClick}>
                        {languages.map(({code, label}: ILanguage) => {
                          if (selectedLanguageMap[code] !== undefined) {
                            return null;
                          }

                          return (
                            <li
                              className={`languagesSelector-listItem ${selectedLanguageMap[code] !== undefined ? 'selected' : ''}`}
                              key={code}
                              id={code}
                            >{label} ({code})</li>
                          )
                        })}
                      </ul>
                    ) : (
                      <div className="languagesSelector-noMatches">No Matches Found</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="formControl">
              <div className="formControl-header">
                <label className="formControl-label">Custom language code <i className="formControl-infoIcon"/></label>
              </div>
              <div className="formControl-body addProjectLang-switchableControl">
                <input type="checkbox" className="switcher"/>

                <div className="formControl-wrapper">
                <input type="text" className="input formControl-input" disabled />
                </div>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="formControl">
              <div className="formControl-header">
                <label className="formControl-label">Custom language name <i className="formControl-infoIcon"/></label>
              </div>
              <div className="formControl-body addProjectLang-switchableControl">
                <input type="checkbox" className="switcher"/>

                <div className="formControl-wrapper">
                  <input type="text" className="input formControl-input" disabled />
                </div>
              </div>
            </div>
          </div>

          <div className="form-row">
            <label className="checkboxControl">
              <input type="checkbox" className="checkbox"/>
              <span className="checkboxControl-text">Main Language</span>
            </label>
          </div>

        </form>
      </div>
      <div className="modal-buttonBox">
        <button
          type="button"
          className="button secondary addProjectLang-cancelButton"
        >
          Close
        </button>
        <button
          type="button"
          className="button primary addProjectLang-addButton"
        >
          Add
        </button>
      </div>
    </Modal>
  )
};