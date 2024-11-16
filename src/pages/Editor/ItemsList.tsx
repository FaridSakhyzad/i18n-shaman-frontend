import React, { Fragment, useEffect, useState } from 'react';
import { IKey, IKeyValue, IProjectLanguage } from 'interfaces';
import Key from './Key';
import Component from './Component';
import Folder from './Folder';

interface IProps {
  keys: IKey[],
  values: {
    [ keyId: string ]: {
      [languageId: string]: IKeyValue;
    }
  },
  parentId: string,
  projectId: string,
  languages: IProjectLanguage[];
}

export default function ItemsList({
  keys = [],
  values = {},
  parentId,
  projectId,
  languages,
}: IProps) {
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
              />
            </Fragment>
          );
        }

        if (key.type === 'component') {
          return (
            <Fragment key={key.id}>
              <Component
                id={key.id}
                label={key.label}
                projectId={projectId}
                languages={languages}
                description={key.description}
              />
            </Fragment>
          );
        }

        if (key.type === 'folder') {
          return (
            <Fragment key={key.id}>
              <Folder
                id={key.id}
                label={key.label}
                projectId={projectId}
                languages={languages}
                description={key.description}
              />
            </Fragment>
          );
        }

        return null;
      })}
    </section>
  );
}
