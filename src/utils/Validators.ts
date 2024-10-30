import { IKey } from '../interfaces';

interface IValidationError {
  [key: string]: string;
}

export const validationErrors: IValidationError = {
  DUPLICATE_KEY_ERROR: 'Key name already exist. Please Enter Unique Key Name',
};

export const validateKeyName = (label: string, id: string | null, keys: IKey[]) => {
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];

    if (key.label === label && id !== key.id) {
      return {
        error: 'DUPLICATE_KEY_ERROR',
      };

      break;
    }
  }

  return {};
};
