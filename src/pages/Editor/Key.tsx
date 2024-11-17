import React, { useState, useRef, Fragment, useEffect } from 'react';
import { IKeyValue, IProjectLanguage } from 'interfaces';
import { useSelector } from 'react-redux';

import { updateKey } from 'api/projects';
import { IRootState } from 'store';

import './Key.scss';

interface IProps {
  id: string;
  label: string;
  values: {
    [key: string]: IKeyValue;
  },
  projectId: string;
  parentId: string;
  languages: IProjectLanguage[];
  description: string;
  onKeyNameClick?: (keyId: string) => void
  onLanguageClick?: (languageId: string) => void
}

export default function Key(props: IProps) {
  const {
    id,
    label,
    languages,
    values: valuesFromProps,
    projectId,
    parentId,
    description,
    onKeyNameClick = () => {},
    onLanguageClick = () => {},
  } = props;

  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(valuesFromProps || {});
  const [editValueId, setEditValueId] = useState('');

  const { id: userId } = useSelector((state: IRootState) => state.user);

  const keyEditValueFieldRef = useRef<HTMLTextAreaElement>(null);

  const handleValueChange = ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>, valueLanguageId: string) => {
    if (values && values[valueLanguageId] && values[valueLanguageId].value) {
      values[valueLanguageId].value = value;
    } else {
      values[valueLanguageId] = {
        languageId: valueLanguageId,
        value,
        keyId: id,
        projectId,
        parentId,
      };
    }

    setValues(structuredClone(values));
  };

  const handleValueSave = async () => {
    setLoading(true);

    const preparedValues = Object.entries(values).map(([_key, keyValue]) => keyValue);

    const result = await updateKey({
      id,
      label,
      projectId,
      parentId,
      userId: userId as string,
      values: preparedValues,
      description,
    });

    if ('error' in result) {
      alert(result.message);
    } else {
      setValues(result.values);
    }

    setEditValueId('');
    setLoading(false);
  };

  const handleValueNameClick = (e: React.MouseEvent<HTMLSpanElement>, languageId: string) => {
    e.preventDefault();
    setEditValueId(languageId);
  };

  useEffect(() => {
    if (editValueId.length > 0 && keyEditValueFieldRef && keyEditValueFieldRef.current) {
      keyEditValueFieldRef.current.focus();

      const { length } = keyEditValueFieldRef.current.value;
      keyEditValueFieldRef.current.setSelectionRange(length, length);
    }
  }, [editValueId]);

  const handleKeyNameClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    onKeyNameClick(id);
  };

  const handleLanguageNameClick = (languageId: string) => {
    onLanguageClick(languageId);
  };

  const handleValueEditCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditValueId('');
  };

  return (
    <section className="key">
      <div className="keyHeader">
        <button
          type="button"
          className="keyName"
          title={description}
          data-click-target="keyName"
          data-key-id={id}
        >{label}</button>
      </div>
      <div className="keyContent">
        {languages && languages.map((language: IProjectLanguage, idx) => {
          if (!language.visible) {
            return null;
          }

          return (
            <Fragment key={language.id}>
              <div className="keyContent-lang">
                <span
                  data-click-target="keyLanguage"
                  data-language-id={language.id}
                >{language.customLabelEnabled ? language.customLabel : language.label}</span>
              </div>

              <div className="keyContent-value">
                {language.id !== editValueId && (
                  <span className="keyContent-valueName" onClick={(e) => handleValueNameClick(e, language.id)}>
                    {values && values[language.id] && values[language.id].value}
                  </span>
                )}

                {language.id === editValueId && (
                  <div className="keyEdit">
                    {loading && <div className="loading" />}
                    <div className="keyEdit-valueFieldBox">
                      <textarea
                        ref={keyEditValueFieldRef}
                        className="textarea keyEdit-valueField"
                        value={values && values[language.id] && values[language.id].value}
                        onChange={(e) => handleValueChange(e, language.id)}
                      />
                      <span className="keyEdit-valueSymbolsCount">1024</span>
                    </div>

                    <div className="keyEdit-controls">
                      <button
                        type="button"
                        className="button primary keyEdit-saveButton"
                        onClick={handleValueSave}
                      >
                        Save
                      </button>

                      <button
                        type="button"
                        className="button secondary keyEdit-cancelButton"
                        onClick={handleValueEditCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
