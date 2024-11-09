import React, { useState, useEffect } from 'react';
import Modal from 'components/Modal';

import { ILanguage, IProjectLanguage, IUserLanguagesMapItem } from 'interfaces';
import { addMultipleLanguages, getAppLanguagesData } from 'api/languages';
import { getUserProjectsById } from 'api/projects';

import './AddProjectLanguage.scss';
import AddLanguageControl from './AddLanguageControl';

interface IProps {
  projectId: string;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function AddProjectLanguage({
  projectId,
  onClose,
  onCancel,
  onConfirm,
}: IProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [fullLanguagesList, setFullLanguagesList] = useState<IProjectLanguage[]>([]);

  const [selectedLanguages, setSelectedLanguages] = useState<IProjectLanguage[]>([]);

  const getProjectLanguages = async () => {
    const result = await getUserProjectsById(projectId);

    const languages = await getAppLanguagesData();

    const languagesMap:IUserLanguagesMapItem = {};

    if (result.error) {
      alert(result.message);
    } else {
      result.languages.forEach((language: IProjectLanguage) => {
        languagesMap[language.code] = language;
      });

      const availableLanguages = languages.filter(({ code }: IProjectLanguage) => {
        return languagesMap[code] === undefined;
      });

      setFullLanguagesList(availableLanguages);
    }

    setLoading(false);
  };

  useEffect(() => {
    getProjectLanguages();
  }, [projectId]);

  const [currentLanguageIdx, setCurrentLanguageIdx] = useState<number>(-1);

  const handleCustomCodeSwitcherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedLanguages || !selectedLanguages[currentLanguageIdx]) {
      return;
    }

    selectedLanguages[currentLanguageIdx].customCodeEnabled = e.currentTarget.checked;

    setSelectedLanguages([...selectedLanguages]);
  };

  const handleCustomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    selectedLanguages[currentLanguageIdx].customCode = e.currentTarget.value;

    setSelectedLanguages([...selectedLanguages]);
  };

  const handleCustomLabelSwitcherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedLanguages || !selectedLanguages[currentLanguageIdx]) {
      return;
    }

    selectedLanguages[currentLanguageIdx].customLabelEnabled = e.currentTarget.checked;

    setSelectedLanguages([...selectedLanguages]);
  };

  const handleCustomLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    selectedLanguages[currentLanguageIdx].customLabel = e.currentTarget.value;

    setSelectedLanguages([...selectedLanguages]);
  };

  const handleBaseLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    selectedLanguages[currentLanguageIdx].baseLanguage = e.currentTarget.checked;

    setSelectedLanguages([...selectedLanguages]);
  };

  const handleCancelButtonClick = () => {
    onCancel();
  };

  const handleCloseButtonClick = () => {
    onClose();
  };

  const handleAddButtonClick = async () => {
    setLoading(true);

    const languagesData: IProjectLanguage[] = selectedLanguages.map((language: IProjectLanguage) => {
      const languageData = {
        ...language,
      };

      if (language.customLabelEnabled && !language.customLabel) {
        languageData.customLabel = language.label;
      }

      if (language.customCodeEnabled && !language.customCode) {
        languageData.customCode = language.code;
      }

      return languageData;
    });

    await addMultipleLanguages({
      languages: languagesData,
      projectId,
    });

    setLoading(false);

    onConfirm();
  };

  const handleSelectedLanguagesChange = (data: ILanguage[]) => {
    setSelectedLanguages(data.map((item) => ({
      baseLanguage: false,
      visible: true,
      customLabelEnabled: false,
      customLabel: '',
      customCodeEnabled: false,
      customCode: '',
      ...item
    })));
  };

  const handleCurrentLanguageIdxChange = (index: number) => {
    setCurrentLanguageIdx(index);
  };

  return (
    <Modal
      customClassNames="modal_withBottomButtons modal_addProjectLang"
      onEscapeKeyPress={onClose}
    >
      {loading && (
        <div className="addProjectLang-loading" />
      )}
      <div className="modal-header">
        <h4 className="modal-title">Add New Languages</h4>
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
              {fullLanguagesList.length > 0 && (
                <AddLanguageControl
                  fullLanguagesList={fullLanguagesList}
                  onSelectedLanguagesChange={handleSelectedLanguagesChange}
                  onCurrentLanguageIdxChange={handleCurrentLanguageIdxChange}
                />
              )}
            </div>
          </div>

          <div className={`languagesOptionsBox ${selectedLanguages[currentLanguageIdx] ? 'isActive' : ''}`}>
            {selectedLanguages[currentLanguageIdx] && (
              <section key={currentLanguageIdx} className="form languagesOptions">
                <div className="row">
                  <h3 className="h3">
                    Options for <b>{selectedLanguages[currentLanguageIdx].label} ({selectedLanguages[currentLanguageIdx].code})</b>
                  </h3>
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
          onClick={handleCancelButtonClick}
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
  );
}
