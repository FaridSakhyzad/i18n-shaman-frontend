import React from 'react';

import './Storybook.scss';

export default function Storybook() {
  return (
    <div className="storybook">
      <h1>Storybook</h1>
      <hr/>

      <form className="form">
        <div className="form-row">
          <div className="formControl">
            <div className="formControl-header">
              <label className="formControl-label">Email</label>
            </div>
            <div className="formControl-body">
              <div className="formControl-wrapper">
                <input className="input formControl-input"/>
              </div>
            </div>
            <div className="formControl-footer">
              {false && (
                <div className="formControl-error">Please Enter Your Name</div>
              )}
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="formControl">
            <div className="formControl-header">
              <label className="formControl-label">Password</label>
            </div>
            <div className="formControl-body">
              <div className="formControl-wrapper">
                <i className="formControl-iconStart formControl-iconKey"/>
                <i className="formControl-iconEnd formControl-iconEye"/>
                <input className="input formControl-input"/>
              </div>
            </div>
            <div className="formControl-footer">
              {false && (
                <div className="formControl-error">Please Enter Your Name</div>
              )}
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="formControl hasError">
            <div className="formControl-header">
              <label className="formControl-label">First Name*</label>
              <i className="formControl-infoIcon"/>
            </div>
            <div className="formControl-body">
              <div className="formControl-wrapper">
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

        <div className="form-row">
          <div className="formControl">
            <div className="formControl-header">
              <label className="formControl-label">Second Name*</label>
            </div>
            <div className="formControl-body">
              <div className="formControl-wrapper">
                <input type="text" className="input formControl-input"/>
              </div>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="formControl">
            <div className="formControl-header">
              <label className="formControl-label">About yourself</label>
            </div>
            <div className="formControl-body">
              <div className="formControl-wrapper">
                <textarea className="textarea formControl-textarea"></textarea>
              </div>
            </div>
            <div className="formControl-footer">
              <div className="formControl-noteBox">
                <span className="formControl-noteStart">Please no markdown</span>
                <span className="formControl-noteEnd">1024 Symbols left</span>
              </div>
            </div>
          </div>
        </div>
      </form>

      <hr/>

      <input type="checkbox" className="switcher"/>
    </div>
  )
}