import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { changeLanguage } from 'i18next';
import { useTranslation } from 'react-i18next';

import { AppDispatch, IRootState } from 'store';
import { getProjects } from 'store/projects';
import { ROOT } from 'constants/app';
import { IProject } from 'interfaces';
import {
  deleteProjectEntity,
  exportProjectToJson,
  getUserProjectsById,
  importDataToProject,
} from 'api/projects';

import { debounce } from 'utils/utils';

import ProjectLanguages from 'components/ProjectLanguages';
import AddProjectLanguage from 'components/AddProjectLanguage';
import CreateKey from 'components/CreateKey';
import EditKey from 'components/EditKey';
import EditProjectLanguage from 'components/EditProjectLanguage';

import ItemsList from './ItemsList';

import './Editor.scss';
import { search } from '../../api/search';

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

  const handleNewKeyClick = () => {
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

  const deleteEntity = async (id: string) => {
    const result = await deleteProjectEntity(id);
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
      onKeyNameClick(dataset.keyId as string);
    }

    if (elName === 'keyLanguage') {
      onLanguageClick(dataset.languageId as string);
    }

    if (elName === 'newEntity') {
      setNewEntityPath(dataset.parentPath as string);
      setNewEntityParentId(dataset.parentId as string);
      setIsCreateKeyModalVisible(true);
    }

    if (elName === 'deleteEntity') {
      deleteEntity(dataset.id as string);
    }
  };

  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [exactMatch, setExactMatch] = useState<boolean>(false);

  const applySearchParams = async (value: string) => {
    const searchResult = await search({
      projectId: project?.projectId as string,
      query: encodeURIComponent(value),
      casing: caseSensitive,
      exact: exactMatch,
    });

    console.log('searchResult');
    console.log(searchResult);
  };

  const handleSearchQueryChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => applySearchParams(e.target.value), 1000);

  const handleCasingClick = () => {
    setCaseSensitive(!caseSensitive);
  };

  const handleExactMatchClick = () => {
    setExactMatch(!exactMatch);
  };

  return (
    <div className="container">
      {/*
        <h1>{t('Welcome to React')}</h1>
        <h1>{t('key1')}</h1>
        <h1>{t('key2.key2_inner_key1')}</h1>
        <h1>{t('key3.dotted.name')}</h1>
      */}

      <div className="header">
        {/*
          <button type="button" onClick={handleChangeLanguageClick}>Change language</button>
        */}

        <span className="button primary export">
          <input type="file" onChange={handleExportFieldChange} accept="application/json" multiple />
          Import
        </span>
        <button type="button" className="button primary" onClick={handleExportClick}>Export</button>
      </div>

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
          project={project}
          onClose={() => {
            setIsCreateKeyModalVisible(false);
          }}
          onCancel={() => {
            setIsCreateKeyModalVisible(false);
          }}
          onConfirm={() => {
            setIsCreateKeyModalVisible(false);
          }}
        />
      )}

      {isEditKeyModalVisible && (
        <EditKey
          keyId={inEditKeyId as string}
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
                  <button type="button" className="editorHeader-projectListSubmenu" aria-label="Project Menu"/>
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
              className={`editorSearch-control editorSearch-control_casing ${caseSensitive ? 'isActive' : ''}`}
              onClick={handleCasingClick}
            />
            <i
              className={`editorSearch-control editorSearch-control_exactMatch ${exactMatch ? 'isActive' : ''}`}
              onClick={handleExactMatchClick}
            />
            <i className="editorSearch-control editorSearch-control_advanced" />
          </div>
        </div>

        <button
          type="button"
          className="button success editorToolbar-createKeyButton"
          onClick={handleNewKeyClick}
        >
          Create New Key
        </button>
      </section>

      {project && (
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
