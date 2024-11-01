import React, { useState } from 'react';
import {
  ILanguage,
  IProjectUpdateError,
  IProject,
  IUserLanguagesMapItem,
} from 'interfaces';

import {
  setMultipleLanguagesVisibility,
  setLanguageVisibility,
  deleteLanguage, addMultipleLanguages,
} from 'api/languages';

import Modal from 'components/Modal';
import AddLanguageControl from 'components/AddProjectLanguage/AddLanguageControl';
import getLanguages from 'components/AddProjectLanguage/languages';

import './ProjectLanguages.scss';

interface IProps {
  project: any;
  onClose: () => void;
  onHideAll: () => void;
  onHide: (langId: string) => void;
  onEdit: (langId: string) => void;
  onDelete: (langId: string) => void;
}

export default function ProjectLanguages({
  project,
  onHideAll,
  onHide,
  onEdit,
  onDelete,
  onClose,
}: IProps) {
  const [languages, setLanguages] = useState(project.languages);

  const getAvailableLanguages = (projectLanguages: ILanguage[]) => {
    const languagesMap:IUserLanguagesMapItem = {};

    projectLanguages.forEach((language: ILanguage) => {
      languagesMap[language.code] = language;
    });

    return getLanguages().filter(({ code }: ILanguage) => {
      return languagesMap[code] === undefined;
    });
  };

  const [fullLanguagesList, setFullLanguagesList] = useState<ILanguage[]>(getAvailableLanguages(project.languages));

  const [loading, setLoading] = useState<boolean>(false);

  const toggleAllVisibilityClick = async (allVisible: boolean) => {
    setLoading(true);

    const visibilityData = project.languages.map(({ id }: ILanguage) => ({
      languageId: id,
      visible: allVisible,
    }));

    const result: IProject | IProjectUpdateError = await setMultipleLanguagesVisibility(project.projectId, visibilityData);

    if ('error' in result) {
      console.error(result.message);
    } else {
      setLanguages(result.languages);
    }

    setLoading(false);

    onHideAll();
  };

  const handleHideLangClick = async (e: React.MouseEvent<HTMLButtonElement>, langId: string) => {
    setLoading(true);

    const result: IProject | IProjectUpdateError = await setLanguageVisibility(project.projectId, langId, false);

    if ('error' in result) {
      console.error(result.message);
    } else {
      setLanguages(result.languages);
    }

    setLoading(false);

    onHide(langId);
  };

  const handleShowLangClick = async (e: React.MouseEvent<HTMLButtonElement>, langId: string) => {
    setLoading(true);

    const result: IProject | IProjectUpdateError = await setLanguageVisibility(project.projectId, langId, true);

    if ('error' in result) {
      console.error(result.message);
    } else {
      setLanguages(result.languages);
    }

    setLoading(false);

    onHide(langId);
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>, langId: string) => {
    onEdit(langId);
  };

  const handleDeleteClick = async (e: React.MouseEvent<HTMLButtonElement>, langId: string) => {
    setLoading(true);

    const result: IProject | IProjectUpdateError = await deleteLanguage(project.projectId, langId);

    if ('error' in result) {
      console.error(result.message);
    } else {
      setLanguages(result.languages);

      const availableLanguages = getAvailableLanguages(result.languages);

      setFullLanguagesList(availableLanguages);
    }

    setLoading(false);

    onDelete(langId);
  };

  const [isQuickAddVisible, setIsQuickAddVisible] = useState(false);

  const handleQuickAddClick = () => {
    setIsQuickAddVisible(!isQuickAddVisible);
  };

  const [selectedLanguages, setSelectedLanguages] = useState<ILanguage[]>([]);

  const handleQuickAddSaveClick = async () => {
    setIsQuickAddVisible(true);
    setLoading(true);

    const languagesData: ILanguage[] = selectedLanguages.map((language: ILanguage) => {
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

    const resultProject = await addMultipleLanguages({
      languages: languagesData,
      projectId: project.projectId,
    });

    setIsQuickAddVisible(false);

    setFullLanguagesList(getAvailableLanguages(resultProject.languages));

    setLanguages(resultProject.languages);

    setLoading(false);
  };

  const handleSelectedLanguagesChange = (data: ILanguage[]) => {
    setSelectedLanguages(data);
  };

  const handleCloseButtonClick = () => {
    onClose();
  };

  return (
    <Modal
      customClassNames="modal_withBottomButtons projectLangsModal"
      onEscapeKeyPress={onClose}
    >
      {loading && (<div className="loading projectLangsModal-loading" />)}

      <div className="modal-header">
        <h4 className="modal-title">Project Languages</h4>

        <button
          type="button"
          className="modal-closeButton"
          onClick={handleCloseButtonClick}
          aria-label="Close modal"
        />
      </div>

      <div className="modal-content">
        <div className="projectLangs">
          {languages && languages.map(({
            id,
            label,
            code,
            visible,
          }: ILanguage) => (
            <div className={`projectLangs-item ${visible ? '' : 'isHidden'}`} key={id}>
              <div className="projectLangs-itemIcon" />
              <div className="projectLangs-itemTitle">
                <span className="projectLangs-itemName">{label}</span>
                <span className="projectLangs-itemCode">{code}</span>
              </div>
              <div className="projectLangs-itemControls">
                {visible ? (
                  <button
                    type="button"
                    className="projectLangs-itemControl projectLangs-itemControl_hide"
                    aria-label="Hide Language"
                    onClick={(e) => handleHideLangClick(e, id)}
                  />
                ) : (
                  <button
                    type="button"
                    className="projectLangs-itemControl projectLangs-itemControl_show"
                    aria-label="Hide Language"
                    onClick={(e) => handleShowLangClick(e, id)}
                  />
                )}
                <button
                  type="button"
                  className="projectLangs-itemControl projectLangs-itemControl_edit"
                  aria-label="Edit Language"
                  onClick={(e) => handleEditClick(e, id)}
                />
                <button
                  type="button"
                  className="projectLangs-itemControl projectLangs-itemControl_delete"
                  aria-label="Delete Language"
                  onClick={(e) => handleDeleteClick(e, id)}
                />
              </div>
            </div>
          ))}
          {(isQuickAddVisible && fullLanguagesList.length > 0) && (
            <div className="projectLangs-quickControl">
              <AddLanguageControl
                fullLanguagesList={fullLanguagesList}
                chipsSelectable={false}
                onSelectedLanguagesChange={handleSelectedLanguagesChange}
              />
              <button type="button" className="button primary projectLangs-quickAddSave" onClick={handleQuickAddSaveClick} aria-label="Save Language" />
            </div>
          )}
        </div>
      </div>
      <div className="modal-buttonBox">
        <button
          type="button"
          className="button success projectLangs-quickAddButton"
          onClick={handleQuickAddClick}
        >
          Quick Add Language
        </button>

        <button
          type="button"
          className="buttonInline link projectLangs-showAllButton"
          onClick={() => toggleAllVisibilityClick(true)}
        >
          <i className="projectLangs-hideAllIcon" />
          <i className="projectLangs-hideAllIcon" />
          <i className="projectLangs-hideAllIcon" />
          Show All
        </button>

        <button
          type="button"
          className="buttonInline link projectLangs-hideAllButton"
          onClick={() => toggleAllVisibilityClick(false)}
        >
          <i className="projectLangs-hideAllIcon" />
          <i className="projectLangs-hideAllIcon" />
          <i className="projectLangs-hideAllIcon" />
          Hide All
        </button>
      </div>
    </Modal>
  );
}
