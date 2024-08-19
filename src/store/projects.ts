import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { createUserProject, getUserProjects } from 'api/projects';
import { IProject } from 'interfaces';

interface IInitialState {
  projects: [IProject] | null;
  loading: boolean;
}

const initialState: IInitialState = {
  projects: null,
  loading: false,
};

export const getProjects = createAsyncThunk(
  'projects/getProjects',
  async (userId: string) => {
    const res = await getUserProjects(userId);

    return res;
  },
);

interface ICreateProjectInputArgs {
  userId: string;
  newProjectName: string;
}

export const createProject = createAsyncThunk(
  'projects/createProject',
  async ({ userId, newProjectName }: ICreateProjectInputArgs) => {
    const res = await createUserProject({
      userId,
      projectName: newProjectName,
      projectId: Math.random().toString(16).substring(2),
    });

    return res;
  },
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(getProjects.rejected, (state) => {
        state.loading = false;
      });

    builder
      .addCase(createProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(createProject.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default projectsSlice.reducer;
