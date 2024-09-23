import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, IRootState } from 'store';
import { getProjects } from 'store/projects';

import { IKey, ILanguage, IProject } from 'interfaces';

import {
  getUserProjectsById,
  addProjectKey,
} from 'api/projects';

import {
  addLanguage,
} from 'api/languages';

import Key from './Key';

import './Editor.scss';
import ProjectLanguages from '../../components/ProjectLanguages/ProjectLanguages';

interface IProjectsMenuCoords {
  top: number;
  left: number;
}

export default function Editor() {
  const dispatch = useDispatch<AppDispatch>();

  const { id: userId } = useSelector((state: IRootState) => state.user);
  const { projectId: currentProjectId = '' } = useParams();

  const { projects } = useSelector((state: IRootState) => state.projects);

  const [newLanguage, setNewLanguage] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState<string | null>(null);

  const [project, setProject] = useState<IProject | null>(null);

  const [isCreateKeyModalVisible, setIsCreateKeyModalVisible] = useState<boolean>(false);

  const [isProjectsMenuVisible, setIsProjectsMenuVisible] = useState<boolean>(false);
  const [projectsMenuCoords, setProjectsMenuCoords] = useState<IProjectsMenuCoords>();

  const [isLanguagesModalVisible, setIsLanguagesModalVisible] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const createKeyModalRef = useRef<HTMLDialogElement>(null);

  const [isAddLanguageModalVisible, setAddLanguageModalVisible] = useState<boolean>(false);
  const addLangModalRef = useRef<HTMLDialogElement>(null);

  const fetchProjectData = async () => {
    const result = await getUserProjectsById(currentProjectId);

    setProject(result);
  };

  useEffect(() => {
    dispatch(getProjects(userId as string));
    fetchProjectData();
  }, [currentProjectId]);

  const handleNewLanguageChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setNewLanguage(value);
  };

  const handleAddLanguageClick = async () => {
    setAddLanguageModalVisible(true);
  };

  useEffect(() => {
    if (!addLangModalRef || !addLangModalRef.current) {
      return;
    }

    addLangModalRef.current.showModal();
  }, [isAddLanguageModalVisible]);

  const handleAddLanguageConfirmClick = async () => {
    if (!currentProjectId || !newLanguage) {
      return;
    }

    setLoading(true);

    await addLanguage({
      projectId: currentProjectId,
      id: Math.random().toString(16).substring(2),
      label: newLanguage,
      baseLanguage: false,
    });

    fetchProjectData();

    setNewLanguage(null);

    setLoading(false);

    setAddLanguageModalVisible(false);
  };

  const handleAddLanguageCancelClick = () => {
    setAddLanguageModalVisible(false);
  };

  const handleNewKeyNameChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setNewKeyName(value);
  };

  const handleNewKeyClick = () => {
    setIsCreateKeyModalVisible(true);
  };

  const handleCreateKeyCancelClick = () => {
    setIsCreateKeyModalVisible(false);
  };

  const handleCreateKeyConfirmClick = async () => {
    if (!currentProjectId || !newKeyName) {
      return;
    }

    setLoading(true);

    await addProjectKey({
      projectId: currentProjectId,
      id: Math.random().toString(16).substring(2),
      label: newKeyName,
      values: [],
    });

    fetchProjectData();

    setNewKeyName(null);

    setLoading(false);

    setIsCreateKeyModalVisible(false);
  };

  useEffect(() => {
    if (!isCreateKeyModalVisible || !createKeyModalRef.current) {
      return;
    }

    createKeyModalRef.current.showModal();
  }, [isCreateKeyModalVisible]);

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

        {isAddLanguageModalVisible && (
          <dialog
            className="dialog"
            ref={addLangModalRef}
            onCancel={() => {
              setAddLanguageModalVisible(false);
            }}
          >
            <input
              className="input"
              type="text"
              onChange={handleNewLanguageChange}
              value={newLanguage || ''}
              placeholder="New Language"
            />
            <div>
              <button type="button" className="button primary" onClick={handleAddLanguageConfirmClick}>Add New
                Language
              </button>
              <button type="button" className="button secondary" onClick={handleAddLanguageCancelClick}>Cancel</button>
            </div>
          </dialog>
        )}
      </div>

      <section className="editorToolbar">
        <button
          type="button"
          className="button success editorToolbar-createKeyButton"
          onClick={handleNewKeyClick}
        >New Key
        </button>
      </section>

      {isCreateKeyModalVisible && (
        <dialog
          className="dialog"
          ref={createKeyModalRef}
          onCancel={() => { setIsCreateKeyModalVisible(false); }}
        >
          <input
            className="input"
            type="text"
            onChange={handleNewKeyNameChange}
            value={newKeyName || ''}
          />
          <div>
            <button type="button" className="button primary" onClick={handleCreateKeyConfirmClick}>Create New Key</button>
            <button type="button" className="button secondary" onClick={handleCreateKeyCancelClick}>Cancel</button>
          </div>
        </dialog>
      )}

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
