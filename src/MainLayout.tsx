import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store, { IRootState } from 'store';
import { restoreSession } from 'store/user';

interface IProps {
  children: React.ReactNode,
}

export default function MainLayout({ children }: IProps) {
  const { loading: userLoading } = useSelector(({ user }: IRootState) => user);

  const dispatch = useDispatch<typeof store.dispatch>();

  const getUserInformation = () => {
    dispatch(restoreSession());
  };

  useEffect(() => {
    getUserInformation();
  }, []);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {userLoading ? (
        <div>Loading</div>
      ) : (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>{children}</>
      )}
    </>
  );
}
