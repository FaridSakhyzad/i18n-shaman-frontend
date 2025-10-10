import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getEmailVerificationSecurityToken, verifyEmail } from 'api/user';

import './VerifyEmail.css';

export default function VerifyEmail() {
  const { verificationToken = '' } = useParams<{ verificationToken: string }>();

  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const performVerification = async () => {
    const getSecurityTokenResult = await getEmailVerificationSecurityToken(verificationToken);

    const { success, errors } = getSecurityTokenResult;

    if (!success || errors) {
      console.error('Error Obtaining Security Token');

      return;
    }

    const verificationResult = await verifyEmail(verificationToken, getSecurityTokenResult.data.token);

    if (!verificationResult.success || verificationResult.errors) {
      console.error('Error Verifying Email');

      return;
    }

    setVerificationSuccess(true);
  };

  useEffect(() => {
    if (!verificationToken || verificationToken.length < 1) {
      return;
    }

    performVerification();
  }, [verificationSuccess]);

  if (!verificationSuccess) {
    return (
      <div className="verifyEmail">
        <h3 className="h4 verifyEmail-title">Email verification link is invalid</h3>

        <div className="verifyEmail-buttons">
          <Link to="/auth" replace className="button secondary verifyEmail-loginButton">Login</Link>
          <Link to="/auth#register" replace className="button secondary verifyEmail-loginButton">Register</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="verifyEmail">
      <h3 className="h2 verifyEmail-title">Your email verified successfully</h3>
      <Link to="/auth" replace className="button primary verifyEmail-loginButton">Login to Site</Link>
    </div>
  );
}
