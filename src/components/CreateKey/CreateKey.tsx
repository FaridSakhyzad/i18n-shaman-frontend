import React, { useState } from 'react';
import Modal from 'components/Modal';
import './AddKey.scss';
import { addProjectKey } from '../../api/projects';

interface IPros {
  projectId: string;
  onCancel: () => void;
  onConfirm: () => void;
  onClose: () => void;
}

export default function CreateKey ({ projectId, onCancel, onConfirm, onClose }: IPros) {
  const [ loading, setLoading, ] = useState<boolean>(false);

  const [ keyName, setName, ] = useState<string>('');
  const [ keyValue, setValue, ] = useState<string>('');
  const [ keyDescription, setDescription, ] = useState<string>('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setName(value);
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    setValue(value);
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    setDescription(value);
  }

  const handleCloseButtonClick = () => {
    onClose();
  }

  const handleCancelClick = () => {
    onCancel();
  }

  const handleCreateClick = async () => {
    setLoading(true);

    const result = await addProjectKey({
      projectId: projectId,
      id: Math.random().toString(16).substring(2),
      label: keyName,
      description: keyDescription,
      values: [],
    });

    onConfirm();
  }

  return (
    <Modal
      customClassNames="modal_withBottomButtons modal_addKey"
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
                <label className="formControl-label">Name*</label>
              </div>
              <div className="formControl-body">
                <div className="formControl-wrapper">
                  <input
                    type="text"
                    className="input formControl-input"
                    placeholder="Please Enter Unique Key Name..."
                    onChange={handleNameChange}
                    value={keyName}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="formControl">
              <div className="formControl-header">
                <label className="formControl-label">Values (Optional)</label>
              </div>
              <div className="formControl-body">
                <div className="formControl-wrapper">
                  <textarea
                    className="textarea formControl-textarea"
                    onChange={handleValueChange}
                    value={keyValue}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="formControl">
              <div className="formControl-header">
                <label className="formControl-label">Description</label>
              </div>
              <div className="formControl-body">
                <div className="formControl-wrapper">
                  <textarea
                    className="textarea formControl-textarea"
                    onChange={handleDescriptionChange}
                    value={keyDescription}
                  ></textarea>
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
  )
}