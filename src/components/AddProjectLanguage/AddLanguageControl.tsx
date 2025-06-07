import React, { useEffect, useRef, useState } from 'react';
import { ILanguage } from 'interfaces';

interface IProps {
  id?: string;
  selected?: ILanguage[];
  multiple?: boolean;
  classNames?: string;
  fullLanguagesList: ILanguage[];
  chipsSelectable?: boolean;
  onSelectedLanguagesChange?: (languages: ILanguage[]) => void;
  onCurrentLanguageIdxChange?: (index: number) => void;
  onOpen?: (id: string) => void,
  isOpen?: null | boolean,
}

export default function AddLanguageControl({
  id = '',
  selected,
  multiple = true,
  classNames = '',
  fullLanguagesList,
  chipsSelectable = true,
  onSelectedLanguagesChange = () => {},
  onCurrentLanguageIdxChange = () => {},
  onOpen = () => {},
  isOpen = null,
}: IProps) {
  const [selectedLanguages, setSelectedLanguages] = useState<ILanguage[]>(selected as ILanguage[] || []);

  const [languageSearchQuery, setLanguageSearchQuery] = useState<string>('');

  const [languages, setLanguages] = useState<ILanguage[]>([]);

  useEffect(() => {
    setLanguages(fullLanguagesList);
  }, [fullLanguagesList]);

  const [languagesPanelVisible, setLanguagesPanelVisible] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen !== null) {
      setLanguagesPanelVisible(isOpen);
    }

    setSelectedLanguages(selected || []);
  }, [isOpen, selected]);

  const [currentLanguageIdx, setCurrentLanguageIdx] = useState<number>(-1);

  const [searchQueryPrevValue, setSearchQueryPrevValue] = useState<string>('');

  const languageSearchFieldRef = useRef<HTMLInputElement>(null);
  const languageSearchFieldWrapperRef = useRef<HTMLLabelElement>(null);

  const currentLanguage = selectedLanguages[currentLanguageIdx];

  const generateMap = (languagesArray: ILanguage[]) => {
    const result = {} as { [key: string]: number };

    for (let i = 0; i < languagesArray.length; i += 1) {
      const { code } = languagesArray[i];

      result[code] = i;
    }

    return result;
  };

  const languagesMap = generateMap(fullLanguagesList);
  const selectedLanguageMap = generateMap(selectedLanguages);

  const handleLanguagesListWrapperClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (languageSearchFieldRef.current) {
      languageSearchFieldRef.current.focus();
    }

    if (!multiple) {
      setLanguagesPanelVisible(true);
      onOpen(id);
    }
  };

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
    onOpen(id);
  };

  const handleChipClick = (e: React.MouseEvent<HTMLSpanElement>, code: string) => {
    e.preventDefault();
    e.stopPropagation();

    const selectedLanguageIdx = selectedLanguageMap[code];

    setCurrentLanguageIdx(selectedLanguageIdx);
    onCurrentLanguageIdxChange(selectedLanguageIdx);
  };

  const handleLanguageSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setSearchQueryPrevValue(e.currentTarget.value);
  };

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
    onSelectedLanguagesChange([...selectedLanguages]);
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (e.target !== languageSearchFieldRef.current && e.target !== languageSearchFieldWrapperRef.current) {
      setLanguagesPanelVisible(false);
      window.removeEventListener('click', handleOutsideClick);
    }
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

    if (newVisibilityState) {
      onOpen(id);
    }
  };

  const handleLanguagesListBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.relatedTarget) {
      setLanguagesPanelVisible(false);
    }
  };

  const handleLanguagesListItemClick = (e: React.MouseEvent<HTMLUListElement>) => {
    const { target } = e;
    const { id: targetId } = target as HTMLLIElement;

    const langIndex: number = languagesMap[targetId];

    let newSelectedLanguages = [...selectedLanguages];

    if (multiple) {
      newSelectedLanguages.push(fullLanguagesList[langIndex]);
    } else {
      newSelectedLanguages = [fullLanguagesList[langIndex]];
    }

    setSelectedLanguages(newSelectedLanguages);
    onSelectedLanguagesChange(newSelectedLanguages);

    setLanguagesPanelVisible(false);
    setLanguageSearchQuery('');
    setLanguages(fullLanguagesList);

    if (languageSearchFieldRef.current) {
      languageSearchFieldRef.current.focus();
    }
  };

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

    selectedLanguages.splice(indexOfElToDelete, 1);

    setSelectedLanguages([...selectedLanguages]);
    onSelectedLanguagesChange([...selectedLanguages]);
  };

  const theresMatchesToDisplay = () => {
    const allMatchesAreSelected = languages.every((language) => selectedLanguageMap[language.code] !== undefined);

    return languages.length > 0 && !allMatchesAreSelected;
  };

  return (
    <div className={`languagesSelector ${classNames}`}>
      <label
        ref={languageSearchFieldWrapperRef}
        className="select languagesSelector-chipBox"
        onClick={handleLanguagesListWrapperClick}
      >
        {selectedLanguages.length > 0 && selectedLanguages.map(({ code, label }: ILanguage) => (
          <span // eslint-disable-line jsx-a11y/no-static-element-interactions
            className={`languagesSelector-chip ${chipsSelectable ? 'isSelectable' : ''} ${currentLanguage && currentLanguage.code === code ? 'isActive' : ''}`}
            key={code}
            onClick={chipsSelectable ? (e) => handleChipClick(e, code) : () => {}}
          >
            {label}
            {multiple && (
              <i // eslint-disable-line jsx-a11y/no-static-element-interactions
                className="languagesSelector-chipDelete"
                onClick={(e) => handleChipDelete(e, code)}
              />
            )}
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
              {languages.map(({ code, label }: ILanguage) => {
                if (selectedLanguageMap[code] !== undefined) {
                  return null;
                }

                return (
                  <li
                    className={`languagesSelector-listItem ${selectedLanguageMap[code] !== undefined ? 'selected' : ''}`}
                    key={code}
                    id={code}
                  >
                    {label} ({code})
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="languagesSelector-noMatches">No Matches Found</div>
          )}
        </div>
      )}
    </div>
  );
}
