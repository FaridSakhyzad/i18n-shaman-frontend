import React, { useEffect, useState } from 'react';
import { verifyUser } from './api/user';

interface IProps {
  children: React.ReactNode,
}

export default function MainLayout({ children }: IProps) {
  const [isLoading, setIsLoading] = useState(true);

  const getUserInformation = async () => {
    const user = await verifyUser();

    if (user && user.id) {
      console.log('user', user);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getUserInformation();
  }, []);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>{children}</>
      )}
    </>
  );
}
