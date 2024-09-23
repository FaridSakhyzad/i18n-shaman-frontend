export interface IKeyValue {
  languageId: string;
  value: string;
}

export interface IKey {
  projectId: string;
  id: string;
  label: string;
  values: [IKeyValue];
}

export interface ILanguage {
  id: string,
  label: string,
  code: string,
  baseLanguage: boolean,
}

export interface IProject {
  projectName: string;
  projectId: string;
  userId: string;
  keys: [IKey];
  languages: [ILanguage];
}

export interface IDeleteError {
  message: string;
  error: string;
  statusCode: number;
}
