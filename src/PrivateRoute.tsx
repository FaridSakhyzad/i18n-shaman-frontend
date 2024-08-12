import React, { ReactElement } from 'react';

import {
  Navigate,
} from 'react-router-dom';

interface IProps {
  component: ReactElement,
  redirectPath?: string,
}

export default function PrivateRoute(props: IProps) {
  const { component, redirectPath = '/' } = props;

  const isPrivate = true;

  console.log(props);

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    isPrivate ? <Navigate to={redirectPath as string} /> : <>{component}</>
  );
}
