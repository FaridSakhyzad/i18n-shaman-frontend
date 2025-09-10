import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Modal from 'components/Modal';

import store from 'store';

import {
  loginUser,
  registerUser,
  resetPasswordRequest,
} from 'api/user';
import { restoreSession } from 'store/user';

import './Auth.scss';
import {
  CombinedValidationMessage,
  validateEmail, validatePassword,
} from 'utils/validators';

enum ETabs {
  Login = 'login',
  Register = 'register',
}

export enum ELoginErrorMessageTexts {
  PLEASE_ENTER_EMAIL = 'Please enter your Email',
  PLEASE_ENTER_VALID_EMAIL = 'Please enter valid Email',
  PLEASE_ENTER_PASSWORD = 'Please enter your Password',
  PLEASE_ENTER_VALID_PASSWORD = 'Please enter valid Password',
}

type ILoginErrors = {
  emailError?: ELoginErrorMessageTexts | CombinedValidationMessage,
  passwordError?: ELoginErrorMessageTexts | CombinedValidationMessage,
};

type ISignupErrors = {
  emailError?: ELoginErrorMessageTexts | CombinedValidationMessage,
  passwordError?: ELoginErrorMessageTexts | CombinedValidationMessage,
};

type TErrorCode =
  | 400 | 401 | 403 | 404 | 409 | 422 | 429
  | 500 | 501 | 503;

enum EApiLoginErrorMessageTexts {
  BAD_REQUEST = 'Bad Request',
  UNAUTHORIZED = 'Wrong email/password combination',
  FORBIDDEN = 'Forbidden',
  NOT_FOUND = 'Not Found',
  CONFLICT = 'Conflict',
  UNPROCESSABLE_ENTITY = 'Unprocessable Entity',
  TOO_MANY_REQUESTS = 'Too Many Requests',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  NOT_IMPLEMENTED = 'Not Implemented',
  SERVICE_UNAVAILABLE = 'Service Unavailable',
}

const API_LOGIN_ERROR_MESSAGES = {
  400: EApiLoginErrorMessageTexts.BAD_REQUEST,
  401: EApiLoginErrorMessageTexts.UNAUTHORIZED,
  403: EApiLoginErrorMessageTexts.FORBIDDEN,
  404: EApiLoginErrorMessageTexts.NOT_FOUND,
  409: EApiLoginErrorMessageTexts.CONFLICT,
  422: EApiLoginErrorMessageTexts.UNPROCESSABLE_ENTITY,
  429: EApiLoginErrorMessageTexts.TOO_MANY_REQUESTS,
  500: EApiLoginErrorMessageTexts.INTERNAL_SERVER_ERROR,
  501: EApiLoginErrorMessageTexts.NOT_IMPLEMENTED,
  503: EApiLoginErrorMessageTexts.SERVICE_UNAVAILABLE,
} satisfies Record<TErrorCode, string>;

enum EApiSignupErrorMessageTexts {
  BAD_REQUEST = 'Bad Request',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Forbidden',
  NOT_FOUND = 'Not Found',
  CONFLICT = 'User with this email already exists.',
  UNPROCESSABLE_ENTITY = 'Unprocessable Entity',
  TOO_MANY_REQUESTS = 'Too Many Requests',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  NOT_IMPLEMENTED = 'Not Implemented',
  SERVICE_UNAVAILABLE = 'Service Unavailable',
}

const API_SIGNUP_ERROR_MESSAGES = {
  400: EApiSignupErrorMessageTexts.BAD_REQUEST,
  401: EApiSignupErrorMessageTexts.UNAUTHORIZED,
  403: EApiSignupErrorMessageTexts.FORBIDDEN,
  404: EApiSignupErrorMessageTexts.NOT_FOUND,
  409: EApiSignupErrorMessageTexts.CONFLICT,
  422: EApiSignupErrorMessageTexts.UNPROCESSABLE_ENTITY,
  429: EApiSignupErrorMessageTexts.TOO_MANY_REQUESTS,
  500: EApiSignupErrorMessageTexts.INTERNAL_SERVER_ERROR,
  501: EApiSignupErrorMessageTexts.NOT_IMPLEMENTED,
  503: EApiSignupErrorMessageTexts.SERVICE_UNAVAILABLE,
} satisfies Record<TErrorCode, string>;

export default function Auth() {
  const dispatch = useDispatch<typeof store.dispatch>();
  const navigate = useNavigate();

  const getInitialActiveTab = () => {
    const hash = window.location.hash.replace('#', '') as ETabs;

    if (Object.values(ETabs).includes(hash)) {
      return hash;
    }

    return ETabs.Login;
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ETabs>(getInitialActiveTab());

  const handleTabClick = (tab: ETabs) => {
    window.location.hash = tab;

    setActiveTab(tab);
  };

  const [singUpAttemptMade, setSingUpAttemptMade] = useState<boolean>(false);
  const [loginAttemptMade, setLoginAttemptMade] = useState<boolean>(false);

  const [loginGeneralError, setLoginGeneralError] = useState<EApiLoginErrorMessageTexts | null>(null);
  const [loginErrors, setLoginErrors] = useState<ILoginErrors | null>(null);

  const [loginEmail, setLoginEmail] = useState<string | null>('');
  const [loginPassword, setLoginPassword] = useState<string | null>('');

  const handleLoginInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginGeneralError(null);
    setLoginEmail(e.target.value);

    if (!loginAttemptMade) {
      return;
    }

    const errors = { ...loginErrors };

    const emailValidationResult = validateEmail(e.target.value);

    if (!emailValidationResult.success) {
      errors.emailError = emailValidationResult.errors.length > 0 ? emailValidationResult.errors[0].message : ELoginErrorMessageTexts.PLEASE_ENTER_VALID_EMAIL;
    } else {
      delete errors.emailError;
    }

    setLoginErrors(errors);
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginPassword(e.target.value);
  };

  const handleLoginFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoginAttemptMade(true);

    setLoading(true);

    setLoginGeneralError(null);
    setLoginErrors(null);

    const errors = { ...loginErrors };

    if (!loginEmail || loginEmail.length < 1) {
      errors.emailError = ELoginErrorMessageTexts.PLEASE_ENTER_EMAIL;
    }

    if (!loginPassword || loginPassword.length < 1) {
      errors.passwordError = ELoginErrorMessageTexts.PLEASE_ENTER_PASSWORD;
    }

    if (!loginEmail || loginEmail.length < 1 || !loginPassword || loginPassword.length < 1) {
      setLoginErrors(errors);
      setLoading(false);

      return;
    }

    const result: {
      error: string,
      statusCode: TErrorCode
    } = await loginUser({ email: loginEmail as string, password: loginPassword as string });

    if (result.error) {
      setLoginGeneralError(API_LOGIN_ERROR_MESSAGES[result.statusCode]);
      setLoading(false);
    } else {
      dispatch(restoreSession());
      navigate('/projects');
    }
  };

  const [singUpEmail, setSingUpEmail] = useState<string | null>('');
  const [singUpPassword, setSingUpPassword] = useState<string | null>('');

  const [singUpGeneralError, setSingUpGeneralError] = useState<EApiSignupErrorMessageTexts | null>(null);
  const [singUpErrors, setSingUpErrors] = useState<ISignupErrors | null>(null);

  const [singUpSuccess, setSingUpSuccess] = useState<boolean>(false);

  const handleRegisterFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setSingUpAttemptMade(true);

    setLoading(true);

    setSingUpErrors(null);
    setSingUpGeneralError(null);

    const errors = { ...singUpErrors };

    if (!singUpEmail || singUpEmail.length < 1) {
      errors.emailError = ELoginErrorMessageTexts.PLEASE_ENTER_EMAIL;
    }

    if (!singUpPassword || singUpPassword.length < 1) {
      errors.passwordError = ELoginErrorMessageTexts.PLEASE_ENTER_PASSWORD;
    }

    if (!singUpEmail || singUpEmail.length < 1 || !singUpPassword || singUpPassword.length < 1) {
      setSingUpErrors(errors);
      setLoading(false);

      return;
    }

    const emailValidationResult = validateEmail(singUpEmail);

    if (!emailValidationResult.success) {
      errors.emailError = emailValidationResult.errors.length > 0 ? emailValidationResult.errors[0].message : ELoginErrorMessageTexts.PLEASE_ENTER_VALID_EMAIL;
    }

    const passwordValidationResult = validatePassword(singUpPassword);

    if (!passwordValidationResult.success) {
      errors.passwordError = passwordValidationResult.errors.length > 0 ? passwordValidationResult.errors[0].message : ELoginErrorMessageTexts.PLEASE_ENTER_VALID_PASSWORD;
    }

    if (errors.emailError || errors.passwordError) {
      setSingUpErrors(errors);
      setLoading(false);

      return;
    }

    const result: {
      errors: { [key: string]: string }[],
      code: TErrorCode
    } = await registerUser({ email: singUpEmail as string, password: singUpPassword as string });

    if (result.errors) {
      setSingUpGeneralError(API_SIGNUP_ERROR_MESSAGES[result.code]);
    } else {
      setSingUpSuccess(true);
    }

    setLoading(false);
  };

  const handleSignupEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSingUpGeneralError(null);
    setSingUpEmail(e.target.value);

    if (!singUpAttemptMade) {
      return;
    }

    const errors = { ...singUpErrors };

    const emailValidationResult = validateEmail(e.target.value);

    if (!emailValidationResult.success) {
      errors.emailError = emailValidationResult.errors.length > 0 ? emailValidationResult.errors[0].message : ELoginErrorMessageTexts.PLEASE_ENTER_VALID_EMAIL;
    } else {
      delete errors.emailError;
    }

    setSingUpErrors(errors);
  };

  const handleSignupPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSingUpGeneralError(null);
    setSingUpPassword(e.target.value);

    if (!singUpAttemptMade) {
      return;
    }

    const errors = { ...singUpErrors };

    const passwordValidationResult = validatePassword(e.target.value);

    if (!passwordValidationResult.success) {
      errors.passwordError = passwordValidationResult.errors.length > 0 ? passwordValidationResult.errors[0].message : ELoginErrorMessageTexts.PLEASE_ENTER_VALID_PASSWORD;
    } else {
      delete errors.passwordError;
    }

    setSingUpErrors(errors);
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const showPassword = () => {
    setIsPasswordVisible(true);
  };

  const hidePassword = () => {
    setIsPasswordVisible(false);
  };

  const [isResetPwdModalVisible, setIsResetPwdModalVisible] = useState<boolean>(false);
  const [isPwdResetRequested, setIsPwdResetRequested] = useState(false);

  const handleResetPasswordFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);

    const email = formData.get('email') as string;

    const result = await resetPasswordRequest(email);

    if (result.error) {
      console.error(result.message);
    } else {
      setLoading(false);
      setIsPwdResetRequested(true);
    }
  };

  const handleResetPwdClick = () => {
    setIsResetPwdModalVisible(true);
  };

  const handleCloseResetPwdClick = () => {
    setIsResetPwdModalVisible(false);
  };

  const handleCloseResetPwdConfirmationClick = () => {
    setIsPwdResetRequested(false);
    setIsResetPwdModalVisible(false);
  };

  const handleLoginToSiteClick = () => {
    setSingUpSuccess(false);

    window.location.hash = ETabs.Login;
    setActiveTab(ETabs.Login);
  };

  if (singUpSuccess) {
    return (
      <Modal customClassNames="modal_withBottomButtons modal_signupSuccess">
        <div className="modal-header">
          <h2 className="h2 modal-title success">Registration Successful</h2>
        </div>
        <div className="modal-content">
          <button
            type="button"
            className="button success signupSuccess-loginButton"
            onClick={handleLoginToSiteClick}
          >
            Login to Website
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <div className="authPage">
      {isResetPwdModalVisible && (
        <Modal customClassNames="modal_withBottomButtons modal_resetPassword">
          {loading && (
            <div className="loading modal-loading" />
          )}

          {isPwdResetRequested ? (
            <>
              <div className="modal-header">
                <h2 className="h2">Reset your password</h2>

                <button
                  type="button"
                  className="modal-closeButton"
                  onClick={handleCloseResetPwdConfirmationClick}
                  aria-label="Close modal"
                />
              </div>
              <div className="modal-content">
                Link to reset the password was successfully sent to your Email. If you don&apos;t receive the email soon, check your Spam folder.
              </div>
            </>
          ) : (
            <>
              <div className="modal-header">
                <h2 className="h2">Reset your password</h2>

                <button
                  type="button"
                  className="modal-closeButton"
                  onClick={handleCloseResetPwdClick}
                  aria-label="Close modal"
                />
              </div>
              <div className="modal-content">
                <div className="resetPwdFormBox">
                  <form className="form resetPwdForm" onSubmit={handleResetPasswordFormSubmit}>

                    <div className="form-row">
                      <div className="formControl">
                        <div className="formControl-header">
                          <label className="formControl-label">Please enter Your Email</label>
                        </div>
                        <div className="formControl-wrapper">
                          <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            className="input formControl-input"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-row authForm-row_controls">
                      <button type="submit" className="button primary resetPwdForm-buttonSend">Reset Password</button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </Modal>
      )}

      <div className="modal-window">
        {loading && (
          <div className="loading modal-loading" />
        )}

        {activeTab === ETabs.Login && (
          <>
            <div className="modal-header">
              <h2 className="h2">Log in</h2>
            </div>
            <div className="modal-content">
              <div className="authFormBox">
                <form className="form authForm" onSubmit={handleLoginFormSubmit}>
                  {loginGeneralError && (
                    <div className="form-error">
                      {loginGeneralError}
                    </div>
                  )}
                  <div className="form-row">
                    <div className="formControl">
                      <div className="formControl-header">
                        <label className="formControl-label">Email</label>
                      </div>
                      <div className="formControl-body">
                        <div className="formControl-wrapper">
                          <i className="formControl-iconStart formControl-iconEmail" />
                          <input
                            type="text"
                            placeholder="Email"
                            name="email"
                            className="input formControl-input"
                            onChange={handleLoginInputChange}
                          />
                        </div>
                      </div>
                      <div className="formControl-footer">
                        {loginErrors && loginErrors.emailError && (
                          <div className="formControl-error">{loginErrors.emailError}</div>
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
                          <i className="formControl-iconStart formControl-iconKey" />
                          <i
                            className={`formControl-iconEnd authForm-eyeIcon ${isPasswordVisible ? 'formControl-iconEyeClosed' : 'formControl-iconEye'}`}
                            onMouseDown={showPassword}
                            onMouseUp={hidePassword}
                          />
                          <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder="Password"
                            name="password"
                            className="input formControl-input"
                            onChange={handlePasswordInputChange}
                          />
                        </div>
                      </div>
                      <div className="formControl-footer">
                        {loginErrors && loginErrors.passwordError && (
                          <div className="formControl-error">{loginErrors.passwordError}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-row authForm-row_controls">
                    <button type="submit" className="button primary authForm-loginButton">Login</button>
                  </div>
                </form>

                <div className="authFormMisc">
                  <div>
                    Not registered? <button className="buttonInline authFormMisc-button" type="button" onClick={() => handleTabClick(ETabs.Register)}>Sign up</button>
                  </div>

                  <button
                    className="buttonInline authFormMisc-button"
                    type="button"
                    onClick={handleResetPwdClick}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === ETabs.Register && (
          <>
            <div className="modal-header">
              <h2 className="h2">Sign up</h2>
            </div>
            <div className="authFormBox authFormBox_login">
              <form className="form authForm" onSubmit={handleRegisterFormSubmit}>
                {singUpGeneralError && (
                  <div className="form-error">
                    {singUpGeneralError}
                  </div>
                )}
                <div className="form-row">
                  <div className="formControl">
                    <div className="formControl-header">
                      <label className="formControl-label">Email</label>
                    </div>
                    <div className="formControl-body">
                      <div className="formControl-wrapper">
                        <i className="formControl-iconStart formControl-iconEmail" />
                        <input
                          type="text"
                          placeholder="Email"
                          name="email"
                          className="input formControl-input"
                          onChange={handleSignupEmailChange}
                        />
                      </div>
                    </div>
                    <div className="formControl-footer">
                      {singUpErrors && singUpErrors.emailError && (
                        <div className="formControl-error">{singUpErrors.emailError}</div>
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
                        <i className="formControl-iconStart formControl-iconKey" />
                        <i
                          className={`formControl-iconEnd authForm-eyeIcon ${isPasswordVisible ? 'formControl-iconEyeClosed' : 'formControl-iconEye'}`}
                          onMouseDown={showPassword}
                          onMouseUp={hidePassword}
                        />
                        <input
                          type={isPasswordVisible ? 'text' : 'password'}
                          placeholder="Password"
                          name="password"
                          className="input formControl-input"
                          onChange={handleSignupPasswordChange}
                        />
                      </div>
                    </div>
                    <div className="formControl-footer">
                      <div className="formControl-noteBox">
                        <span className="formControl-noteStart">The password must be at least 6 characters long and contain letters in different cases, numbers and special characters.</span>
                      </div>

                      {singUpErrors && singUpErrors.passwordError && (
                        <div className="formControl-error">{singUpErrors.passwordError}</div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="form-row authForm-row_controls">
                  <button type="submit" className="button success authForm-loginButton">Register</button>
                </div>
              </form>

              <div className="authFormMisc">
                <div>
                  Already Have an Account? <button className="buttonInline authFormMisc-button" type="button" onClick={() => handleTabClick(ETabs.Login)}>Log in</button>
                </div>

                <button
                  className="buttonInline authFormMisc-button"
                  type="button"
                  onClick={handleResetPwdClick}
                >
                  Forgot password?
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
