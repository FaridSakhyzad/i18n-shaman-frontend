import React, { useState } from 'react';

import Modal from 'components/Modal';
import { IProject } from 'interfaces';
import { exportProjectToJson } from 'api/projects';

import './ExportProject.scss';

interface IProps {
  project: IProject | null;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ExportProject(props: IProps) {
  const {
    project,
    onClose,
    onCancel,
    onConfirm,
  } = props;

  const { projectId = '', projectName } = project || {};

  const [loading, setLoading] = useState(false);

  const handleCloseButtonClick = () => {
    onClose();
  };

  const handleCancelButtonClick = () => {
    onCancel();
  };

  const handleExportButtonClick = async () => {
    setLoading(true);

    if (!project) {
      return;
    }

    const response = await exportProjectToJson(projectId as string);

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const $link = document.createElement('a');
    $link.href = url;
    $link.download = `${projectName}.zip`;

    document.body.appendChild($link);

    $link.click();
    $link.remove();

    window.URL.revokeObjectURL(url);

    setLoading(false);
    onConfirm();
  };

  return (
    <Modal
      customClassNames="modal_withBottomButtons modal_export"
      onEscapeKeyPress={onClose}
    >
      {loading && (
        <div className="loading modal-loading" />
      )}

      <div className="modal-header">
        <h4 className="modal-title">Export Project</h4>
        <button
          type="button"
          className="modal-closeButton"
          onClick={handleCloseButtonClick}
          aria-label="Close modal"
        />
      </div>

      <div className="modal-buttonBox">
        <button
          type="button"
          className="button secondary"
          onClick={handleCancelButtonClick}
        >
          Close
        </button>
        <button
          type="button"
          className="button primary"
          onClick={handleExportButtonClick}
        >
          Export
        </button>
      </div>
    </Modal>
  );
}
