import React, { useEffect, useState, useRef } from 'react';
import Modal from 'components/Modal';

import './AddProjectLanguage.scss';
import getLanguages from './languages';

import { ILanguage } from 'interfaces';
import { addMultipleLanguages } from '../../api/languages';

interface IProps {
  projectId: string;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function AddProjectLanguage({ projectId, onClose, onCancel, onConfirm }: IProps) {
  const fullLanguagesList = getLanguages();

  const [ loading, setLoading ] = useState<boolean>(false);
  const [ languages, setLanguages ] = useState(getLanguages());
  const [ selectedLanguages, setSelectedLanguages ] = useState<ILanguage[]>([]);
  const [ languagesPanelVisible, setLanguagesPanelVisible ] = useState<boolean>(false);
  const [ languageSearchQuery, setLanguageSearchQuery ] = useState('');
  const [ searchQueryPrevValue, setSearchQueryPrevValue ] = useState('');

  const generateMap = (languagesArray: ILanguage[]) => {
    const result = {} as { [key: string]: number };

    for (let i = 0; i < languagesArray.length; i++) {
      const { code } = languagesArray[i];

      result[code] = i;
    }

    return result;
  };

  const languagesMap = generateMap(languages);
  const selectedLanguageMap = generateMap(selectedLanguages);

  const languageSearchFieldRef = useRef<HTMLInputElement>(null);
  const languageSearchFieldWrapperRef = useRef<HTMLLabelElement>(null);

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
  };

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

    if ((selectedLanguages.length - 1) === currentLanguageIdx) {
      setCurrentLanguageIdx(-1);
    }

    setCurrentLanguageIdx(-1);

    selectedLanguages.pop();
    setSelectedLanguages([...selectedLanguages]);
  }

  const handleLanguagesListItemClick = (e: React.MouseEvent<HTMLUListElement>) => {
    const { target } = e;
    const { id } = target as HTMLLIElement;

    const langIndex: number = languagesMap[id];

    selectedLanguages.push(languages[langIndex])

    setSelectedLanguages([...selectedLanguages]);

    setLanguagesPanelVisible(false);
    setLanguageSearchQuery('');
    setLanguages(fullLanguagesList);

    languageSearchFieldRef.current && languageSearchFieldRef.current.focus();
  }

  const [ currentLanguageIdx, setCurrentLanguageIdx] = useState<number>(-1);

  const currentLanguage = selectedLanguages[currentLanguageIdx];

  const handleChipClick = (e: React.MouseEvent<HTMLSpanElement>, code: string) => {
    e.preventDefault();
    e.stopPropagation();

    const selectedLanguageIdx = selectedLanguageMap[code];

    setCurrentLanguageIdx(selectedLanguageIdx);
  }

  const handleChipDelete = (e: React.MouseEvent<HTMLElement>, code: string) => {
    e.preventDefault();
    e.stopPropagation();

    const indexOfElToDelete = selectedLanguages.findIndex((item) => item.code === code);

    if (indexOfElToDelete < 0) {
      return;
    }

    if (indexOfElToDelete === currentLanguageIdx) {
      setCurrentLanguageIdx(-1);
    }

    const result = selectedLanguages.splice(indexOfElToDelete, 1);

    setSelectedLanguages([...selectedLanguages]);
  }

  const theresMatchesToDisplay = () => {
    const allMatchesAreSelected = languages.every((language) => {
      return selectedLanguageMap[language.code] !== undefined;
    })

    return languages.length > 0 && !allMatchesAreSelected;
  }

  const handleCustomCodeSwitcherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedLanguages || !selectedLanguages[currentLanguageIdx]) {
      return;
    }

    selectedLanguages[currentLanguageIdx].customCodeEnabled = e.currentTarget.checked;

    setSelectedLanguages([...selectedLanguages]);
  }

  const handleCustomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    selectedLanguages[currentLanguageIdx].customCode = e.currentTarget.value;

    setSelectedLanguages([...selectedLanguages]);
  }

  const handleCustomLabelSwitcherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedLanguages || !selectedLanguages[currentLanguageIdx]) {
      return;
    }

    selectedLanguages[currentLanguageIdx].customLabelEnabled = e.currentTarget.checked;

    setSelectedLanguages([...selectedLanguages]);
  }

  const handleCustomLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    selectedLanguages[currentLanguageIdx].customLabel = e.currentTarget.value;

    setSelectedLanguages([...selectedLanguages]);
  }

  const handleBaseLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    selectedLanguages[currentLanguageIdx].baseLanguage = e.currentTarget.checked;

    setSelectedLanguages([...selectedLanguages]);
  }

  const handleCloseButtonClick = () => {
    onCancel();
  }

  const handleAddButtonClick = async () => {
    setLoading(true);

    const result = await addMultipleLanguages({
      languages: selectedLanguages,
      projectId
    });

    setLoading(false);

    onConfirm();
  }

  return (
    <Modal customClassNames="modal_withBottomButtons modal_addProjectLang">
      {loading && (
        <div className="addProjectLang-loading"/>
      )}
      <div className="modal-header">
      <h4 className="modal-title">Add New Language</h4>
        <button
          type="button"
          className="modal-closeButton"
          onClick={handleCloseButtonClick}
          aria-label="Close modal"
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
                      className={`languagesSelector-chip ${currentLanguage && currentLanguage.code === code ? 'isActive' : ''}`}
                      key={code}
                      onClick={(e) => handleChipClick(e, code)}
                    >
                        {label}
                      <i
                        className="languagesSelector-chipDelete"
                        onClick={(e) => handleChipDelete(e, code)}
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

          <div className={`languagesOptionsBox ${selectedLanguages[currentLanguageIdx] ? 'isActive' : ''}`}>
            {selectedLanguages[currentLanguageIdx] && (
              <section key={currentLanguageIdx} className="form languagesOptions">
                <div className="row">
                  <h3 className="h3">Options
                    for <b>{selectedLanguages[currentLanguageIdx].label} ({selectedLanguages[currentLanguageIdx].code})</b></h3>
                </div>
                <div className="form-row">
                  <div className="formControl">
                    <div className="formControl-header">
                      <label className="formControl-label" htmlFor="custom_code">
                        Custom language code <i className="formControl-infoIcon" />
                      </label>
                    </div>
                    <div className="formControl-body addProjectLang-switchableControl">
                      <input
                        type="checkbox"
                        className="switcher"
                        onChange={handleCustomCodeSwitcherChange}
                        disabled={!selectedLanguages[currentLanguageIdx]}
                        checked={selectedLanguages[currentLanguageIdx] && selectedLanguages[currentLanguageIdx].customCodeEnabled}
                      />

                      <div className="formControl-wrapper">
                        <input
                          type="text"
                          id="custom_code"
                          className="input formControl-input"
                          disabled={!selectedLanguages[currentLanguageIdx] || !selectedLanguages[currentLanguageIdx].customCodeEnabled}
                          value={selectedLanguages[currentLanguageIdx] ? (selectedLanguages[currentLanguageIdx].customCode || selectedLanguages[currentLanguageIdx].code) : ''}
                          onChange={handleCustomCodeChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="formControl">
                    <div className="formControl-header">
                      <label className="formControl-label" htmlFor="custom_language">
                        Custom language name <i className="formControl-infoIcon" />
                      </label>
                    </div>
                    <div className="formControl-body addProjectLang-switchableControl">
                      <input
                        type="checkbox"
                        className="switcher"
                        onChange={handleCustomLabelSwitcherChange}
                        disabled={!selectedLanguages[currentLanguageIdx]}
                        checked={selectedLanguages[currentLanguageIdx] && selectedLanguages[currentLanguageIdx].customLabelEnabled}
                      />

                      <div className="formControl-wrapper">
                        <input
                          type="text"
                          id="custom_language"
                          className="input formControl-input"
                          disabled={!selectedLanguages[currentLanguageIdx] || !selectedLanguages[currentLanguageIdx].customLabelEnabled}
                          value={selectedLanguages[currentLanguageIdx] ? (selectedLanguages[currentLanguageIdx].customLabel || selectedLanguages[currentLanguageIdx].label) : ''}
                          onChange={handleCustomLabelChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <label className="checkboxControl">
                    <input
                      type="checkbox"
                      className="checkbox"
                      disabled={!selectedLanguages[currentLanguageIdx]}
                      checked={selectedLanguages[currentLanguageIdx] && selectedLanguages[currentLanguageIdx].baseLanguage}
                      onChange={handleBaseLanguageChange}
                    />
                    <span className="checkboxControl-text">Main Language</span>
                    <i className="formControl-infoIcon" />
                  </label>
                </div>
              </section>
            )}
          </div>
        </form>
      </div>
      <div className="modal-buttonBox">
        <button
          type="button"
          className="button secondary addProjectLang-cancelButton"
          onClick={handleCloseButtonClick}
        >
          Close
        </button>
        <button
          type="button"
          className="button primary addProjectLang-addButton"
          onClick={handleAddButtonClick}
          disabled={selectedLanguages.length === 0}
        >
          Add
        </button>
      </div>
    </Modal>
  )
};