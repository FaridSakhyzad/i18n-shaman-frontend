import React, { useState } from 'react';
import { IKeyValue, ILanguage } from './interfaces';
import { updateKey } from '../../api/projects';

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
      valuesMap[valuesFromProps[i].languageId] = {
        ...valuesFromProps[i],
        index: i,
      };
    }

    return valuesMap;
  };

  const [values, setValues] = useState(generateValuesMap());

  const getValuesArray = () => {
    const valuesArray = [] as IKeyValueMapItem[];

    Object.keys(values).forEach((key) => {
      const { index } = values[key];

      valuesArray[index] = values[key];
    });

    return valuesArray;
  };

  const handleValueChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>, valueLanguageId: string, idx: number) => {
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
    const result = await updateKey({
      id,
      label,
      values: getValuesArray(),
    });

    console.log(result, result);
  };

  return (
    <div className="row">
      <div className="col-2">
        <strong>Key: {label}</strong>
      </div>
      <div className="col-6 row">
        {languages && languages.map((language: ILanguage, idx) => {
          return (
            <div key={language.id} className="row">
              <div className="col">
                {language.label}
              </div>

              <div className="col">
                <input
                  type="text"
                  onChange={(e) => handleValueChange(e, language.id, idx)}
                  value={values && values[language.id] && values[language.id].value}
                  data-index={(values && values[language.id] && values[language.id].index) || idx}
                />
              </div>

              <div className="col">
                <button type="button" onClick={() => handleValueSave()}>Save Value</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
