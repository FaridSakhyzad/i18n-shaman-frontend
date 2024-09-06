import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, IRootState } from 'store';
import { getProjects } from 'store/projects';

import { IKey, IProject } from 'interfaces';

import {
  getUserProjectsById,
  addProjectKey,
  addProjectLanguage,
} from 'api/projects';

import Key from './Key';

import './Editor.scss';

export default function Editor() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { id: userId } = useSelector((state: IRootState) => state.user);
  const { projectId: currentProjectId = '' } = useParams();

  const { projects } = useSelector((state: IRootState) => state.projects);

  const [newLanguage, setNewLanguage] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState<string | null>(null);

  const [project, setProject] = useState<IProject | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

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

    fetchProjectData();

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

    fetchProjectData();

    setNewKeyName(null);

    setLoading(false);
  };

  const handleProjectChange = ({ target: { value } }: React.ChangeEvent<HTMLSelectElement>) => {
    navigate(`/project/${value}`);
  };

  return (
    <div className="container">
      <header>
        <h1>Project: {project?.projectName} | {currentProjectId}</h1>
        <select
          disabled={loading}
          value={currentProjectId}
          onChange={handleProjectChange}
        >
          {projects && projects.map(({ projectName, projectId }) => (
            <option
              key={projectId}
              value={projectId}
            >
              {projectName}
            </option>
          ))}
        </select>
      </header>
      <hr />
      <div>
        <input
          className="input"
          type="text"
          onChange={handleNewLanguageChange}
          value={newLanguage || ''}
          placeholder="New Project Name"
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

      <section className="keysList">
        <h2>Project</h2>
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
