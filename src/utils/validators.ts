import { IKey } from '../interfaces';

export enum EEntityValidationErrors {
  DUPLICATE_KEY = 'Key name already exist. Please Enter Unique Key Name',
}

export enum EPasswordValidationErrors {
  TOO_SHORT = 'Error: Password is too short',
  TOO_WEAK = 'Error: Password is too weak',
  PASSWORDS_DONT_MATCH = 'Error: Passwords don\'t match.',
}

export const validateKeyName = (label: string, id: string | null, parentId: string | null, keys: IKey[]): { error?: EEntityValidationErrors } => {
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];

    if (key.label === label && key.parentId === parentId && id !== key.id) {
      return {
        error: EEntityValidationErrors.DUPLICATE_KEY,
      };

      break;
    }
  }

  return {};
};

export const validatePassword = (password: string): { error?: EPasswordValidationErrors } => {
  if (password.length < 3) {
    return {
      error: EPasswordValidationErrors.TOO_SHORT,
    };
  }

  return {};
};
