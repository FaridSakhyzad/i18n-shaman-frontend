import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState, AppDispatch } from 'store';
import { createProject, getProjects } from 'store/projects';
import {
  IProject,
} from '../../interfaces';

export default function Projects() {
  const { id: userId } = useSelector((state: IRootState) => state.user);
  const { projects } = useSelector((state: IRootState) => state.projects);

  const dispatch = useDispatch<AppDispatch>();

  const [newProjectName, setNewProjectName] = useState<string | null>(null);

  const handleNewProjectNameChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    setNewProjectName(value);
  };

  const handleCreateNewProjectButton = async () => {
    if (!newProjectName) {
      return;
    }

    dispatch(createProject({
      userId: userId as string,
      newProjectName,
    }));
  };

  useEffect(() => {
    dispatch(getProjects(userId as string));
  }, []);

  return (
    <div className="container">
      <h1>Projects</h1>
      <hr />
      {projects && projects.map((project: IProject) => (
        <div key={project.projectId}>{project.projectName}</div>
      ))}
      <hr />
      <form onSubmit={(e) => e.preventDefault()}>
        <input placeholder="New Project Name" type="text" onChange={handleNewProjectNameChange} />
        <button type="submit" onClick={handleCreateNewProjectButton}>Create New Project</button>
      </form>
    </div>
  );
}
