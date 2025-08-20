import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IRootState } from 'store';

interface IProps {
  component: ReactElement,
  redirectPath?: string,
}

export default function PrivateRoute(props: IProps) {
  const { component, redirectPath = '/' } = props;

  const { id: userId } = useSelector(({ user }: IRootState) => user);

  return (
    !userId ? <Navigate to={redirectPath as string} /> : component
  );
}
