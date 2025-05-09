import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changeLanguage } from 'i18next';
import { useTranslation } from 'react-i18next';

import { AppDispatch, IRootState } from 'store';
import { getProjects } from 'store/projects';
import { setValues } from 'store/search';

import { ROOT } from 'constants/app';
import { EntityType, IKey, IProject } from 'interfaces';
import {
  deleteProjectEntity,
  exportProjectToJson,
  getUserProjectsById,
  importDataToProject,
} from 'api/projects';
import { search } from 'api/search';

import ProjectLanguages from 'components/ProjectLanguages';
import AddProjectLanguage from 'components/AddProjectLanguage';
import CreateKey from 'components/CreateKey';
import EditEntity from 'components/EditEntity';
import EditProjectLanguage from 'components/EditProjectLanguage';
import ImportLocales from 'components/ImportLocales';
import ImportComponents from 'components/ImportComponents';
import Tooltip from 'components/Tooltip';
import { createSystemMessage, EMessageType } from 'store/systemNotifications';

import { debounce } from 'utils/utils';

import ItemsList from './ItemsList';

import './Editor.scss';
import Modal from '../../components/Modal';

interface IProjectsMenuCoords {
  top: number;
  left: number;
}

export default function Editor() {
  const { t } = useTranslation();

  const dispatch = useDispatch<AppDispatch>();

  const { id: userId } = useSelector((state: IRootState) => state.user);
  const { projectId: currentProjectId = '' } = useParams();

  const { projects } = useSelector((state: IRootState) => state.projects);

  const [project, setProject] = useState<IProject | null>(null);

  const [isCreateKeyModalVisible, setIsCreateKeyModalVisible] = useState<boolean>(false);
  const [newEntityParentId, setNewEntityParentId] = useState<string>();
  const [newEntityType, setNewEntityType] = useState<EntityType>();
  const [newEntityPath, setNewEntityPath] = useState<string>();

  const [isProjectsMenuVisible, setIsProjectsMenuVisible] = useState<boolean>(false);
  const [projectsMenuCoords, setProjectsMenuCoords] = useState<IProjectsMenuCoords>();

  const [isLanguagesModalVisible, setIsLanguagesModalVisible] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [isAddLanguageModalVisible, setAddLanguageModalVisible] = useState<boolean>(false);

  const fetchProjectData = async () => {
    setLoading(true);

    const result = await getUserProjectsById(currentProjectId);

    if ('error' in result) {
      console.error(result.message);
    } else {
      setProject(result);
    }

    setLoading(false);
  };

  useEffect(() => {
    dispatch(getProjects(userId as string));
    fetchProjectData();
  }, [currentProjectId]);

  const handleAddLanguageClick = async () => {
    setAddLanguageModalVisible(true);
  };

  const handleNewKeyClick = (type: EntityType) => {
    setNewEntityType(type);
    setNewEntityParentId(currentProjectId);
    setNewEntityPath(ROOT);
    setIsCreateKeyModalVisible(true);
  };

  const handleProjectNameClick = ({ currentTarget }: React.MouseEvent<HTMLElement>) => {
    setIsProjectsMenuVisible(!isProjectsMenuVisible);

    if (!isProjectsMenuVisible) {
      const { top, left, height } = currentTarget.getBoundingClientRect();

      setProjectsMenuCoords({ top: top + height, left });
    }
  };

  const handleProjectListNameClick = () => {
    setIsProjectsMenuVisible(false);
  };

  const handleProjectLanguagesButtonClick = () => {
    setIsLanguagesModalVisible(true);
  };

  const [inEditLanguageId, setInEditLanguageId] = useState<string | null>(null);
  const [isLanguageEditModalVisible, setIsLanguageEditModalVisible] = useState<boolean>(false);

  const onLanguageEdit = (languageId: string) => {
    setInEditLanguageId(languageId);
    setIsLanguageEditModalVisible(true);
  };

  const onLanguageClick = (languageId: string) => {
    setInEditLanguageId(languageId);
    setIsLanguageEditModalVisible(true);
  };

  const [inEditKeyId, setInEditKeyId] = useState<string>();
  const [inEditEntityType, setInEditEntityType] = useState<EntityType>();
  const [isEditKeyModalVisible, setIsEditKeyModalVisible] = useState<boolean>(false);

  const onKeyNameClick = (keyId: string) => {
    setInEditKeyId(keyId);
    setIsEditKeyModalVisible(true);
  };

  const handleExportClick = async () => {
    if (!project) {
      return;
    }

    const { projectId, projectName } = project;

    const response = await exportProjectToJson(projectId as string);

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const $link = document.createElement('a');
    $link.href = url;
    $link.download = `${projectName}.zip`;

    document.body.appendChild($link);

    $link.click();
    $link.remove();

    window.URL.revokeObjectURL(url);
  };

  const getLanguagesButtonTitle = (): string => {
    const { languages = [] } = project || {};

    const visibleLanguagesCount = languages.filter((lang) => lang.visible).length;

    if (visibleLanguagesCount !== languages.length) {
      return `Languages (${visibleLanguagesCount} of ${languages.length})`;
    }

    return `All Languages (${languages.length})`;
  };

  const handleExportFieldChange = async ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const { files }: { files: FileList | null } = target;

    if (!files) {
      return;
    }

    const { projectId } = project || {};

    const formData = new FormData();

    formData.append('projectId', projectId as string);

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    const result = await importDataToProject(formData);

    console.log('result', result);
  };

  const handleChangeLanguageClick = () => {
    changeLanguage('fr');
  };

  const [idOfEntityToDelete, setIdOfEntityToDelete] = useState<string | null>(null);

  const deleteEntity = async (id: string) => {
    const result = await deleteProjectEntity(id);

    if ('error' in result) {
      dispatch(createSystemMessage({
        content: result.message || 'Error Deleting Entity',
        type: EMessageType.Error,
      }));
    } else {
      fetchProjectData();
    }
  };

  const [isEntityDeleteConfirmVisible, setEntityDeleteConfirmVisible] = useState<boolean>(false);

  const renderDeleteConfirmationModal = () => {
    const handleDeleteConfirmationCloseButtonClick = () => {
      setEntityDeleteConfirmVisible(false);
    };

    const handleDeleteConfirmationCancelButtonClick = () => {
      setEntityDeleteConfirmVisible(false);
    };

    const handleDeleteConfirmationConfirmButtonClick = () => {
      if (!idOfEntityToDelete) {
        return;
      }

      deleteEntity(idOfEntityToDelete);

      setEntityDeleteConfirmVisible(false);
    };

    return (
      <Modal customClassNames="dialogModal">
        <div className="modal-header">
          <h4 className="modal-title">Delete Key/Folder</h4>

          <button
            type="button"
            className="modal-closeButton"
            onClick={handleDeleteConfirmationCloseButtonClick}
            aria-label="Close modal"
          />
        </div>

        <div className="modal-content">
          <div className="dialogModal-content">
            <i className="dialogBadge question danger dialogModal-badge" />
            <div className="dialogModal-contentText">
              <p className="dialogModal-contentPara">Are you sure you want to Delete Key/Folder and all it’s contents?<b>Warning: This action can not be reverted.</b></p>
            </div>
          </div>
        </div>

        <div className="modal-buttonBox">
          <button
            type="button"
            className="button secondary dialogModal-button"
            onClick={handleDeleteConfirmationCancelButtonClick}
          >
            Cancel
          </button>
          <button
            type="button"
            className="button danger dialogModal-button"
            onClick={handleDeleteConfirmationConfirmButtonClick}
          >
            Delete
          </button>
        </div>
      </Modal>
    );
  };

  const handleItemsListClickEvent = (e: React.SyntheticEvent<HTMLElement>) => {
    const { target } = e;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (!target.hasAttribute('data-click-target')) {
      return;
    }

    const { dataset } = target;

    const { clickTarget: elName } = dataset;

    if (elName === 'keyName') {
      onKeyNameClick(dataset.id as string);
    }

    if (elName === 'keyLanguage') {
      onLanguageClick(dataset.languageId as string);
    }

    if (elName === 'newEntity') {
      setNewEntityType(dataset.newEntityType as EntityType);
      setNewEntityPath(dataset.parentPath as string);
      setNewEntityParentId(dataset.parentId as string);
      setIsCreateKeyModalVisible(true);
    }

    if (elName === 'editEntity') {
      setInEditKeyId(dataset.id as string);
      setIsEditKeyModalVisible(true);
      setInEditEntityType(dataset.entityType as EntityType);
    }

    if (elName === 'deleteEntity') {
      setIdOfEntityToDelete(dataset.id as string);
      setEntityDeleteConfirmVisible(true);
    }
  };

  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [exactMatch, setExactMatch] = useState<boolean>(false);

  const [searchInKeys, setSearchInKeys] = useState<boolean>(true);
  const [searchInValues, setSearchInValues] = useState<boolean>(true);
  const [searchInFolders, setSearchInFolders] = useState<boolean>(true);
  const [searchInComponents, setSearchInComponents] = useState<boolean>(true);

  const [searchResultKeys, setSearchResultKeys] = useState<IKey[] | null>(null);

  const applySearchParams = async (value: string, caseSensitive: boolean, exactMatch: boolean) => {
    if (!value || value.length < 1) {
      setSearchQuery(null);
      setSearchResultKeys(null);
      dispatch(setValues(null));

      return;
    }

    setSearchQuery(value);

    setSearchResultKeys(null);
    dispatch(setValues(null));

    const searchResultData = await search({
      projectId: project?.projectId as string,
      query: encodeURIComponent(value),
      caseSensitive,
      exact: exactMatch,
      searchInKeys,
      searchInValues,
      searchInFolders,
      searchInComponents,
    });

    const { keys = [], values } = searchResultData;

    setSearchResultKeys([...keys]);

    dispatch(setValues({ ...values }));
  };

  const handleSearchQueryChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => applySearchParams(e.target.value, caseSensitive, exactMatch), 1000);

  const handleCasingClick = () => {
    setCaseSensitive(!caseSensitive);
    applySearchParams(searchQuery || '', !caseSensitive, exactMatch);
  };

  const handleExactMatchClick = () => {
    setExactMatch(!exactMatch);
    applySearchParams(searchQuery || '', caseSensitive, !exactMatch);
  };

  const [isImportLocalesModalVisible, setImportLocalesModalVisible] = useState<boolean>(false);

  const handleImportLocalesClick = () => {
    setImportLocalesModalVisible(true);
  };

  const [isImportComponentsModalVisible, setImportComponentsModalVisible] = useState<boolean>(false);

  const handleImportComponentsClick = () => {
    setImportComponentsModalVisible(true);
  };

  const [extendedSearchModalVisible, setExtendedSearchModalVisible] = useState<boolean>(false);

  const handleExtendedSearchClick = () => {
    setExtendedSearchModalVisible(true);
  };

  const handleExtendedSearchCloseClick = () => {
    setExtendedSearchModalVisible(false);

    applySearchParams(searchQuery || '', caseSensitive, exactMatch);
  };

  return (
    <div className="container">
      {/*
        <h1>{t('Welcome to React')}</h1>
        <h1>{t('key1')}</h1>
        <h1>{t('key2.key2_inner_key1')}</h1>
        <h1>{t('key3.dotted.name')}</h1>
      */}

      {isImportLocalesModalVisible && (
        <ImportLocales
          projectId={currentProjectId}
          onClose={() => setImportLocalesModalVisible(false)}
          onCancel={() => setImportLocalesModalVisible(false)}
          onConfirm={() => setImportLocalesModalVisible(false)}
        />
      )}

      {isImportComponentsModalVisible && (
        <ImportComponents
          onClose={() => setImportComponentsModalVisible(false)}
          onCancel={() => setImportComponentsModalVisible(false)}
          onConfirm={() => setImportComponentsModalVisible(false)}
          project={project}
        />
      )}

      {isAddLanguageModalVisible && (
        <AddProjectLanguage
          projectId={currentProjectId}
          onClose={() => {
            setAddLanguageModalVisible(false);
          }}
          onCancel={() => {
            setAddLanguageModalVisible(false);
          }}
          onConfirm={() => {
            setAddLanguageModalVisible(false);
          }}
        />
      )}

      {isLanguagesModalVisible && (
        <ProjectLanguages
          project={project}
          onHideAll={() => {}}
          onHide={() => {}}
          onEdit={onLanguageEdit}
          onDelete={() => {}}
          onClose={() => { setIsLanguagesModalVisible(false); }}
        />
      )}

      {isLanguageEditModalVisible && (
        <EditProjectLanguage
          projectId={currentProjectId}
          languageId={inEditLanguageId as string}
          onClose={() => {
            setIsLanguageEditModalVisible(false);
          }}
          onCancel={() => {
            setIsLanguageEditModalVisible(false);
          }}
          onSave={() => {
            setIsLanguageEditModalVisible(false);
          }}
        />
      )}

      {isCreateKeyModalVisible && newEntityParentId && newEntityPath && (
        <CreateKey
          projectId={currentProjectId}
          parentId={newEntityParentId}
          entityPath={newEntityPath}
          entityType={newEntityType as EntityType}
          project={project}
          onClose={() => {
            setIsCreateKeyModalVisible(false);
          }}
          onCancel={() => {
            setIsCreateKeyModalVisible(false);
          }}
          onConfirm={() => {
            setIsCreateKeyModalVisible(false);
            fetchProjectData();
          }}
        />
      )}

      {isEditKeyModalVisible && (
        <EditEntity
          keyId={inEditKeyId as string}
          entityType={inEditEntityType as EntityType}
          project={project as IProject}
          onClose={() => {
            setIsEditKeyModalVisible(false);
          }}
          onCancel={() => {
            setIsEditKeyModalVisible(false);
          }}
          onSave={() => {
            setIsEditKeyModalVisible(false);
          }}
        />
      )}

      {extendedSearchModalVisible && (
        <Modal
          onEscapeKeyPress={() => {
            setExtendedSearchModalVisible(false);
          }}
          customClassNames="modal_searchSettings"
        >
          <div className="modal-header">
            <h4 className="modal-title">Search In: </h4>
            <button
              type="button"
              className="modal-closeButton"
              onClick={handleExtendedSearchCloseClick}
              aria-label="Close modal"
            />
          </div>

          <div className="searchSettings">
            <div className="searchSettings-row">
              <label className="searchSettings-control">
                <input
                  type="checkbox"
                  className="switcher"
                  checked={searchInKeys}
                  onChange={() => setSearchInKeys(!searchInKeys)}
                />
                <span className="searchSettings-controlText">Keys</span>
              </label>
            </div>
            <div className="searchSettings-row">
              <label className="searchSettings-control">
                <input
                  type="checkbox"
                  className="switcher"
                  checked={searchInValues}
                  onChange={() => setSearchInValues(!searchInValues)}
                />
                <span className="searchSettings-controlText">Values</span>
              </label>
            </div>
            <div className="searchSettings-row">
              <label className="searchSettings-control">
                <input
                  type="checkbox"
                  className="switcher"
                  checked={searchInFolders}
                  onChange={() => setSearchInFolders(!searchInFolders)}
                />
                <span className="searchSettings-controlText">Folders</span>
              </label>
            </div>
            <div className="searchSettings-row">
              <label className="searchSettings-control">
                <input
                  type="checkbox"
                  className="switcher"
                  checked={searchInComponents}
                  onChange={() => setSearchInComponents(!searchInComponents)}
                />
                <span className="searchSettings-controlText">Components</span>
              </label>
            </div>
          </div>
        </Modal>
      )}

      {isEntityDeleteConfirmVisible && renderDeleteConfirmationModal()}

      <div className="header">
        <button type="button" className="button primary" onClick={handleImportLocalesClick}>
          Import Locales
        </button>

        <button type="button" className="button primary" onClick={handleImportComponentsClick}>
          Import Components
        </button>

        <button type="button" className="button primary" onClick={handleExportClick}>Export</button>
      </div>

      <div className="editorHeader">
        {projects && projects.length > 1 ? (
          <button
            type="button"
            className="buttonInline editorHeader-currentProjectButton"
            onClick={handleProjectNameClick}
          >
            {project?.projectName}
          </button>
        ) : (
          <span className="buttonInline editorHeader-currentProject">
            {project?.projectName}
          </span>
        )}

        {(isProjectsMenuVisible && projectsMenuCoords && projects && projects.length > 1) && (
          <div
            className="editorHeader-projectListMenu"
            style={{ top: projectsMenuCoords.top, left: projectsMenuCoords.left }}
          >
            {projects.map(({ projectName, projectId }) => {
              if (projectId === currentProjectId) {
                return null;
              }

              return (
                <div className="editorHeader-projectListItem" key={projectId}>
                  <Link
                    className="editorHeader-projectListLink"
                    to={`/project/${projectId}`}
                    key={projectId}
                    onClick={handleProjectListNameClick}
                  >
                    {projectName}
                  </Link>
                  <button type="button" className="editorHeader-projectListSubmenu" aria-label="Project Menu" />
                </div>
              );
            })}
          </div>
        )}

        {(project && project.languages) && (
          <button
            type="button"
            className="button primary editorHeader-languageList"
            onClick={handleProjectLanguagesButtonClick}
          >
            {getLanguagesButtonTitle()}
          </button>
        )}

        <button
          type="button"
          className="button success editorHeader-addLanguage"
          onClick={handleAddLanguageClick}
        >
          Add Languages
        </button>
      </div>

      <Tooltip
        content={`Case sensitive ${caseSensitive ? 'enabled' : 'disabled'}`}
        anchor="._casing-tooltip-anchor"
        size="small"
      />

      <Tooltip
        content={`Exact match ${exactMatch ? 'enabled' : 'disabled'}`}
        anchor="._exact-tooltip-anchor"
        size="small"
      />

      <Tooltip
        content="Advanced settings..."
        anchor="._advanced-tooltip-anchor"
        size="small"
      />

      {project && (
        <>
          <Tooltip
            content="New Key"
            anchor="._new-key"
            size="small_autosize"
            nightMode
          />

          <Tooltip
            content="New Folder"
            anchor="._new-folder"
            size="small_autosize"
            nightMode
          />

          <Tooltip
            content="Edit"
            anchor="._entity-edit"
            size="small_autosize"
            nightMode
          />

          <Tooltip
            content="Move"
            anchor="._entity-move"
            size="small_autosize"
            nightMode
          />

          <Tooltip
            content="Delete"
            anchor="._entity-delete"
            size="small_autosize"
            nightMode
          />
        </>
      )}

      <section className="editorToolbar">
        <div className="editorSearch">
          <input
            type="text"
            className="input editorSearch-input"
            placeholder="Search..."
            onChange={handleSearchQueryChange}
          />
          <div className="editorSearch-controls">
            <i
              className={`_casing-tooltip-anchor editorSearch-control editorSearch-control_casing ${caseSensitive ? 'isActive' : ''}`}
              onClick={handleCasingClick}
            />
            <i
              className={`_exact-tooltip-anchor editorSearch-control editorSearch-control_exactMatch ${exactMatch ? 'isActive' : ''}`}
              onClick={handleExactMatchClick}
            />
            <i
              className={`_advanced-tooltip-anchor editorSearch-control editorSearch-control_advanced ${extendedSearchModalVisible ? 'isActive' : ''}`}
              onClick={handleExtendedSearchClick}
            />
          </div>
        </div>

        <div className="editorCreateBlock">
          <button
            type="button"
            className="button success editorToolbar-createKeyButton"
            onClick={() => handleNewKeyClick(EntityType.String)}
          >
            Key
          </button>

          <button
            type="button"
            className="button success editorToolbar-createKeyButton"
            onClick={() => handleNewKeyClick(EntityType.Folder)}
          >
            Folder
          </button>

          <button
            type="button"
            className="button success editorToolbar-createKeyButton"
            onClick={() => handleNewKeyClick(EntityType.Component)}
          >
            Component
          </button>
        </div>
      </section>

      {(project && searchResultKeys) && (
        <div onClick={handleItemsListClickEvent}>
          <ItemsList
            keys={searchResultKeys}
            parentId={project.projectId}
            projectId={project.projectId}
            languages={project.languages}
            path={ROOT}
            pathCache={ROOT}
          />
        </div>
      )}

      {project && !searchQuery && (!searchResultKeys || searchResultKeys.length === 0) && (
        <div onClick={handleItemsListClickEvent}>
          <ItemsList
            keys={project.keys}
            values={project.values}
            parentId={project.projectId}
            projectId={project.projectId}
            languages={project.languages}
            path={ROOT}
            pathCache={ROOT}
          />
        </div>
      )}
    </div>
  );
}
