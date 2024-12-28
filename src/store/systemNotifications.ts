import { createAppSlice } from './user';
import { DEFAULT_SYSTEM_MESSAGE_DURATION } from '../constants/app';

export enum EMessageType {
  Default = 'default',
  Info = 'info',
  Attention = 'attention',
  Warning = 'warning',
  Success = 'success',
  Error = 'error',
  Custom = 'custom',
}

export enum EContentType {
  Text = 'text',
  Html = 'html',
  Component = 'component',
}

export interface IMessage {
  id: string;
  type: EMessageType;
  duration?: number | 'infinity',
  contentType?: EContentType;
  content?: string;
  component?: string;
  componentProps?: Record<string, any>;
}

interface IInitialState {
  messages: IMessage[],
}

const initialState: IInitialState = {
  messages: [],
};

const systemNotificationsSlice = createAppSlice({
  name: 'systemNotifications',
  initialState,
  reducers: {
    createSystemMessage: (state, action: { payload: any, type: string }) => {
      const { payload } = action;

      const id = Math.random().toString(16).substring(2);

      state.messages.push({
        id,
        type: EMessageType.Default,
        contentType: EContentType.Text,
        duration: DEFAULT_SYSTEM_MESSAGE_DURATION,
        ...payload,
      });

      // eslint-disable-next-line no-param-reassign
      action.payload.id = id;
    },
    removeSystemMessage: (state, { payload }) => {
      const index = state.messages.findIndex(({ id }) => id === payload);

      state.messages.splice(index, 1);
    },
  },
});

export const { createSystemMessage, removeSystemMessage } = systemNotificationsSlice.actions;

export default systemNotificationsSlice.reducer;
