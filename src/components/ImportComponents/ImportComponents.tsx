import React, { useState } from 'react';
import Modal from 'components/Modal';
import { IProject, IProjectLanguage, IUserLanguagesMapItem } from 'interfaces';

import 'components/ImportLocales/ImportLocales.scss';
import './ImportComponents.scss';
import { importComponentsToProject } from '../../api/projects';

interface IProps {
  project: IProject | null;
  onClose: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}

interface IFileListItem {
  name: string;
  format: string;
  language: string;
  code: string;
}

const ITEMS_PER_ROW = 5;

export default function ImportComponents(props: IProps) {
  const {
    project,
    onClose,
    onCancel,
    onConfirm,
  } = props;

  const [loading, setLoading] = useState(true);

  const [selectedTargetLanguageCode, setSelectedTargetLanguageCode] = useState<string>(project?.languages[0].code || '');

  const [formDataInState, setFormDataInState] = useState(new FormData());

  const [filesList, setFilesList] = useState<IFileListItem[]>([]);

  const generateLanguagesMap = (languagesData: IProjectLanguage[]) => {
    const result:IUserLanguagesMapItem = {};

    languagesData.forEach((language: IProjectLanguage) => {
      result[language.code] = language;
    });

    return result;
  };

  const languagesMap:IUserLanguagesMapItem = generateLanguagesMap(project?.languages || []);

  const handleUploadFileChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    if (!project) {
      return;
    }

    const { files }: { files: FileList | null } = target;

    if (!files) {
      return;
    }

    formDataInState.set('projectId', project.projectId as string);

    const newFilesList = [...filesList];

    for (let i = 0; i < files.length; i += 1) {
      const { name, type } = files[i];

      formDataInState.append('files', files[i]);

      const format = type.split('/')[1];

      const nameWOExtension = name.replace(`.${format}`, '');

      const languageData = languagesMap[selectedTargetLanguageCode];

      const metaData = {
        name: nameWOExtension,
        format,
        language: languageData.label,
        code: languageData.code,
        languageId: languageData.id,
      };

      formDataInState.append('metaData', JSON.stringify(metaData));

      newFilesList.push(metaData);
    }

    setFilesList(newFilesList);
  };

  const handleCloseButtonClick = () => {
    onClose();
  };

  const handleCancelButtonClick = () => {
    onCancel();
  };

  const handleImportButtonClick = async () => {
    setLoading(true);

    const result = await importComponentsToProject(formDataInState);

    setLoading(false);

    onConfirm();
  };

  const getLanguageSelectorItems = () => {
    if (!project) {
      return null;
    }

    const items: any[] = [];

    const { languages } = project;

    let itemsGroupIdx = 0;

    languages.forEach((language, idx) => {
      if (idx > 0 && idx % ITEMS_PER_ROW === 0) {
        itemsGroupIdx += 1;
      }

      if (!items[itemsGroupIdx]) {
        items[itemsGroupIdx] = [];
      }

      items[itemsGroupIdx].push(language);
    });

    if (items.length > ITEMS_PER_ROW) {
      const lastLineItemsToAdd = ITEMS_PER_ROW - items[items.length - 1].length;

      const itemsToAdd = (new Array(lastLineItemsToAdd)).fill({ id: 'dummy' });

      items[items.length - 1] = items[items.length - 1].concat(itemsToAdd);
    }

    return items;
  };

  const targetLanguages = getLanguageSelectorItems();

  const handleTargetLanguageClick = (languageCode: string) => {
    setSelectedTargetLanguageCode(languageCode);
  };

  const handleFileDeleteClick = (idx: number) => {
    const newFilesList = [...filesList];

    newFilesList.splice(idx, 1)

    setFilesList(newFilesList);

    if (!project) {
      return;
    }

    const newFormData = new FormData();

    newFormData.set('projectId', project.projectId as string);

    for (let i = 0; i < formDataInState.getAll('files').length; i++) {
      const file = formDataInState.getAll('files')[i];
      const metaData = formDataInState.getAll('metaData')[i];

      if (i !== idx) {
        newFormData.append('files', file);
        newFormData.append('metaData', metaData);
      }
    }

    setFormDataInState(newFormData);
  };

  return (
    <Modal
      customClassNames="modal_withBottomButtons modal_import"
      onEscapeKeyPress={onClose}
    >
      <div className="modal-header">
        <h4 className="modal-title">Import Component Files to project</h4>
        <button
          type="button"
          className="modal-closeButton"
          onClick={handleCloseButtonClick}
          aria-label="Close modal"
        />
      </div>

      <div className="modal-content">
        <table className="targetLanguageSelector">
          <tbody>
            {targetLanguages && targetLanguages.map((
              (languagesRow, idx) => (
                // eslint-disable-next-line react/no-array-index-key
                <tr className="targetLanguageSelector-row" key={idx}>
                  {languagesRow.map((language: IProjectLanguage, cellIdx: number) => {
                    if (language.id === 'dummy') {
                      return (
                        // eslint-disable-next-line react/no-array-index-key
                        <td className="targetLanguageSelector-cell" key={`dummy-${cellIdx}`}>
                          <span className="targetLanguageSelector-item targetLanguageSelector-item_dummy" />
                        </td>
                      );
                    }

                    return (
                      <td className="targetLanguageSelector-cell" key={language.id}>
                        <span
                          className={`targetLanguageSelector-item ${language.code === selectedTargetLanguageCode ? 'isActive' : ''}`}
                          onClick={() => handleTargetLanguageClick(language.code)}
                        >
                          {language.label}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              )
            ))}
          </tbody>
        </table>

        {filesList.length > 0 && (
          <h4 className="h4">Component Files For {languagesMap[selectedTargetLanguageCode].label} language</h4>
        )}

        <div className="importedFilesList">
          {filesList.map((file: IFileListItem, idx: number) => {
            if (file.code !== selectedTargetLanguageCode) {
              return null;
            }

            return (
              <div
                key={`${file.code}-${file.format}-${idx}`} // eslint-disable-line react/no-array-index-key
                className="importedFilesList-item"
              >
                <div className="importedFilesList-itemName">{file.name}</div>
                <i
                  className="importedFilesList-itemDelete"
                  onClick={() => handleFileDeleteClick(idx)}
                />
              </div>
            );
          })}
        </div>

        <span className="button success importedFilesList-upload">
          {languagesMap[selectedTargetLanguageCode] && (
            <>Open Files for {languagesMap[selectedTargetLanguageCode].label} language</>
          )}
          <input
            type="file"
            onChange={handleUploadFileChange}
            accept="application/json"
            multiple
            className="buttonUploadInput"
          />
        </span>
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
          onClick={handleImportButtonClick}
        >
          Import
        </button>
      </div>
    </Modal>
  );
}