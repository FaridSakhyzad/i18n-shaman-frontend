import { createAppSlice } from './helpers';
import { parseCookie } from '../utils/utils';
import { registerSystemMessageComponent } from '../components/SystemBar/SystemMessageRegistry';
import CookieMessage from '../components/CookieMessage';

export enum EMessageType {
  Default = 'default',
  Info = 'info',
  Attention = 'attention',
  Warning = 'warning',
  Success = 'success',
  Error = 'error',
}

export enum EContentType {
  Text = 'text',
  Html = 'html',
  Component = 'component',
}

export interface IMessage {
  id: string;
  type: EMessageType;
  contentType?: EContentType;
  content?: string;
  component?: string;
  componentProps?: Record<string, any>;
  closeButton?: Boolean;
}

interface IInitialState {
  messages: IMessage[],
}

const getInitialState = (): IMessage[] => {
  const cookieMap = parseCookie(window.document.cookie);

  if (!cookieMap.get('userAgreedToCookie')) {
    registerSystemMessageComponent('CookieMessage', CookieMessage);

    return [{
      id: Math.random().toString(16).substring(2),
      contentType: EContentType.Component,
      component: 'CookieMessage',
    } as IMessage];
  }

  return [];
};

const initialState: IInitialState = {
  messages: getInitialState(),
};

const globalMessagesSlice = createAppSlice({
  name: 'systemNotifications',
  initialState,
  reducers: {
    createGlobalMessage: (state, action: { payload: any, type: string }) => {
      const { payload } = action;

      const id = Math.random().toString(16).substring(2);

      state.messages.push({
        id,
        type: EMessageType.Default,
        contentType: EContentType.Text,
        ...payload,
      });
    },
    removeGlobalMessage: (state, { payload }) => {
      const index = state.messages.findIndex(({ id }) => id === payload);

      state.messages.splice(index, 1);
    },
  },
});

export const { createGlobalMessage, removeGlobalMessage } = globalMessagesSlice.actions;

export default globalMessagesSlice.reducer;
