import { ComponentType } from 'react';

interface IMessageComponents {
  [componentName: string]: ComponentType<any>;
}

const messageComponents: IMessageComponents = {};

export const registerComponent = <Props extends Record<string, any>>(name: string, component: ComponentType<Props>): void => {
  messageComponents[name] = component;
};

export const getComponent = (name: string): ComponentType<any> | undefined => messageComponents[name];
