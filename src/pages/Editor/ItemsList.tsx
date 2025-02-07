import React, { Fragment } from 'react';
import { PROJECT_ITEMS_MAX_DEPTH } from 'constants/app';
import { IKey, IKeyValue, IProjectLanguage } from 'interfaces';
import Key from './Key';
// eslint-disable-next-line import/no-cycle
import FolderComponent from './Folder';

interface IProps {
  keys: IKey[],
  values?: {
    [ keyId: string ]: {
      [languageId: string]: IKeyValue;
    }
  },
  parentId: string,
  projectId: string,
  languages: IProjectLanguage[];
  path: string;
  pathCache: string;
  iteration?: number;
}

export default function ItemsList({
  keys = [],
  values = {},
  parentId,
  projectId,
  languages,
  path,
  pathCache,
  iteration = 0,
}: IProps) {
  if (iteration > PROJECT_ITEMS_MAX_DEPTH) {
    return null;
  }

  return (
    <section className="itemsList">
      {keys.map((key: IKey) => {
        if (key.type === 'string') {
          return (
            <Fragment key={key.id}>
              <Key
                id={key.id}
                label={key.label}
                projectId={projectId}
                parentId={parentId}
                values={values ? values[key.id] : {}}
                languages={languages}
                description={key.description}
                path={path}
                pathCache={pathCache}
              />
            </Fragment>
          );
        }

        if (key.type === 'component') {
          return (
            <Fragment key={key.id}>
              <FolderComponent
                id={key.id}
                label={key.label}
                type={key.type}
                keys={key.children || []}
                projectId={projectId}
                languages={languages}
                description={key.description}
                iteration={iteration}
                path={path}
                pathCache={pathCache}
              />
            </Fragment>
          );
        }

        if (key.type === 'folder') {
          return (
            <Fragment key={key.id}>
              <FolderComponent
                id={key.id}
                label={key.label}
                type={key.type}
                keys={key.children || []}
                projectId={projectId}
                languages={languages}
                description={key.description}
                iteration={iteration}
                path={path}
                pathCache={pathCache}
              />
            </Fragment>
          );
        }

        return null;
      })}
    </section>
  );
}
