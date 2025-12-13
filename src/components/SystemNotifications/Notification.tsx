import React, { useEffect, useRef } from 'react';
import { AppDispatch } from 'store';
import { useDispatch } from 'react-redux';

import { DEFAULT_SYSTEM_MESSAGE_DURATION } from 'constants/app';

import {
  EContentType,
  EMessageType,
  INotification,
  removeSystemNotification,
} from 'store/systemNotifications';

import { getComponent } from './SystemNotificationsRegistry';

export default function Notification(props: INotification) {
  const {
    id,
    type,
    contentType,
    component,
    content,
    componentProps,
    duration = DEFAULT_SYSTEM_MESSAGE_DURATION,
  } = props;

  const dispatch = useDispatch<AppDispatch>();

  const handleCloseClick = (notificationId: string) => {
    dispatch(removeSystemNotification(notificationId));
  };

  const notificationRef = useRef<HTMLDivElement>(null);

  const applyHeight = () => {
    if (!notificationRef || !notificationRef.current || duration === 'infinity') {
      return;
    }

    notificationRef.current.style.setProperty('--initial-height', `${notificationRef.current.getBoundingClientRect().height}px`);
  };

  useEffect(() => {
    applyHeight();

    if (duration !== 'infinity') {
      const timer = setTimeout(() => {
        dispatch(removeSystemNotification(id));
        clearTimeout(timer);
      }, duration);
    }
  }, []);

  const style: React.CSSProperties & { '--duration': string } | {} = duration !== 'infinity' ? {
    '--duration': `${duration}ms`,
  } : {};

  if (type === EMessageType.Custom && contentType === EContentType.Component && component) {
    const Component = getComponent(component);

    if (!Component) {
      return null;
    }

    return (
      <Component {...componentProps} /> // eslint-disable-line react/jsx-props-no-spreading
    );
  }

  if (contentType === EContentType.Component && component) {
    const Component = getComponent(component);

    if (!Component) {
      return null;
    }

    return (
      <div
        key={id}
        className={`systemNotification ${type} ${duration !== 'infinity' ? 'systemNotification_fadeAway' : ''}`}
        style={style}
        ref={notificationRef}
      >
        <button
          className="systemNotification-close"
          type="button"
          aria-label="Close"
          onClick={() => handleCloseClick(id)}
        />
        <div className="systemNotification-content">
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...componentProps} />
        </div>
      </div>
    );
  }

  return (
    <div
      key={id}
      className={`systemNotification ${type} ${duration !== 'infinity' ? 'systemNotification_fadeAway' : ''}`}
      style={style}
      ref={notificationRef}
    >
      <button
        className="systemNotification-close"
        type="button"
        aria-label="Close"
        onClick={() => handleCloseClick(id)}
      />
      <div className="systemNotification-content">
        {(contentType === EContentType.Html) ? (
          <div dangerouslySetInnerHTML={{ __html: content as string }} />
        ) : (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <>{content}</>
        )}
      </div>
    </div>
  );
}
