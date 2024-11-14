import React, { useState, Fragment } from 'react';
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
    description,
    onKeyNameClick = () => {},
    onLanguageClick = () => {},
  } = props;

  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(valuesFromProps);
  const [editValueId, setEditValueId] = useState('');

  const { id: userId } = useSelector((state: IRootState) => state.user);

  const handleValueChange = ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>, valueLanguageId: string) => {
    if (values[valueLanguageId] && values[valueLanguageId].value) {
      values[valueLanguageId].value = value;
    } else {
      values[valueLanguageId] = {
        languageId: valueLanguageId,
        value,
        keyId: id,
        projectId,
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
      userId: userId as string,
      values: preparedValues,
      description,
    });

    setEditValueId('');
    setLoading(false);
  };

  const handleValueNameClick = (e: React.MouseEvent<HTMLSpanElement>, languageId: string) => {
    e.preventDefault();
    setEditValueId(languageId);
  };

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
        <button type="button" className="keyName" onClick={handleKeyNameClick} title={description}>{label}</button>
      </div>
      <div className="keyContent">
        {languages && languages.map((language: IProjectLanguage, idx) => {
          if (!language.visible) {
            return null;
          }

          return (
            <Fragment key={language.id}>
              <div className="keyContent-lang">
                <span onClick={() => handleLanguageNameClick(language.id)}>{language.label}</span>
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
