import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import './assets/styles/fonts.css';
import './assets/styles/general.css';
import './assets/styles/common.scss';

import appstore from './store';

import './i18n';

import Home from './pages/Home';
import Auth from './pages/Auth';
import Projects from './pages/Projects';
import Editor from './pages/Editor';
import Profile from './pages/Profile';

import MainLayout from './MainLayout';
import PrivateRoute from './PrivateRoute';


import reportWebVitals from './reportWebVitals';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/projects',
    element: <PrivateRoute component={<Projects />} />,
  },
  {
    path: '/project/:projectId',
    element: <PrivateRoute component={<Editor />} />,
  },
  {
    path: '/profile',
    element: <PrivateRoute component={<Profile />} />,
  },
  {
    path: '*',
    element: <div>404</div>,
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <Provider store={appstore}>
    <React.StrictMode>
      <MainLayout>
        <RouterProvider router={router} />
      </MainLayout>
    </React.StrictMode>
  </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
