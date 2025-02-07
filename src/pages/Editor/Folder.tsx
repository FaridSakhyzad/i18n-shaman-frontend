import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import clsx from 'clsx';

import { IRootState } from 'store';
import { getComponentData } from 'api/projects';
import { ROOT } from 'constants/app';
import { EntityType, IKey, IKeyValue, IProjectLanguage } from 'interfaces';

// eslint-disable-next-line import/no-cycle
import ItemsList from './ItemsList';

import './Key.scss';

interface IProps {
  id: string;
  label: string;
  type: EntityType;
  projectId: string;
  keys?: IKey[];
  description: string;
  languages: IProjectLanguage[];
  path: string;
  pathCache: string;
  iteration?: number;
}

export default function FolderComponent({
  id,
  label,
  type,
  projectId,
  keys: initialKeys = [],
  description,
  languages,
  path,
  pathCache,
  iteration = 0,
}: IProps) {
  const { id: userId } = useSelector((state: IRootState) => state.user);

  const [keys, setKeys] = useState<IKey[]>(initialKeys);
  const [isExpanded, setIsExpanded] = useState(initialKeys.length > 0);
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
    <section
      className={clsx({
        key: true,
        key_folder: type === 'folder',
        key_component: type === 'component',
        isOpen: isExpanded,
      })}
      data-path={`${ROOT}/${path !== ROOT ? `${path}/` : ''}${label}`}
    >
      <div className="keyHeader">
        <i className={`keyHeader-expandIcon ${isExpanded ? 'expanded' : ''}`} onClick={handleExpandIconClick} />
        <button
          type="button"
          className="keyName"
          title={description}
          data-click-target="keyName"
          data-key-id={id}
        >
          {label}
        </button>

        <div className="keyHeader-controls">
          <div className="keyHeader-controlsGroup">
            <button
              type="button"
              className="buttonInline keyHeader-control keyHeader-createKey"
              data-click-target="newEntity"
              data-parent-id={id}
              data-parent-path={`${pathCache}/${id}`}
              aria-label="Create New Key"
            />

            <button
              type="button"
              className="buttonInline keyHeader-control keyHeader-createFolder"
              data-click-target="newEntity"
              data-parent-id={id}
              data-parent-path={`${pathCache}/${id}`}
              aria-label="Create New Folder"
            />
          </div>

          <div className="keyHeader-controlsGroup">
            <button
              type="button"
              className="buttonInline keyHeader-control keyHeader-edit"
              data-click-target="editEntity"
              data-id={id}
              aria-label="Edit"
            />

            <button
              type="button"
              className="buttonInline keyHeader-control keyHeader-move"
              data-click-target="moveEntity"
              data-id={id}
              aria-label="Move"
            />
          </div>

          <div className="keyHeader-controlsGroup">
            <button
              type="button"
              className="buttonInline keyHeader-control keyHeader-delete"
              data-click-target="deleteEntity"
              data-id={id}
              aria-label="Delete"
            />
          </div>
        </div>
      </div>

      {(keys.length > 0 && isExpanded) && (
        <div className="keyContent">
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
