import { ComponentType } from 'react';

interface IMessageComponents {
  [componentName: string]: ComponentType<any>;
}

const messageComponents: IMessageComponents = {};

export const registerSystemMessageComponent = <Props extends Record<string, any>>(name: string, component: ComponentType<Props>): void => {
  messageComponents[name] = component;
};

export const getSystemMessageComponent = (name: string): ComponentType<any> | undefined => messageComponents[name];
