import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { IRootState, AppDispatch } from 'store';
import {
  createProject,
  updateProject,
  deleteProject,
  getProjects,
} from 'store/projects';

import {
  IProject,
} from 'interfaces';
import EditProject from './EditProject';

export default function Projects() {
  const { id: userId } = useSelector((state: IRootState) => state.user);
  const { projects } = useSelector((state: IRootState) => state.projects);

  const dispatch = useDispatch<AppDispatch>();

  const [newProjectName, setNewProjectName] = useState<string>('');

  const [projectInEdit, setProjectInEdit] = useState<string | null>(null);

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

    setNewProjectName('');
  };

  const handleDeleteClick = (projectId: string) => {
    dispatch(deleteProject(projectId));
  };

  const handleEditClick = (projectId: string) => {
    setProjectInEdit(projectId);
  };

  const handleProjectSave = (data: IProject) => {
    dispatch(updateProject(data));
    setProjectInEdit(null);
  };

  useEffect(() => {
    dispatch(getProjects(userId as string));
  }, []);

  return (
    <div className="container">
      <h1>Projects</h1>
      <hr />
      <div className="grid">
        {projects && projects.map((project: IProject) => (
          <div className="row" key={project.projectId}>
            <div className="col-8">
              {projectInEdit === project.projectId ? (
                <EditProject
                  project={project}
                  onProjectSave={handleProjectSave}
                />
              ) : (
                <span>
                  <Link to={`/project/${project.projectId}`}>{project.projectName}</Link>
                </span>
              )}
            </div>
            <div className="col-4">
              <div className="row">
                <div className="col">
                  <button type="button" onClick={() => handleDeleteClick(project.projectId)}>Delete</button>
                </div>
                <div className="col">
                  <button type="button" onClick={() => handleEditClick(project.projectId)}>Edit</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <hr />
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          placeholder="New Project Name"
          type="text"
          onChange={handleNewProjectNameChange}
          value={newProjectName}
        />
        <button type="submit" onClick={handleCreateNewProjectButton}>Create New Project</button>
      </form>
    </div>
  );
}
