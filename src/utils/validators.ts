import { IKey } from '../interfaces';

export enum EEntityValidationErrors {
  DUPLICATE_KEY = 'Key name already exist. Please Enter Unique Key Name',
}

export enum EPasswordValidationErrors {
  INVALID = 'Error: Invalid Password',
  TOO_SHORT = 'Error: Password is too short',
  TOO_WEAK = 'Error: Password is too weak',
  PASSWORDS_DONT_MATCH = 'Error: Passwords don\'t match.',
}

export enum EEmailValidationErrors {
  INVALID = 'Error: Invalid Email address',
}

export type CombinedValidationMessage = EEmailValidationErrors | EPasswordValidationErrors | EEntityValidationErrors;

interface IValidationResponseError {
  message: CombinedValidationMessage;
}

interface IValidationResponse {
  success: Boolean,
  errors: IValidationResponseError[],
  warnings?: any[],
}

export const validateKeyName = (label: string, id: string | null, parentId: string | null, keys: IKey[]): IValidationResponse => {
  const errors: IValidationResponseError[] = [];

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];

    if (key.label === label && key.parentId === parentId && id !== key.id) {
      errors.push({
        message: EEntityValidationErrors.DUPLICATE_KEY,
      });

      break;
    }
  }

  return {
    success: errors.length > 0,
    errors,
  };
};

export const validateEmail = (email: string): IValidationResponse => {
  const errors: IValidationResponseError[] = [];

  if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
    errors.push({
      message: EEmailValidationErrors.INVALID,
    });
  }

  return {
    success: errors.length < 1,
    errors,
  };
};

export const validatePassword = (password: string): IValidationResponse => {
  const errors: IValidationResponseError[] = [];

  if (password.length < 6) {
    errors.push({
      message: EPasswordValidationErrors.TOO_SHORT,
    });
  }

  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{6,}$/.test(password)) {
    errors.push({
      message: EPasswordValidationErrors.TOO_WEAK,
    });
  }

  return {
    success: errors.length < 1,
    errors,
  };
};
