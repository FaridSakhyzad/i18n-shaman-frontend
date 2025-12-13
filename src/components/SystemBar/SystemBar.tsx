import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';

import { IMessage } from 'store/globalMessages';
import { IRootState } from 'store';
import SystemMessageRenderer from './SystemMessageRenderer';

import './systemBar.css';

export default function SystemBar() {
  const { messages }: { messages: IMessage[] } = useSelector((state: IRootState) => state.globalMessages);

  return (
    <div className="systemBarWrapper">
      <div className="systemBar">
        {messages.map((notificationProps: IMessage) => (
          <Fragment key={notificationProps.id}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <SystemMessageRenderer {...notificationProps} />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
