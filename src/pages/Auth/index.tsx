import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import store from 'store';

import {
  ILoginUserDto,
  IRegisterUserDto,
  loginUser,
  registerUser,
} from 'api/user';
import { restoreSession } from 'store/user';

import './Auth.scss';

export default function Auth() {
  const dispatch = useDispatch<typeof store.dispatch>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (tab: number) => {
    setActiveTab(tab);
  };

  const handleLoginFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const data: ILoginUserDto = {
      login: formData.get('login') as string,
      password: formData.get('password') as string,
    };

    const result = await loginUser(data);

    if (result.error) {
      alert(result.message);
    } else {
      dispatch(restoreSession());
      navigate('/projects');
    }
  };

  const handleRegisterFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const data: IRegisterUserDto = {
      login: formData.get('login') as string,
      password: formData.get('password') as string,
    };

    const result = await registerUser(data);

    if (result.error) {
      alert(result.message);
    }
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const showPassword = () => {
    setIsPasswordVisible(true);
  };

  const hidePassword = () => {
    setIsPasswordVisible(false);
  };

  console.log('showPassword', showPassword);

  return (
    <div className="authPage">
      <div className="modal-window">
        {activeTab === 0 && (
          <>
            <div className="modal-header">
              <h2 className="h2">Log in</h2>
            </div>
            <div className="modal-content">
              <div className="authFormBox">
                <form className="form authForm" onSubmit={handleLoginFormSubmit}>
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
                            name="login"
                            className="input formControl-input"
                            required
                          />
                        </div>
                      </div>
                      <div className="formControl-footer">
                        {false && (
                          <div className="formControl-error">Please Enter Your Name</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="authForm-row">
                    <div className="formControl">
                      <div className="formControl-header">
                        <label className="formControl-label">Password</label>
                      </div>
                      <div className="formControl-body">
                        <div className="formControl-wrapper">
                          <i className="formControl-iconStart formControl-iconKey" />
                          <i className="formControl-iconEnd formControl-iconEye" onMouseDown={showPassword} onMouseUp={hidePassword} />
                          <input
                            type={isPasswordVisible ? 'text' : 'password'}
                            placeholder="Password"
                            name="password"
                            className="input formControl-input"
                            required
                          />
                        </div>
                      </div>
                      <div className="formControl-footer">
                        {false && (
                          <div className="formControl-error">Please Enter Your Name</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="authForm-row">
                    <button type="submit" className="button primary authForm-loginButton">Login</button>
                  </div>
                </form>

                <div className="authFormMisc">
                  <button
                    className="buttonInline authFormMisc-button"
                    type="button"
                    onClick={() => handleTabClick(1)}
                  >
                    Not registered? <span className="authFormMisc-buttonLink">Sign up</span>
                  </button>

                  {false && (
                    <button className="buttonInline authFormMisc-button" type="button">Forgot password?</button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 1 && (
          <>
            <div className="modal-header">
              <h2 className="h2">Sign up</h2>
            </div>
            <div className="authFormBox">
              <form className="form authForm" onSubmit={handleRegisterFormSubmit}>
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
                          name="login"
                          className="input formControl-input"
                          required
                        />
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
                        <i className="formControl-iconStart formControl-iconKey" />
                        <i className="formControl-iconEnd formControl-iconEye" onMouseDown={showPassword} onMouseUp={hidePassword} />
                        <input
                          type={isPasswordVisible ? 'text' : 'password'}
                          placeholder="Password"
                          name="password"
                          className="input formControl-input"
                          required
                        />
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
                  <button type="submit" className="button success authForm-loginButton">Register</button>
                </div>
              </form>

              <div className="authFormMisc">
                <button className="buttonInline authFormMisc-button" type="button" onClick={() => handleTabClick(0)}>
                  Already Have an Account? <span className="authFormMisc-buttonLink">Log in</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
