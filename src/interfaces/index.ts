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

export interface ILanguage {
  id: string,
  label: string,
  code: string,
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
  languages: [ILanguage];
}

export interface IProjectUpdateError {
  message: string;
  error: string;
  statusCode: number;
}
