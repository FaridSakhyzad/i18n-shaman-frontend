import React, { useState } from 'react';
import { ILanguage, IDeleteError, IProject } from 'interfaces';

import Modal from 'components/Modal';

import { deleteLanguage, hideAllLanguages, hideLanguage } from 'api/languages';

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

  const handleHideAllClick = async () => {
    setShowLoading(true);

    await hideAllLanguages();

    setShowLoading(false);

    onHideAll();
  };

  const handleHideLangClick = async (e: React.MouseEvent<HTMLButtonElement>, langId: string) => {
    setShowLoading(true);

    await hideLanguage(langId);

    setShowLoading(false);

    onHide(langId);
  };

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>, langId: string) => {
    onEdit(langId);
  };

  const handleDeleteClick = async (e: React.MouseEvent<HTMLButtonElement>, langId: string) => {
    setShowLoading(true);

    const result: IProject | IDeleteError = await deleteLanguage(project.projectId, langId);

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
    <Modal customClassNames="modal_withBottomButtons projectLangsModal">
      {showLoading && (<div className="loading projectLangsModal-loading" />)}

      <div className="modal-header">
        <h4 className="modal-title">Project Languages</h4>
        <button
          type="button"
          className="buttonInline link projectLangs-hideAllButton"
          onClick={handleHideAllClick}
        >
          <i className="projectLangs-hideAllIcon" />
          <i className="projectLangs-hideAllIcon" />
          <i className="projectLangs-hideAllIcon" />
          Hide All
        </button>
      </div>

      <div className="modal-content">
        <div className="projectLangs">
          {languages && languages.map((lang: ILanguage) => (
            <div className="projectLangs-item" key={lang.id}>
              <div className="projectLangs-itemIcon" />
              <div className="projectLangs-itemTitle">
                <span className="projectLangs-itemName">{lang.label}</span>
                <span className="projectLangs-itemCode">{lang.code}</span>
              </div>
              <div className="projectLangs-itemControls">
                <button
                  type="button"
                  className="projectLangs-itemControl projectLangs-itemControl_hide"
                  aria-label="Hide Language"
                  onClick={(e) => handleHideLangClick(e, lang.id)}
                />
                <button
                  type="button"
                  className="projectLangs-itemControl projectLangs-itemControl_edit"
                  aria-label="Edit Language"
                  onClick={(e) => handleEditClick(e, lang.id)}
                />
                <button
                  type="button"
                  className="projectLangs-itemControl projectLangs-itemControl_delete"
                  aria-label="Delete Language"
                  onClick={(e) => handleDeleteClick(e, lang.id)}
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
