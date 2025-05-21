import React, {
  useState,
  useRef,
  Fragment,
  useEffect,
} from 'react';

import { EntityType, IKeyValue, IProjectLanguage } from 'interfaces';
import { useSelector, useDispatch } from 'react-redux';

import { createSystemMessage, EMessageType } from 'store/systemNotifications';

import { updateKey } from 'api/projects';
import { IRootState } from 'store';

import './Key.scss';
import { ROOT } from '../../constants/app';

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
  path?: string;
  pathCache: string;
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
    path = null,
    pathCache,
  } = props;

  const dispatch = useDispatch();

  const { keyValues: valuesFromState } = useSelector((state: IRootState) => state.search);
  const { id: userId } = useSelector((state: IRootState) => state.user);

  const [loading, setLoading] = useState(false);

  const getInitialValues = () => {
    if (valuesFromState && valuesFromState[id]) {
      return { ...valuesFromState[id] };
    }

    if (valuesFromProps) {
      return valuesFromProps;
    }

    return {};
  };

  const [values, setValues] = useState(getInitialValues());
  const [editValueId, setEditValueId] = useState('');

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
        pathCache: `${pathCache}/${id}`,
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
      dispatch(createSystemMessage({
        content: 'Error While Saving Key',
        type: EMessageType.Error,
      }));
    } else {
      setValues(result.values);

      dispatch(createSystemMessage({
        content: 'Key Saved Successfully',
        type: EMessageType.Success,
      }));
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

  const handleValueEditCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEditValueId('');
  };

  return (
    <section className="key key_string">
      <div className="keyHeader">
        <input type="checkbox" className="checkbox keySelectCheckbox" />
        <button
          type="button"
          className="keyName"
          title={description}
          data-click-target="keyName"
          data-id={id}
          data-path={`${ROOT}/${path !== ROOT ? `${path}/` : ''}${label}`}
        >
          {label}
        </button>

        <div className="keyHeader-controls">
          <div className="keyHeader-controlsGroup">
            <button
              type="button"
              className="_entity-edit buttonInline keyHeader-control keyHeader-edit"
              data-click-target="editEntity"
              data-entity-type={EntityType.String}
              data-id={id}
              aria-label="Edit"
            />

            {/*
              <button
                type="button"
                className="_entity-move buttonInline keyHeader-control keyHeader-move"
                data-click-target="moveEntity"
                data-id={id}
                aria-label="Move"
              />
            */}
          </div>

          <div className="keyHeader-controlsGroup">
            <button
              type="button"
              className="_entity-delete buttonInline keyHeader-control keyHeader-delete"
              data-click-target="deleteEntity"
              data-id={id}
              aria-label="Delete"
            />
          </div>
        </div>
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
                >
                  {language.customLabelEnabled ? language.customLabel : language.label}
                </span>
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
                      <span className="keyEdit-valueSymbolsCount">
                        {(values[language.id] && values[language.id].value) ? values[language.id].value.length : 0}
                      </span>
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
