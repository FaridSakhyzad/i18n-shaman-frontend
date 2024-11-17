import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';

import { IRootState } from 'store';
import { getComponentData } from 'api/projects';
import { IKey, IKeyValue, IProjectLanguage } from 'interfaces';

import Key from './Key';

import './Key.scss';
import './Component.scss';
import ItemsList from './ItemsList';

interface IProps {
  id: string;
  label: string;
  projectId: string;
  description: string;
  languages: IProjectLanguage[];
  onComponentNameClick?: (componentId: string) => void;
  onKeyNameClick?: (keyId: string) => void
  onLanguageClick?: (languageId: string) => void
}

export default function Component({
  id,
  label,
  projectId,
  description,
  languages,
  onComponentNameClick = () => {},
  onKeyNameClick = () => {},
  onLanguageClick = () => {},
}: IProps) {
  const { id: userId } = useSelector((state: IRootState) => state.user);

  const [isExpanded, setIsExpanded] = useState(false);
  const [keys, setKeys] = useState<IKey[]>([]);
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
        <i className={`keyHeader-expandIcon ${isExpanded ? 'expanded' : ''}`} onClick={handleExpandIconClick} />
        <button
          type="button"
          className="componentName"
          title={description}
          data-click-target="keyName"
          data-key-id={id}
        >{label}</button>
      </div>
      {(keys.length > 0 && isExpanded) && (
        <div className="componentContent">
          <ItemsList
            keys={keys}
            values={keyValues}
            parentId={id}
            projectId={projectId}
            languages={languages}
          />
        </div>
      )}
    </section>
  );
}
