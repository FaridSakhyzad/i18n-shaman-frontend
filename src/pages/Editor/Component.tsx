import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';

import { IRootState } from 'store';
import { getComponentData } from 'api/projects';
import { ROOT } from 'constants/app';
import { IKey, IKeyValue, IProjectLanguage } from 'interfaces';


import ItemsList from './ItemsList';

import './Key.scss';
import './Component.scss';

interface IProps {
  id: string;
  label: string;
  projectId: string;
  keys?: IKey[];
  description: string;
  languages: IProjectLanguage[];
  path: string;
  pathCache: string;
  iteration?: number;
}

export default function Component({
  id,
  label,
  projectId,
  keys: initialKeys = [],
  description,
  languages,
  path,
  pathCache,
  iteration = 0
}: IProps) {
  const { id: userId } = useSelector((state: IRootState) => state.user);

  const [isExpanded, setIsExpanded] = useState(initialKeys.length > 0);
  const [keys, setKeys] = useState<IKey[]>(initialKeys);
  const [keyValues, setKeyValues] = useState<{ [parentId: string]: { [languageId: string]: IKeyValue } }>({});

  const handleExpandIconClick = async () => {
    setIsExpanded(!isExpanded);

    if (keys.length > 0 && Object.keys(keyValues).length > 0) {
      return;
    }

    const result = await getComponentData({
      userId: userId as string,
      projectId,
      componentId: id,
    });

    const { keys: newKeys = [], values: newValues = {} } = result;

    setKeyValues(newValues);
    setKeys(newKeys);
  };

  return (
    <section className="key">
      <div className="keyHeader">
        <i className={`keyHeader-expandIcon ${isExpanded ? 'expanded' : ''}`} onClick={handleExpandIconClick}/>
        <button
          type="button"
          className="componentName"
          title={description}
          data-click-target="keyName"
          data-key-id={id}
        >
          {/* {path !== ROOT ? `${path}/` : ''}{label} */}
          {label}
        </button>
        <button
          type="button"
          className="button danger componentDelete"
          data-click-target="deleteEntity"
          data-id={id}
        >
          Delete
        </button>

        <button
          type="button"
          className="button success componentCreateNew"
          data-click-target="newEntity"
          data-parent-id={id}
          data-parent-path={`${pathCache}/${id}`}
        >
          New
        </button>
      </div>
      {(keys.length > 0 && isExpanded) && (
        <div className="componentContent">
          <ItemsList
            keys={keys}
            values={keyValues}
            parentId={id}
            projectId={projectId}
            languages={languages}
            iteration={1 + iteration}
            path={`${path !== ROOT ? `${path}/` : ''}${label}`}
            pathCache={`${pathCache}/${id}`}
          />
        </div>
      )}
    </section>
  );
}
