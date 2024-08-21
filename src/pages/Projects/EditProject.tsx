import React, { useState } from 'react';
import {
  IProject,
} from 'interfaces';

interface IProps {
  project: IProject;
  onProjectSave: (project: IProject) => void;
}

export default function EditProject({ project: projectFromProps, onProjectSave }: IProps) {
  const [project, setProject] = useState<IProject>(projectFromProps);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onProjectSave(project);
  };

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProject({
      ...project,
      projectName: e.target.value,
    });
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        value={project.projectName}
        onChange={handleProjectNameChange}
      />
      <button type="submit">OK</button>
    </form>
  );
}
