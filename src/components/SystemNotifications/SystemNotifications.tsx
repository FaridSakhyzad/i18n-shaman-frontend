import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from 'store';
import { IMessage } from 'store/systemNotifications';

import './SystemNotifications.scss';
import Notification from './Notification';

export default function SystemNotifications() {
  const { messages }: { messages: IMessage[] } = useSelector((state: IRootState) => state.systemNotifications);

  return (
    <div className="systemNotificationWrapper">
      {messages.map((notificationProps: IMessage) => (
        <Fragment key={notificationProps.id}>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Notification {...notificationProps} />
        </Fragment>
      ))}
    </div>
  );
}
