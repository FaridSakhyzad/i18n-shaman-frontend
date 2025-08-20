import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import './ResetPassword.css';
import { getPasswordResetSecurityToken, setNewPassword } from 'api/user';
import { EPasswordValidationErrors, validatePassword } from 'utils/validators';

export default function ResetPassword() {
  const { resetToken } = useParams<{ resetToken: string }>();

  if (!resetToken || resetToken.length < 1) {
    window.location.href = '/';
  }

  const [formGeneralError, setFormGeneralError] = useState<string | null>(null);

  const handleSetNewPwdFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormGeneralError(null);

    const formData = new FormData(e.target as HTMLFormElement);

    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirm_password') as string;

    if (!resetToken || resetToken.length < 1) {
      return;
    }

    if (password !== confirmPassword) {
      setFormGeneralError(EPasswordValidationErrors.PASSWORDS_DONT_MATCH);

      return;
    }

    const validationResult = validatePassword(password);

    if (validationResult.error) {
      setFormGeneralError(validationResult.error);
    }

    const securityToken = await getPasswordResetSecurityToken();

    const result = await setNewPassword({
      password,
      securityToken,
      resetToken,
    });

    console.log('result', result);
  };

  return (
    <div className="setNewPwdPage">
      <div className="modal-window modal-window_resetPwd">
        <div className="modal-header">
          <h2 className="h2">Set new password</h2>
        </div>

        <form className="form setNewPwdForm" onSubmit={handleSetNewPwdFormSubmit}>
          <div className="form-row">
            <div className="formControl">
              <div className="formControl-header">
                <label className="formControl-label">New Password</label>
              </div>
              <div className="formControl-body">
                <div className="formControl-wrapper">
                  <input
                    type="password"
                    placeholder="New Password please"
                    name="password"
                    className="input formControl-input"
                    required
                  />
                </div>
              </div>
              <div className="formControl-footer">
                {false && (
                  <div className="formControl-error">Error</div>
                )}
              </div>
            </div>

          </div>

          <div className="form-row">
            <div className="formControl">
              <div className="formControl-header">
                <label className="formControl-label">Confirm Password</label>
              </div>
              <div className="formControl-body">
                <div className="formControl-wrapper">
                  <input
                    type="password"
                    placeholder="Confirm Your New Password please"
                    name="confirm_password"
                    className="input formControl-input"
                    required
                  />
                </div>
              </div>
              <div className="formControl-footer">
                {false && (
                  <div className="formControl-error">Error</div>
                )}
              </div>
            </div>
          </div>

          {formGeneralError && (
            <div className="form-row">
              <div className="form-error">{formGeneralError}</div>
            </div>
          )}

          <div className="form-row setNewPwdForm-row_controls">
            <button type="submit" className="button primary setNewPwdForm-submitButton">Set New Password</button>
          </div>
        </form>
      </div>
    </div>
  );
}
