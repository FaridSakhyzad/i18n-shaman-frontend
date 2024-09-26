import React, { useState } from 'react';
import Modal from 'components/Modal';

import './AddProjectLanguage.scss';

export default function AddProjectLanguage() {
  return (
    <Modal customClassNames="modal_withBottomButtons modal_addProjectLang">
      <div className="modal-header">
        <h4 className="modal-title">Add New Language</h4>
        <button
          type="button"
          className="modal-closeButton"
        />
      </div>
      <div className="modal-content">
        <form className="form">
          <div className="form-row">
            <div className="formControl">
              <div className="formControl-body">
                <select className="select formControl-select"></select>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="formControl hasError">
              <div className="formControl-header">
                <label className="formControl-label">Custom language code</label>
                <i className="formControl-infoIcon"/>
              </div>
              <div className="formControl-body addProjectLang-switchableControl">
                <input type="checkbox" className="switcher"/>

                <div className="formControl-wrapper">
                  <i className="formControl-iconKey"/>
                  <i className="formControl-iconEye"/>
                  <input type="text" className="input formControl-input"/>
                </div>
              </div>
              <div className="formControl-footer">
                <div className="formControl-noteBox">
                  <span className="formControl-noteStart">Please no markdown</span>
                  <span className="formControl-noteEnd">1024 Symbols left</span>
                </div>
                <div className="formControl-error">Please Enter Your Name</div>
              </div>
            </div>

          </div>
        </form>
      </div>
      <div className="modal-buttonBox">
        <button
          type="button"
          className="button secondary addProjectLang-cancelButton"
        >
          Close
        </button>
        <button
          type="button"
          className="button primary addProjectLang-addButton"
        >
          Add
        </button>
      </div>
    </Modal>
  )
};