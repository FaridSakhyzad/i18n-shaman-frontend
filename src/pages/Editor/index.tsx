import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, IRootState } from 'store';
import { getProjects } from 'store/projects';

import { IKey, IProject } from 'interfaces';

import {
  getUserProjectsById,
  addProjectKey,
} from 'api/projects';

import Key from './Key';

import './Editor.scss';

import ProjectLanguages from 'components/ProjectLanguages';
import AddProjectLanguage from 'components/AddProjectLanguage';
import CreateKey from 'components/CreateKey';

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
  }, [ currentProjectId ]);

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

  return (
    <div className="container">
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
          onEdit={() => {}}
          onDelete={() => {}}
          onClose={() => { setIsLanguagesModalVisible(false); }}
        />
      )}

      {isCreateKeyModalVisible && (
        <CreateKey
          projectId={currentProjectId}
          onClose={() => { setIsCreateKeyModalVisible(false); }}
          onCancel={() => { setIsCreateKeyModalVisible(false); }}
          onConfirm={() => { setIsCreateKeyModalVisible(false); }}
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
            {projects && projects.map(({ projectName, projectId }) => {
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
            All Languages ({project.languages.length})
          </button>
        )}

        <button
          type="button"
          className="button success editorHeader-addLanguage"
          onClick={handleAddLanguageClick}
        >
          Add Language
        </button>
      </div>

      <section className="editorToolbar">
        <button
          type="button"
          className="button success editorToolbar-createKeyButton"
          onClick={handleNewKeyClick}
        >New Key
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
            />
          </div>
        ))}
      </section>
    </div>
  );
}
