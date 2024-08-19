import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { IRootState } from 'store';

import {
  createUserProject,
  getUserProjects,
  getUserProjectsById,
  addProjectKey,
  addProjectLanguage,
} from 'api/projects';

import './Editor.scss';
import Key from './Key';
import {
  IKey,
  IProject,
} from '../../interfaces';

export default function Editor() {
  const { projectId: currentProjectId = '' } = useParams();

  const { id: userId } = useSelector((state: IRootState) => state.user);

  const [newProjectName, setNewProjectName] = useState<string | null>(null);
  const [newLanguage, setNewLanguage] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState<string | null>(null);

  const [project, setProject] = useState<IProject | null>(null);

  const [projectsList, setProjectsList] = useState<IProject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUserProjects = async () => {
    const { data: userProjectsData } = await getUserProjects(userId as string);

    if (!userProjectsData) {
      return;
    }

    setProjectsList(userProjectsData.map(({ projectName, projectId }: any) => ({
      projectName,
      projectId,
    })));
  };

  const fetchProjectData = async () => {
    const result = await getUserProjectsById(currentProjectId);

    setProject(result.data);
  };

  useEffect(() => {
    fetchUserProjects();
    fetchProjectData();
  }, []);

  const handleNewProjectNameChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setNewProjectName(value);
  };

  const handleCreateProjectClick = async () => {
    if (!newProjectName) {
      return;
    }

    setLoading(true);

    const result = await createUserProject({
      userId: userId as string,
      projectName: newProjectName,
      projectId: Math.random().toString(16).substring(2),
    });

    setNewProjectName(null);

    await fetchUserProjects();

    setLoading(false);
  };

  const handleNewLanguageChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setNewLanguage(value);
  };

  const handleAddLanguageClick = async () => {
    if (!currentProjectId || !newLanguage) {
      return;
    }

    setLoading(true);

    await addProjectLanguage({
      projectId: currentProjectId,
      id: Math.random().toString(16).substring(2),
      label: newLanguage,
      baseLanguage: false,
    });

    setNewLanguage(null);

    setLoading(false);
  };

  const handleNewKeyNameChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setNewKeyName(value);
  };

  const handleCreateKeyClick = async () => {
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

    setNewKeyName(null);

    setLoading(false);
  };

  return (
    <div className="container">
      <header>
        <h1>Project: {currentProjectId}</h1>
        <select disabled={loading}>
          {projectsList && projectsList.map(({ projectName, projectId }) => (
            <option key={projectId}>{projectName}</option>
          ))}
        </select>
      </header>
      <hr />
      <div>
        <input
          type="text"
          onChange={handleNewProjectNameChange}
          value={newProjectName || ''}
        />
        <button type="button" onClick={handleCreateProjectClick}>Create Project</button>
      </div>
      <hr />
      <div>
        <input
          type="text"
          onChange={handleNewLanguageChange}
          value={newLanguage || ''}
        />
        <button type="button" onClick={handleAddLanguageClick}>Add Language</button>
      </div>
      <hr />
      <div>
        <input
          type="text"
          onChange={handleNewKeyNameChange}
          value={newKeyName || ''}
        />
        <button type="button" onClick={handleCreateKeyClick}>Create Key</button>
      </div>

      <section>
        {project && project.keys.map((key: IKey) => (
          <div key={key.id}>
            <hr />
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
