import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { IRootState } from 'store';

import Modal from 'components/Modal';
import {
  IKey,
  IKeyUpdateError,
  IKeyValue,
  IProject,
} from 'interfaces';

import { validateKeyName, validationErrors } from '../../utils/Validators';
import { updateKey } from '../../api/projects';

interface IProps {
  projectKey: IKey;
  project: IProject;
  onClose: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function EditKey({
  projectKey,
  project,
  onClose,
  onCancel,
  onSave,
}: IProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const [key, setKey] = useState<IKey>(projectKey);

  const [keyValues, setValues] = useState<{ [key: string]: IKeyValue }>(project.values ? project.values[projectKey.id] : {});

  const { id: userId } = useSelector((state: IRootState) => state.user);

  const getInitialSelectedLanguageId = () => {
    if (!project) {
      return '';
    }

    const firstLang = project.languages[0];

    return firstLang.id;
  };

  const [selectedLanguageId, setSelectedLanguageId] = useState<string>(getInitialSelectedLanguageId());

  const [keyNameError, setKeyNameError] = useState<string | null>('');

  const handleNameChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setKeyNameError(null);

    const validationResult = validateKeyName(value, key.id, project.keys);

    if (validationResult.error) {
      setKeyNameError(validationErrors[validationResult.error]);
    }

    setKey({
      ...key,
      label: value,
    });
  };

  const handleSelectedLanguageChange = ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguageId(value);
  };

  const handleValueChange = ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (keyValues[selectedLanguageId]) {
      keyValues[selectedLanguageId].value = value;
    } else {
      keyValues[selectedLanguageId] = {
        languageId: selectedLanguageId,
        keyId: key.id,
        projectId: project.projectId,
        parentId: project.projectId,
        value,
      };
    }

    setValues(structuredClone(keyValues));
  };

  const handleDescriptionChange = ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
    setKey({
      ...key,
      description: value,
    });
  };

  const handleCloseButtonClick = () => {
    onClose();
  };

  const handleCancelClick = () => {
    onCancel();
  };

  const handleSaveClick = async () => {
    setLoading(true);

    const keyValuesPrepared = Object.entries(keyValues).map(([_key, keyValue]) => keyValue);

    const result: IKey | IKeyUpdateError = await updateKey({
      ...key,
      parentId: project.projectId,
      userId: userId as string,
      values: keyValuesPrepared,
    });

    if ('error' in result) {
      alert(result.message);
    }

    setLoading(false);

    onSave();
  };

  return (
    <Modal
      onEscapeKeyPress={onClose}
      customClassNames="modal_withBottomButtons modal_editProjectLang"
    >
      {loading && (
        <div className="loading modal-loading" />
      )}

      <div className="modal-header">
        <h4 className="modal-title">Edit Key {projectKey.label}</h4>
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
              <div className="formControl-header">
                <label className="formControl-label" htmlFor="key-name">Name</label>
              </div>
              <div className="formControl-body">
                <div className="formControl-wrapper">
                  <input
                    id="key-name"
                    type="text"
                    className="input formControl-input"
                    placeholder="Please Enter Unique Key Name..."
                    onChange={handleNameChange}
                    value={key.label}
                  />
                </div>
                <div className="formControl-footer">
                  {keyNameError && (
                    <div className="formControl-error">{keyNameError}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="formControl">
              <div className="formControl-header">
                <label className="formControl-label" htmlFor="key-value">Value for</label>

                {(project && project.languages) && (
                  <select
                    className="select createKey-languageSelect"
                    onChange={handleSelectedLanguageChange}
                    value={selectedLanguageId}
                  >
                    {project.languages.map((language) => (
                      <option
                        key={language.id}
                        value={language.id}
                      >
                        {language.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="formControl-body">
                <div className="formControl-wrapper">
                  <textarea
                    id="key-value"
                    className="textarea formControl-textarea createKey-valueTextarea"
                    onChange={handleValueChange}
                    value={keyValues[selectedLanguageId] ? keyValues[selectedLanguageId].value : ''}
                    key={selectedLanguageId}
                    placeholder="Please Enter Key Value..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="formControl">
              <div className="formControl-header">
                <label className="formControl-label" htmlFor="key-description">Description</label>
              </div>
              <div className="formControl-body">
                <div className="formControl-wrapper">
                  <textarea
                    id="key-description"
                    className="textarea formControl-textarea"
                    onChange={handleDescriptionChange}
                    value={key.description}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="modal-buttonBox">
        <button
          type="button"
          className="button secondary modal-button"
          onClick={handleCancelClick}
        >
          Cancel
        </button>
        <button
          type="button"
          className="button primary modal-button"
          onClick={handleSaveClick}
        >
          Save
        </button>
      </div>
    </Modal>
  );
}
