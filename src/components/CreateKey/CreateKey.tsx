import React, { useState } from 'react';

import Modal from 'components/Modal';
import { IRootState } from 'store';

import { createProjectEntity, getMultipleEntitiesDataByParentId } from 'api/projects';
import { IKey, IKeyValue, IProject } from 'interfaces';

import {
  validateKeyName,
  validationErrors,
} from '../../utils/Validators';

import './CreateKey.scss';
import { useSelector } from 'react-redux';

interface IPros {
  projectId: string;
  parentId: string;
  entityPath: string;
  project: IProject | null;
  onCancel: () => void;
  onConfirm: () => void;
  onClose: () => void;
}

export default function CreateKey({
  projectId,
  parentId,
  entityPath,
  project,
  onCancel,
  onConfirm,
  onClose,
}: IPros) {
  const [loading, setLoading] = useState<boolean>(false);

  const { id: userId } = useSelector((state: IRootState) => state.user);

  const [keyName, setName] = useState<string>('');
  const [selectedEntityType, setSelectedEntityType] = useState<string>('string');
  const [siblingKeys, setSiblingKeys] = useState<IKey[] | null>(null);

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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!project) {
      return;
    }

    setKeyNameError('');

    const { value } = e.target;

    if (submitAttemptMade) {
      const validationResult = validateKeyName(value, null, parentId, siblingKeys as IKey[]);

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

  const handleDescriptionChange = ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(value);
  };

  const handleEntityTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEntityType(e.target.value);
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
    setLoading(true);

    const siblingKeysData = await getMultipleEntitiesDataByParentId({
      projectId,
      parentId,
    });

    setSiblingKeys(siblingKeysData);

    const validationResult = validateKeyName(keyName, project.projectId, parentId, siblingKeysData);

    if (validationResult.error) {
      setLoading(false);
      setKeyNameError(validationErrors[validationResult.error]);
      return;
    }

    const newValues: IKeyValue[] = [];

    const newKeyId = Math.random().toString(16).substring(2);

    Object.keys(keyValues).forEach((key) => {
      newValues.push({
        value: keyValues[key],
        languageId: key,
        keyId: newKeyId,
        projectId,
        parentId,
      });
    });

    const result = await createProjectEntity({
      projectId,
      parentId,
      id: newKeyId,
      label: keyName,
      description: keyDescription,
      values: newValues,
      type: selectedEntityType,
      pathCache: entityPath
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
                <label className="formControl-label" htmlFor="key-name">Type</label>
              </div>
              <div className="formControl-body">
                <div className="formControl-wrapper">
                  <select
                    className="select"
                    onChange={handleEntityTypeChange}
                  >
                    <option value="string">String</option>
                    <option value="folder">Folder</option>
                    <option value="component">Component</option>
                  </select>
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
