import React, { useState } from 'react';

import Modal from 'components/Modal';
import { addProjectKey } from 'api/projects';
import { IKey, IProject } from 'interfaces';

import './CreateKey.scss';

interface IPros {
  projectId: string;
  project: IProject | null;
  onCancel: () => void;
  onConfirm: () => void;
  onClose: () => void;
}

interface IValidationError {
  [key: string]: string;
}

const validationErrors: IValidationError = {
  DUPLICATE_KEY_ERROR: 'Key name already exist. Please Enter Unique Key Name',
};

export default function CreateKey({
  projectId,
  project,
  onCancel,
  onConfirm,
  onClose,
}: IPros) {
  const [loading, setLoading] = useState<boolean>(false);

  const [keyName, setName] = useState<string>('');
  const [keyValue, setValue] = useState<string>('');

  const [keyValues, setValues] = useState<{ [key: string]: string }>({});

  const getInitialSelectedLanguageId = () => {
    if (!project) {
      return '';
    }

    const firstLang = project.languages[0];

    return firstLang.id;
  };

  const [selectedLanguageId, setSelectedLanguageId] = useState<string>(getInitialSelectedLanguageId());

  const [keyDescription, setDescription] = useState<string>('');

  const [submitAttemptMade, setSubmitAttemptMade] = useState<boolean>(false);
  const [keyNameError, setKeyNameError] = useState<string>('');

  const validateKeyName = (value: string, keys: IKey[]) => {
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];

      if (key.label === value) {
        return {
          error: 'DUPLICATE_KEY_ERROR',
        };

        break;
      }
    }

    return {};
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!project) {
      return;
    }

    setKeyNameError('');

    const { value } = e.target;

    if (submitAttemptMade) {
      const validationResult = validateKeyName(value, project.keys);

      if (validationResult.error) {
        setKeyNameError(validationErrors[validationResult.error]);
      }
    }

    setName(value);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    const newValue = { [selectedLanguageId]: value };

    setValues({
      ...keyValues,
      ...newValue,
    });
  };

  const handleSelectedLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguageId(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    setDescription(value);
  };

  const handleCloseButtonClick = () => {
    onClose();
  };

  const handleCancelClick = () => {
    onCancel();
  };

  const handleCreateClick = async () => {
    if (!project) {
      return;
    }

    setSubmitAttemptMade(true);

    const validationResult = validateKeyName(keyName, project.keys);

    if (validationResult.error) {
      setKeyNameError(validationErrors[validationResult.error]);
      return;
    }

    setLoading(true);

    const newValues: { [key: string]: string }[] = [];

    Object.keys(keyValues).forEach((key) => {
      newValues.push({
        value: keyValues[key],
        languageId: key,
      });
    });

    const result = await addProjectKey({
      projectId,
      id: Math.random().toString(16).substring(2),
      label: keyName,
      description: keyDescription,
      values: newValues,
    });

    setLoading(false);

    onConfirm();
  };

  return (
    <Modal
      customClassNames="modal_withBottomButtons modal_createKey"
      onEscapeKeyPress={handleCloseButtonClick}
    >
      {loading && (
        <div className="loading modal-loading" />
      )}

      <div className="modal-header">
        <h4 className="modal-title">Create New Key</h4>
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
                <label className="formControl-label" htmlFor="key-name">Name*</label>
              </div>
              <div className="formControl-body">
                <div className="formControl-wrapper">
                  <input
                    id="key-name"
                    type="text"
                    className="input formControl-input"
                    placeholder="Please Enter Unique Key Name..."
                    onChange={handleNameChange}
                    value={keyName}
                  />
                </div>
                <div className="formControl-footer">
                  {(submitAttemptMade && keyNameError.length > 0) && (
                    <div className="formControl-error">{keyNameError}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="formControl">
              <div className="formControl-header">
                <label className="formControl-label" htmlFor="key-value">Values for</label>

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
                    value={keyValues[selectedLanguageId]}
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
                    value={keyDescription}
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
        >Cancel
        </button>
        <button
          type="button"
          className="button primary modal-button"
          onClick={handleCreateClick}
          disabled={keyName.length < 1}
        >Create
        </button>
      </div>
    </Modal>
  );
}
