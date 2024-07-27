import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import appstore from './store';
import Editor from './pages/Editor';
import Profile from './pages/Profile';

import './general.css';
import './common.scss';

import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([
  {
    path: '/project/:projectId',
    element: <Editor />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <Provider store={appstore}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
