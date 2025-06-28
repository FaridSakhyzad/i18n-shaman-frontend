import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import ImportLocales from 'components/ImportLocales';
import ImportComponents from 'components/ImportComponents';
import { IProject } from 'interfaces';
import ExportProject from 'components/ExportProject/ExportProject';

interface IProps {
  project: IProject | null;
}

export default function EditorHeader(props: IProps) {
  const { project } = props;

  const { projectId = '' } = project || {};

  const [isImportLocalesModalVisible, setImportLocalesModalVisible] = useState<boolean>(false);
  const [isImportComponentsModalVisible, setImportComponentsModalVisible] = useState<boolean>(false);
  const [isExportProjectModalVisible, setIsExportProjectModalVisible] = useState<boolean>(false);

  const handleImportLocalesClick = () => {
    setImportLocalesModalVisible(true);
  };

  const handleImportComponentsClick = () => {
    setImportComponentsModalVisible(true);
  };

  const handleExportClick = async () => {
    setIsExportProjectModalVisible(true);
  };

  return (
    <>
      {isImportLocalesModalVisible && (
        <ImportLocales
          projectId={projectId}
          onClose={() => setImportLocalesModalVisible(false)}
          onCancel={() => setImportLocalesModalVisible(false)}
          onConfirm={() => setImportLocalesModalVisible(false)}
        />
      )}

      {isImportComponentsModalVisible && (
        <ImportComponents
          onClose={() => setImportComponentsModalVisible(false)}
          onCancel={() => setImportComponentsModalVisible(false)}
          onConfirm={() => setImportComponentsModalVisible(false)}
          project={project}
        />
      )}

      {isExportProjectModalVisible && (
        <ExportProject
          onClose={() => setIsExportProjectModalVisible(false)}
          onCancel={() => setIsExportProjectModalVisible(false)}
          onConfirm={() => setIsExportProjectModalVisible(false)}
          project={project}
        />
      )}

      <div className="header">
        <ul className="headerMenu">
          <li className="headerMenu-item">
            <Link className="button ghost headerMenu-link" to="/projects">Projects</Link>
          </li>
          <li className="headerMenu-item">
            <button
              type="button"
              className="button ghost headerMenu-link"
              onClick={handleImportLocalesClick}
            >
              Import Locales
            </button>
          </li>
          <li className="headerMenu-item">
            <button
              type="button"
              className="button ghost headerMenu-link"
              onClick={handleImportComponentsClick}
            >
              Import Components
            </button>
          </li>
          <li className="headerMenu-item">
            <button
              type="button"
              className="button ghost headerMenu-link"
              onClick={handleExportClick}
            >
              Export
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
