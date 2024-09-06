import React, { useState, Fragment } from 'react';
import { IKeyValue, ILanguage } from '../../interfaces';
import { updateKey } from '../../api/projects';

import './Key.scss';

interface IProps {
  id: string;
  label: string;
  values: [IKeyValue],
  languages: [ILanguage];
}

interface IKeyValueMapItem extends IKeyValue {
  index: number;
}

export default function Key(props: IProps) {
  const {
    id,
    label,
    languages,
    values: valuesFromProps,
  } = props;

  const generateValuesMap = () => {
    const valuesMap = {} as { [key: string]: IKeyValueMapItem };

    for (let i = 0; i < valuesFromProps.length; i += 1) {
      if (valuesFromProps[i]) {
        valuesMap[valuesFromProps[i].languageId] = {
          ...valuesFromProps[i],
          index: i,
        };
      }
    }

    return valuesMap;
  };

  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState(generateValuesMap());

  const getValuesArray = () => {
    const valuesArray = [] as IKeyValueMapItem[];

    Object.keys(values).forEach((key) => {
      const { index } = values[key];

      valuesArray[index] = values[key];
    });

    return valuesArray;
  };

  const handleValueChange = ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>, valueLanguageId: string, idx: number) => {
    if (values[valueLanguageId] && values[valueLanguageId].value) {
      values[valueLanguageId].value = value;
    } else {
      values[valueLanguageId] = {
        index: idx,
        languageId: valueLanguageId,
        value,
      };
    }

    setValues(structuredClone(values));
  };

  const handleValueSave = async () => {
    setLoading(true);

    const result = await updateKey({
      id,
      label,
      values: getValuesArray(),
    });

    console.log('result', result);

    setLoading(false);
  };

  const handleKeyNameClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const handleValueEditCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  return (
    <section className="key">
      <div className="keyHeader">
        <button type="button" className="keyName" onClick={handleKeyNameClick}>{label}</button>
      </div>
      <div className="keyContent">
        {languages && languages.map((language: ILanguage, idx) => {
          return (
            <Fragment key={language.id}>
              <div className="keyContent-lang">
                {language.label}
              </div>

              <div className="keyContent-value">
                <span className="keyContent-valueName">
                  {values && values[language.id] && values[language.id].value}
                </span>

                <div className="keyEdit">
                  {loading && <div className="loading" />}
                  <div className="keyEdit-valueFieldBox">
                    <textarea
                      className="textarea keyEdit-valueField"
                      value={values && values[language.id] && values[language.id].value}
                      onChange={(e) => handleValueChange(e, language.id, idx)}
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
              </div>
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
