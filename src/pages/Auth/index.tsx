import React, { useState } from 'react';
import './Auth.scss';
import {
  ILoginUserDto,
  IRegisterUserDto,
  loginUser,
  registerUser,
} from 'api/user';

export default function Auth() {
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

    console.log('login result', result);

    if (result.error) {
      alert(result.message);
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

    console.log('register result', result);

    if (result.error) {
      alert(result.message);
    }
  };

  return (
    <div className="container">
      <div className="authTabs">
        <button
          type="button"
          onClick={() => handleTabClick(0)}
          className={`button ${activeTab === 0 ? 'active' : ''}`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => handleTabClick(1)}
          className={`button ${activeTab === 1 ? 'active' : ''}`}
        >
          Register
        </button>
      </div>

      {activeTab === 0 && (
        <div className="authFormBox">
          <h1>Login</h1>
          <form className="authForm" onSubmit={handleLoginFormSubmit}>
            <div className="row">
              <div className="col">
                <input type="text" placeholder="Login" name="login" className="input" required />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <input type="password" placeholder="Password" name="password" className="input" required />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <button type="submit" className="button">Login</button>
              </div>
            </div>
          </form>
        </div>
      )}

      {activeTab === 1 && (
        <div className="authFormBox">
          <h1>Register</h1>
          <form className="authForm" onSubmit={handleRegisterFormSubmit}>
            <div className="row">
              <div className="col">
                <input
                  type="text"
                  placeholder="login"
                  className="input"
                  name="login"
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <input
                  type="password"
                  placeholder="password"
                  className="input"
                  name="password"
                />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <button type="submit" className="button">Register</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
