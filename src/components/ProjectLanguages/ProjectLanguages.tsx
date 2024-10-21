import React, { useState } from 'react';
import { ILanguage, IProjectUpdateError, IProject } from 'interfaces';

import Modal from 'components/Modal';

import {
  setMultipleLanguagesVisibility,
  setLanguageVisibility,
  deleteLanguage,
} from 'api/languages';

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
  const [showLoading, setShowLoading] = useState<boolean>(false);

  const toggleAllVisibilityClick = async (allVisible: boolean) => {
    setShowLoading(true);

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

    setShowLoading(false);

    onHideAll();
  };

  const handleHideLangClick = async (e: React.MouseEvent<HTMLButtonElement>, langId: string) => {
    setShowLoading(true);

    const result: IProject | IProjectUpdateError = await setLanguageVisibility(project.projectId, langId, false);

    if ('error' in result) {
      console.error(result.message);
    } else {
      setLanguages(result.languages);
    }

    setShowLoading(false);

    onHide(langId);
  };

  const handleShowLangClick = async (e: React.MouseEvent<HTMLButtonElement>, langId: string) => {
    setShowLoading(true);

    const result: IProject | IProjectUpdateError = await setLanguageVisibility(project.projectId, langId, true);

    if ('error' in result) {
      console.error(result.message);
    } else {
      setLanguages(result.languages);
    }

    setShowLoading(false);

    onHide(langId);
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>, langId: string) => {
    onEdit(langId);
  };

  const handleDeleteClick = async (e: React.MouseEvent<HTMLButtonElement>, langId: string) => {
    setShowLoading(true);

    const result: IProject | IProjectUpdateError = await deleteLanguage(project.projectId, langId);

    if ('error' in result) {
      console.error(result.message);
    } else {
      setLanguages(result.languages);
    }

    setShowLoading(false);

    onDelete(langId);
  };

  const handleCloseClick = () => {
    onClose();
  };

  return (
    <Modal
      customClassNames="modal_withBottomButtons projectLangsModal"
      onEscapeKeyPress={onClose}
    >
      {showLoading && (<div className="loading projectLangsModal-loading" />)}

      <div className="modal-header">
        <h4 className="modal-title">Project Languages</h4>
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
        </div>
      </div>
      <div className="modal-buttonBox">
        <button
          type="button"
          className="button success projectLangs-quickAddButton"
        >
          Quick Add Language
        </button>
        <button
          type="button"
          className="button secondary projectLangs-closeButton"
          onClick={handleCloseClick}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
