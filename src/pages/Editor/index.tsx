import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, IRootState } from 'store';
import { getProjects } from 'store/projects';

import { IKey, IProject } from 'interfaces';

import { exportProjectToJson, getUserProjectsById } from 'api/projects';

import './Editor.scss';

import ProjectLanguages from 'components/ProjectLanguages';
import AddProjectLanguage from 'components/AddProjectLanguage';
import CreateKey from 'components/CreateKey';
import EditKey from 'components/EditKey';

import Key from './Key';
import EditProjectLanguage from '../../components/EditProjectLanguage';

interface IProjectsMenuCoords {
  top: number;
  left: number;
}

export default function Editor() {
  const dispatch = useDispatch<AppDispatch>();

  const { id: userId } = useSelector((state: IRootState) => state.user);
  const { projectId: currentProjectId = '' } = useParams();

  const { projects } = useSelector((state: IRootState) => state.projects);

  const [project, setProject] = useState<IProject | null>(null);

  const [isCreateKeyModalVisible, setIsCreateKeyModalVisible] = useState<boolean>(false);

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

  const [inEditKey, setInEditKey] = useState<IKey | null>(null);
  const [isEditKeyModalVisible, setIsEditKeyModalVisible] = useState<boolean>(false);

  const onKeyNameClick = (keyId: string) => {
    if (!project) {
      return;
    }

    const theKey = project.keys.find((key) => key.id === keyId) || null;

    setInEditKey(theKey);
    setIsEditKeyModalVisible(true);
  };

  const handleImportClick = () => {
    console.log('IMPORT');
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

  return (
    <div className="container">
      <div className="header">
        <hr />
        <button type="button" className="button primary" onClick={handleImportClick}>Import</button>
        &nbsp;&nbsp;&nbsp;
        <button type="button" className="button primary" onClick={handleExportClick}>Export</button>
        <hr />
      </div>

      {isAddLanguageModalVisible && (
        <AddProjectLanguage
          projectId={currentProjectId}
          onClose={() => { setAddLanguageModalVisible(false); }}
          onCancel={() => { setAddLanguageModalVisible(false); }}
          onConfirm={() => { setAddLanguageModalVisible(false); }}
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
          onClose={() => { setIsLanguageEditModalVisible(false); }}
          onCancel={() => { setIsLanguageEditModalVisible(false); }}
          onSave={() => { setIsLanguageEditModalVisible(false); }}
        />
      )}

      {isCreateKeyModalVisible && (
        <CreateKey
          projectId={currentProjectId}
          project={project}
          onClose={() => { setIsCreateKeyModalVisible(false); }}
          onCancel={() => { setIsCreateKeyModalVisible(false); }}
          onConfirm={() => { setIsCreateKeyModalVisible(false); }}
        />
      )}

      {isEditKeyModalVisible && (
        <EditKey
          projectKey={inEditKey as IKey}
          project={project as IProject}
          onClose={() => { setIsEditKeyModalVisible(false); }}
          onCancel={() => { setIsEditKeyModalVisible(false); }}
          onSave={() => { setIsEditKeyModalVisible(false); }}
        />
      )}

      <div className="editorHeader">
        <button
          type="button"
          className="buttonInline editorHeader-currentProject"
          onClick={handleProjectNameClick}
        >
          {project?.projectName}
        </button>

        {(isProjectsMenuVisible && projectsMenuCoords) && (
          <div
            className="editorHeader-projectListMenu"
            style={{ top: projectsMenuCoords.top, left: projectsMenuCoords.left }}
          >
            {projects && projects.map(({projectName, projectId}) => {
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

      <section className="editorToolbar">
        <button
          type="button"
          className="button success editorToolbar-createKeyButton"
          onClick={handleNewKeyClick}
        >
          Create New Key
        </button>
      </section>

      <section className="keysList">
        {project && project.keys.map((key: IKey) => (
          <div key={key.id}>
            <Key
              id={key.id}
              label={key.label}
              values={key.values}
              languages={project.languages}
              description={key.description}
              onKeyNameClick={onKeyNameClick}
              onLanguageClick={onLanguageClick}
            />
          </div>
        ))}
      </section>
    </div>
  );
}
