export interface IError {
  message: string;
  error: string;
  statusCode: number;
}

export interface IKeyValue {
  languageId: string;
  value: string;
}

export interface IKey {
  projectId: string;
  id: string;
  label: string;
  values: [IKeyValue];
  description: string;
}

export interface IKeyUpdateError extends IError {}

export interface ILanguage {
  id: string,
  label: string,
  code: string
}

export interface IProjectLanguage extends ILanguage {
  baseLanguage: boolean,
  visible: boolean,
  customCodeEnabled?: boolean,
  customLabelEnabled?: boolean,
  customCode?: string,
  customLabel?: string,
}

export interface IProject {
  projectName: string;
  projectId: string;
  userId: string;
  keys: [IKey];
  languages: [IProjectLanguage];
}

export interface IProjectUpdateError extends IError {}

export interface IUserLanguagesMapItem {
  [key: string]: IProjectLanguage;
}
