import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from 'store';
import { INotification } from 'store/systemNotifications';

import './SystemNotifications.scss';
import Notification from './Notification';

export default function SystemNotifications() {
  const { notifications }: { notifications: INotification[] } = useSelector((state: IRootState) => state.systemNotifications);

  return (
    <div className="systemNotificationWrapper">
      {notifications.map((notificationProps: INotification) => (
        <Fragment key={notificationProps.id}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Notification {...notificationProps} />
        </Fragment>
      ))}
    </div>
  );
}
