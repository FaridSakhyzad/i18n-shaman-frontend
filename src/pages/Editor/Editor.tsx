import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import clsx from 'clsx';

import { AppDispatch, IRootState } from 'store';
import { getProjects, updateProject } from 'store/projects';
import { createSystemMessage, EMessageType } from 'store/systemNotifications';

import { DEFAULT_ITEMS_PER_PAGE, ROOT } from 'constants/app';

import {
  EntityType,
  IProject,
  EFilter,
  ESorting,
  ISorting,
  ESortDirection,
  IFilter,
  ISearchParams, ESearchParams,
} from 'interfaces';

import {
  deleteProjectEntity,
  getUserProjectById,
} from 'api/projects';

import Header from 'components/Header';
import { EHeaderModes } from 'components/Header/Header';

import ProjectLanguages from 'components/ProjectLanguages';
import AddProjectLanguage from 'components/AddProjectLanguage';
import CreateEntity from 'components/CreateEntity';
import EditEntity from 'components/EditEntity';
import EditProjectLanguage from 'components/EditProjectLanguage';
import Tooltip from 'components/Tooltip';
import Modal from 'components/Modal';
import Breadcrumbs from 'components/Breadcrumbs';
import Dropdown from 'components/Dropdown';
import Footer from 'components/Footer';

import ItemsList from './ItemsList';

import './Editor.scss';
import EditProject from '../Projects/EditProject';

export default function Editor() {
  const dispatch = useDispatch<AppDispatch>();

  const { id: userId, preferences } = useSelector((state: IRootState) => state.user);
  const { projectId: currentProjectId = '', subFolderId = '' } = useParams();

  const useSearchParamsResult = useSearchParams();

  const urlSearchParams = useSearchParamsResult[0];

  const initialPage = urlSearchParams.get('page') ? parseInt(urlSearchParams.get('page') as string, 10) : 0;
  const initialItemsPerPage = urlSearchParams.get('per_page') ? parseInt(urlSearchParams.get('per_page') as string, 10) : DEFAULT_ITEMS_PER_PAGE;

  const [page, setPage] = useState<number>(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialItemsPerPage);

  const initialSortBy = (urlSearchParams.get('sort_by') || ESorting.name) as ESorting;
  const initialSortDirection = (urlSearchParams.get('sort_dir') || 'asc') as ESortDirection;

  const [sorting, setSorting] = useState<ISorting>({
    sortBy: initialSortBy,
    sortDirection: initialSortDirection,
  });

  const getInitialFilters = (): IFilter => {
    const defaults = {
      [EFilter.hideEmpty]: false,
      [EFilter.hideFullyPopulated]: false,
      [EFilter.hidePartiallyPopulated]: false,
      [EFilter.hideFolders]: false,
      [EFilter.hideComponents]: false,
      [EFilter.hideKeys]: false,
    } as IFilter;

    const data = urlSearchParams.get('filters');

    if (!data) {
      return defaults;
    }

    const result: IFilter = { ...defaults };

    data.split(',').forEach((item: string) => {
      result[item as EFilter] = true;
    });

    return result;
  };

  const [filters, setFilters] = useState<IFilter>(getInitialFilters());

  const getInitialSearchQuery = () => {
    const { location } = window;

    const url = new URL(location.href);

    return url.searchParams.get('search') || null;
  };

  const getInitialSearchParams = (): ISearchParams => {
    const defaults = {
      [ESearchParams.caseSensitive]: false,
      [ESearchParams.exactMatch]: false,
      [ESearchParams.skipKeys]: false,
      [ESearchParams.skipValues]: false,
      [ESearchParams.skipFolders]: false,
      [ESearchParams.skipComponents]: false,
    } as ISearchParams;

    const data = urlSearchParams.get('search_params');

    if (!data) {
      return defaults;
    }

    const result: ISearchParams = { ...defaults };

    data.split(',').forEach((item: string) => {
      result[item as ESearchParams] = true;
    });

    return result;
  };

  const [searchQuery, setSearchQuery] = useState<string | null>(getInitialSearchQuery());
  const [searchParams, setSearchParams] = useState<ISearchParams>(getInitialSearchParams());

  const [searchQueryRequest, setSearchQueryRequest] = useState<string | null>(searchQuery);

  const searchQueryRef = useRef(searchQuery);
  searchQueryRef.current = searchQuery;

  const searchParamsRef = useRef(searchParams);
  searchParamsRef.current = searchParams;

  const { projects } = useSelector((state: IRootState) => state.projects);

  const [project, setProject] = useState<IProject | null>(null);

  const [isCreateKeyModalVisible, setIsCreateKeyModalVisible] = useState<boolean>(false);
  const [newEntityParentId, setNewEntityParentId] = useState<string>();
  const [newEntityType, setNewEntityType] = useState<EntityType>();
  const [newEntityPath, setNewEntityPath] = useState<string>();

  const [isProjectsMenuVisible, setIsProjectsMenuVisible] = useState<boolean>(false);

  const [isLanguagesModalVisible, setIsLanguagesModalVisible] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);

  const [isAddLanguageModalVisible, setAddLanguageModalVisible] = useState<boolean>(false);

  const fetchProjectData = async () => {
    setLoading(true);

    const result = await getUserProjectById({
      projectId: currentProjectId,
      subFolderId,
      page,
      itemsPerPage,
      ...sorting,
      filters,
      search: searchQuery,
      searchParams,
    });

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
  }, [currentProjectId, subFolderId, page, sorting, filters, searchParams, searchQueryRequest]);

  const handleAddLanguageClick = async () => {
    setAddLanguageModalVisible(true);
  };

  const handleNewKeyClick = (type: EntityType) => {
    if (!project) {
      return;
    }

    const { subfolder } = project;

    const entityPath = subfolder ? `${subfolder.pathCache}/${subfolder.id}` : ROOT;
    const parentId = subfolder ? subfolder.id : currentProjectId;

    setNewEntityType(type);
    setNewEntityParentId(parentId);
    setNewEntityPath(entityPath);
    setIsCreateKeyModalVisible(true);
  };

  const handleProjectNameClick = () => {
    setIsProjectsMenuVisible(!isProjectsMenuVisible);
  };

  const handleProjectListNameClick = () => {
    setPage(0);
    setIsProjectsMenuVisible(false);
  };

  const [inEditProjectId, setInEditProjectId] = useState<string | null>(null);

  const handleProjectListMenuClick = (projectId: string) => {
    setInEditProjectId(projectId);
  };

  const handleProjectSave = async (data: IProject) => {
    await dispatch(updateProject(data));

    await fetchProjectData();

    setInEditProjectId(null);
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
  const [inEditEntityType, setInEditEntityType] = useState<EntityType>();
  const [isEditKeyModalVisible, setIsEditKeyModalVisible] = useState<boolean>(false);

  const onKeyNameClick = (keyId: string) => {
    setInEditKeyId(keyId);
    setIsEditKeyModalVisible(true);
  };

  const getLanguagesButtonTitle = (): string => {
    const { languages = [] } = project || {};

    const visibleLanguagesCount = languages.filter((lang) => lang.visible).length;

    if (visibleLanguagesCount !== languages.length) {
      return `Languages (${visibleLanguagesCount} of ${languages.length})`;
    }

    return `All Languages (${languages.length})`;
  };

  const [idOfEntityToDelete, setIdOfEntityToDelete] = useState<string | null>(null);

  const deleteEntity = async (id: string) => {
    const result = await deleteProjectEntity(id);

    if ('error' in result) {
      dispatch(createSystemMessage({
        content: result.message || 'Error Deleting Entity',
        type: EMessageType.Error,
      }));
    } else {
      fetchProjectData();
    }
  };

  const [isEntityDeleteConfirmVisible, setEntityDeleteConfirmVisible] = useState<boolean>(false);

  const renderDeleteConfirmationModal = () => {
    const handleDeleteConfirmationCloseButtonClick = () => {
      setEntityDeleteConfirmVisible(false);
    };

    const handleDeleteConfirmationCancelButtonClick = () => {
      setEntityDeleteConfirmVisible(false);
    };

    const handleDeleteConfirmationConfirmButtonClick = async () => {
      if (!idOfEntityToDelete) {
        return;
      }

      setLoading(true);

      await deleteEntity(idOfEntityToDelete);

      setEntityDeleteConfirmVisible(false);

      setLoading(false);
    };

    return (
      <Modal customClassNames="dialogModal">
        <div className="modal-header">
          <h4 className="modal-title">Delete Key/Folder</h4>

          <button
            type="button"
            className="modal-closeButton"
            onClick={handleDeleteConfirmationCloseButtonClick}
            aria-label="Close modal"
          />
        </div>

        <div className="modal-content">
          <div className="dialogModal-content">
            <i className="dialogBadge question danger dialogModal-badge" />
            <div className="dialogModal-contentText">
              <p className="dialogModal-contentPara">Are you sure you want to Delete Key/Folder and all it’s contents?<b>Warning: This action can not be reverted.</b></p>
            </div>
          </div>
        </div>

        <div className="modal-buttonBox">
          <button
            type="button"
            className="button secondary dialogModal-button"
            onClick={handleDeleteConfirmationCancelButtonClick}
          >
            Cancel
          </button>
          <button
            type="button"
            className="button danger dialogModal-button"
            onClick={handleDeleteConfirmationConfirmButtonClick}
          >
            Delete
          </button>
        </div>
      </Modal>
    );
  };

  const goToPage = (targetPage: number) => {
    const { location } = window;

    const url = new URL(location.href);

    url.searchParams.set('page', `${targetPage}`);
    url.searchParams.set('per_page', `${itemsPerPage}`);

    setPage(targetPage);

    window.history.pushState({}, '', url);
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
      onKeyNameClick(dataset.id as string);
    }

    if (elName === 'keyLanguage') {
      onLanguageClick(dataset.languageId as string);
    }

    if (elName === 'newEntity') {
      setNewEntityType(dataset.newEntityType as EntityType);
      setNewEntityPath(dataset.parentPath as string);
      setNewEntityParentId(dataset.parentId as string);
      setIsCreateKeyModalVisible(true);
    }

    if (elName === 'editEntity') {
      setInEditKeyId(dataset.id as string);
      setIsEditKeyModalVisible(true);
      setInEditEntityType(dataset.entityType as EntityType);
    }

    if (elName === 'deleteEntity') {
      setIdOfEntityToDelete(dataset.id as string);
      setEntityDeleteConfirmVisible(true);
    }

    if (elName === 'pagePrev') {
      goToPage(page - 1);
    }

    if (elName === 'pageN') {
      goToPage(parseInt(dataset.pageIndex as string, 10));
    }

    if (elName === 'pageNext') {
      goToPage(page + 1);
    }

    if (elName === 'pageRew') {
      goToPage((page - 10) >= 0 ? (page - 10) : 0);
    }

    if (elName === 'pageFFwd') {
      if (!project || !project.keysTotalCount) {
        return;
      }

      const lastPageIndex = Math.ceil(project.keysTotalCount / itemsPerPage) - 1;

      const nextPageIndex = (page + 10) <= lastPageIndex ? (page + 10) : lastPageIndex;

      goToPage(nextPageIndex);
    }
  };

  const [searchTimeoutId, setSearchTimeoutId] = useState<number | null>(null);

  const applySearchParams = () => {
    window.clearTimeout(searchTimeoutId as number);

    const timeoutId = window.setTimeout(() => {
      const { current: searchQueryData } = searchQueryRef;
      const { current: searchParamsData } = searchParamsRef;

      const { location } = window;

      const url = new URL(location.href);

      if (searchQueryData && searchQueryData.length > 0) {
        url.searchParams.set('search', `${searchQueryData}`);
      } else {
        url.searchParams.delete('search');
      }

      const searchParamsString = Object.entries(searchParamsData)
        .filter(([, value]) => value)
        .map((item) => item[0])
        .join(',');

      if (searchParamsString.length > 0) {
        url.searchParams.set('search_params', searchParamsString);
      } else {
        url.searchParams.delete('search_params');
      }

      window.history.pushState({}, '', url);

      setSearchQueryRequest(searchQueryData);

      setSearchTimeoutId(null);
    }, 1000);

    setSearchTimeoutId(timeoutId);
  };

  const handleSearchQueryChange = ({ target: { value: query } }: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(query);

    applySearchParams();
  };

  const handleSearchParamChange = (searchParam: ESearchParams) => {
    const newSearchParams: ISearchParams = {
      ...searchParams,
      [searchParam]: !searchParams[searchParam],
    };

    setSearchParams(newSearchParams);

    applySearchParams();
  };

  const [extendedSearchModalVisible, setExtendedSearchModalVisible] = useState<boolean>(false);

  const handleExtendedSearchClick = () => {
    setExtendedSearchModalVisible(true);
  };

  const handleExtendedSearchCloseClick = () => {
    setExtendedSearchModalVisible(false);
  };

  const [isSortingMenuVisible, setIsSortingMenuVisible] = useState<boolean>(false);

  const handleSortByButtonClick = () => {
    setIsSortingMenuVisible(!isSortingMenuVisible);
  };

  const handleSortingButtonClick = (sortBy: ESorting, sortDirection: ESortDirection) => {
    setIsSortingMenuVisible(false);

    const { location } = window;

    const url = new URL(location.href);

    url.searchParams.set('sort_by', `${sortBy}`);
    url.searchParams.set('sort_dir', `${sortDirection}`);

    setSorting({ sortBy, sortDirection });

    window.history.pushState({}, '', url);
  };

  const [isFiltersMenuVisible, setIsFiltersMenuVisible] = useState<boolean>(false);

  const handleFiltersButtonClick = () => {
    setIsFiltersMenuVisible(!isFiltersMenuVisible);
  };

  const handleFilteringSwitcherChange = (e: React.ChangeEvent<HTMLInputElement>, filtersData: any) => {
    const { checked: enabled } = e.target;

    const newFiltersData = {
      ...filters,
      [filtersData.filter]: enabled,
    };

    const { location } = window;

    const url = new URL(location.href);

    const filtersString = Object.entries(newFiltersData)
      .filter(([, value]) => value)
      .map((item) => item[0])
      .join(',');

    if (filtersString.length > 0) {
      url.searchParams.set('filters', `${filtersString}`);
    } else {
      url.searchParams.delete('filters');
    }

    setFilters(newFiltersData);

    window.history.pushState({}, '', url);
  };

  const onKeyEditSave = async () => {
    setIsEditKeyModalVisible(false);
    setLoading(true);
    await fetchProjectData();
    setLoading(false);
  };

  const onProjectLanguagesAdd = async () => {
    setLoading(true);
    await fetchProjectData();
    setLoading(false);
  };

  const onProjectLanguagesEditDelete = async () => {
    setLoading(true);
    await fetchProjectData();
    setLoading(false);
  };

  const getOrderedProjects = () => {
    if (!projects) {
      return null;
    }

    if (!preferences.projectsOrder) {
      return projects;
    }

    const projectsMap: Map<string, IProject> = new Map<string, IProject>(projects.map((project) => [project.projectId, project]));

    const result: (IProject | undefined)[] = [];

    preferences.projectsOrder.forEach((id) => {
      result.push(projectsMap.get(id));
    });

    return result;
  };

  const orderedProjects: IProject[] = getOrderedProjects() as IProject[];

  return (
    <>
      {/*
        <h1>{t('Welcome to React')}</h1>
        <h1>{t('key1')}</h1>
        <h1>{t('key2.key2_inner_key1')}</h1>
        <h1>{t('key3.dotted.name')}</h1>
      */}

      {projects && inEditProjectId && (
        <EditProject
          project={projects.find((projectData: IProject) => projectData.projectId === inEditProjectId) as IProject}
          onSave={handleProjectSave}
          onClose={() => setInEditProjectId(null)}
          onCancel={() => setInEditProjectId(null)}
        />
      )}

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
          onAddLanguage={onProjectLanguagesAdd}
          onDelete={onProjectLanguagesEditDelete}
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
        <CreateEntity
          projectId={currentProjectId}
          parentId={newEntityParentId}
          entityPath={newEntityPath}
          entityType={newEntityType as EntityType}
          project={project as IProject}
          onClose={() => {
            setIsCreateKeyModalVisible(false);
          }}
          onCancel={() => {
            setIsCreateKeyModalVisible(false);
          }}
          onConfirm={() => {
            setIsCreateKeyModalVisible(false);
            fetchProjectData();
          }}
        />
      )}

      {isEditKeyModalVisible && (
        <EditEntity
          keyId={inEditKeyId as string}
          entityType={inEditEntityType as EntityType}
          project={project as IProject}
          onClose={() => {
            setIsEditKeyModalVisible(false);
          }}
          onCancel={() => {
            setIsEditKeyModalVisible(false);
          }}
          onSave={onKeyEditSave}
        />
      )}

      {extendedSearchModalVisible && (
        <Modal
          onEscapeKeyPress={() => {
            setExtendedSearchModalVisible(false);
          }}
          customClassNames="modal_searchSettings"
        >
          <div className="modal-header">
            <h4 className="modal-title">Search In: </h4>
            <button
              type="button"
              className="modal-closeButton"
              onClick={handleExtendedSearchCloseClick}
              aria-label="Close modal"
            />
          </div>

          <div className="searchSettings">
            <div className="searchSettings-row">
              <label className="searchSettings-control">
                <input
                  type="checkbox"
                  className="switcher"
                  checked={!searchParams[ESearchParams.skipKeys]}
                  onChange={() => handleSearchParamChange(ESearchParams.skipKeys)}
                />
                <span className="searchSettings-controlText">Keys</span>
              </label>
            </div>
            <div className="searchSettings-row">
              <label className="searchSettings-control">
                <input
                  type="checkbox"
                  className="switcher"
                  checked={!searchParams[ESearchParams.skipValues]}
                  onChange={() => handleSearchParamChange(ESearchParams.skipValues)}
                />
                <span className="searchSettings-controlText">Values</span>
              </label>
            </div>
            <div className="searchSettings-row">
              <label className="searchSettings-control">
                <input
                  type="checkbox"
                  className="switcher"
                  checked={!searchParams[ESearchParams.skipFolders]}
                  onChange={() => handleSearchParamChange(ESearchParams.skipFolders)}
                />
                <span className="searchSettings-controlText">Folders</span>
              </label>
            </div>
            <div className="searchSettings-row">
              <label className="searchSettings-control">
                <input
                  type="checkbox"
                  className="switcher"
                  checked={!searchParams[ESearchParams.skipComponents]}
                  onChange={() => handleSearchParamChange(ESearchParams.skipComponents)}
                />
                <span className="searchSettings-controlText">Components</span>
              </label>
            </div>
          </div>
        </Modal>
      )}

      {isProjectsMenuVisible && (
        <Dropdown
          anchor="._button-projects-menu"
          onOutsideClick={() => setIsProjectsMenuVisible(false)}
          classNames="editorHeader-projectListMenu"
        >
          {orderedProjects && orderedProjects.map(({ projectName, projectId }) => {
            if (projectId === currentProjectId) {
              return (
                <div
                  className={`editorHeader-projectListItem ${projectId === currentProjectId && 'editorHeader-projectListItem_active'}`}
                  key={projectId}
                >
                  <span className="editorHeader-projectListLink editorHeader-projectListItem_active">{projectName}</span>
                  <button
                    type="button"
                    className="editorHeader-projectListSubmenu"
                    aria-label="Project Menu"
                    onClick={() => handleProjectListMenuClick(projectId)}
                  />
                </div>
              );
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
                <button
                  type="button"
                  className="editorHeader-projectListSubmenu"
                  aria-label="Project Menu"
                  onClick={() => handleProjectListMenuClick(projectId)}
                />
              </div>
            );
          })}
        </Dropdown>
      )}

      {isEntityDeleteConfirmVisible && renderDeleteConfirmationModal()}

      <Header mode={EHeaderModes.EDITOR} project={project} />

      <div className="editorHeader">
        {projects && projects.length > 1 ? (
          <button
            type="button"
            className="buttonInline editorHeader-currentProjectButton _button-projects-menu"
            onClick={handleProjectNameClick}
          >
            {project?.projectName}
          </button>
        ) : (
          <span className="buttonInline editorHeader-currentProject">
            {project?.projectName}
          </span>
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

      <Tooltip
        content={`Case sensitive ${searchParams[ESearchParams.caseSensitive] ? 'enabled' : 'disabled'}`}
        anchor="._casing-tooltip-anchor"
        size="small"
      />

      <Tooltip
        content={`Exact match ${searchParams[ESearchParams.exactMatch] ? 'enabled' : 'disabled'}`}
        anchor="._exact-tooltip-anchor"
        size="small"
      />

      <Tooltip
        content="Advanced settings..."
        anchor="._advanced-tooltip-anchor"
        size="small"
      />

      {project && (
        <>
          <Tooltip
            content="New Key"
            anchor="._new-key"
            size="small_autosize"
            nightMode
          />

          <Tooltip
            content="New Folder"
            anchor="._new-folder"
            size="small_autosize"
            nightMode
          />

          <Tooltip
            content="Edit"
            anchor="._entity-edit"
            size="small_autosize"
            nightMode
          />

          <Tooltip
            content="Move"
            anchor="._entity-move"
            size="small_autosize"
            nightMode
          />

          <Tooltip
            content="Delete"
            anchor="._entity-delete"
            size="small_autosize"
            nightMode
          />
        </>
      )}

      {isSortingMenuVisible && (
        <Dropdown
          anchor="._button-sorting"
          onOutsideClick={() => setIsSortingMenuVisible(false)}
          classNames="editorFiltersDropdown"
        >
          <div className="editorSorting">
            <button
              type="button"
              className={clsx('button ghost editorSorting-button', { isActive: sorting.sortBy === ESorting.created && sorting.sortDirection === ESortDirection.asc })}
              onClick={() => handleSortingButtonClick(ESorting.created, ESortDirection.asc)}
            >
              Newest First
            </button>
            <button
              type="button"
              className={clsx('button ghost editorSorting-button', { isActive: sorting.sortBy === ESorting.created && sorting.sortDirection === ESortDirection.desc })}
              onClick={() => handleSortingButtonClick(ESorting.created, ESortDirection.desc)}
            >
              Oldest First
            </button>
            <button
              type="button"
              className={clsx('button ghost editorSorting-button', { isActive: sorting.sortBy === ESorting.name && sorting.sortDirection === ESortDirection.asc })}
              onClick={() => handleSortingButtonClick(ESorting.name, ESortDirection.asc)}
            >
              By Name A - Z
            </button>
            <button
              type="button"
              className={clsx('button ghost editorSorting-button', { isActive: sorting.sortBy === ESorting.name && sorting.sortDirection === ESortDirection.desc })}
              onClick={() => handleSortingButtonClick(ESorting.name, ESortDirection.desc)}
            >
              By Name Z - A
            </button>
            <button
              type="button"
              className={clsx('button ghost editorSorting-button', { isActive: sorting.sortBy === ESorting.type && sorting.sortDirection === ESortDirection.asc })}
              onClick={() => handleSortingButtonClick(ESorting.type, ESortDirection.asc)}
            >
              By Type A - Z
            </button>
            <button
              type="button"
              className={clsx('button ghost editorSorting-button', { isActive: sorting.sortBy === ESorting.type && sorting.sortDirection === ESortDirection.desc })}
              onClick={() => handleSortingButtonClick(ESorting.type, ESortDirection.desc)}
            >
              By Type Z - A
            </button>
          </div>
        </Dropdown>
      )}

      {isFiltersMenuVisible && (
        <Dropdown
          anchor="._button-filters"
          onOutsideClick={() => setIsFiltersMenuVisible(false)}
          classNames="editorFiltersDropdown"
        >
          <div className="editorFilters">
            <div className="editorFilters-row">
              <label className="editorFilters-control">
                <span className="editorFilters-controlLabel">Hide Partially Populated Keys</span>
                <input
                  type="checkbox"
                  className="switcher"
                  checked={filters[EFilter.hidePartiallyPopulated]}
                  onChange={(e) => handleFilteringSwitcherChange(e, { filter: EFilter.hidePartiallyPopulated })}
                />
              </label>
            </div>
            <div className="editorFilters-row">
              <label className="editorFilters-control">
                <span className="editorFilters-controlLabel">Hide Fully Populated Keys</span>
                <input
                  type="checkbox"
                  className="switcher"
                  checked={filters[EFilter.hideFullyPopulated]}
                  onChange={(e) => handleFilteringSwitcherChange(e, { filter: EFilter.hideFullyPopulated })}
                />
              </label>
            </div>
            <div className="editorFilters-row">
              <label className="editorFilters-control">
                <span className="editorFilters-controlLabel">Hide Empty</span>
                <input
                  type="checkbox"
                  className="switcher"
                  checked={filters[EFilter.hideEmpty]}
                  onChange={(e) => handleFilteringSwitcherChange(e, { filter: EFilter.hideEmpty })}
                />
              </label>
            </div>
            <div className="editorFilters-separator" />
            <div className="editorFilters-row">
              <label className="editorFilters-control">
                <span className="editorFilters-controlLabel">Hide Folders</span>
                <input
                  type="checkbox"
                  className="switcher"
                  checked={filters[EFilter.hideFolders]}
                  onChange={(e) => handleFilteringSwitcherChange(e, { filter: EFilter.hideFolders })}
                />
              </label>
            </div>
            <div className="editorFilters-row">
              <label className="editorFilters-control">
                <span className="editorFilters-controlLabel">Hide Components</span>
                <input
                  type="checkbox"
                  className="switcher"
                  checked={filters[EFilter.hideComponents]}
                  onChange={(e) => handleFilteringSwitcherChange(e, { filter: EFilter.hideComponents })}
                />
              </label>
            </div>
            <div className="editorFilters-row">
              <label className="editorFilters-control">
                <span className="editorFilters-controlLabel">Hide Keys</span>
                <input
                  type="checkbox"
                  className="switcher"
                  checked={filters[EFilter.hideKeys]}
                  onChange={(e) => handleFilteringSwitcherChange(e, { filter: EFilter.hideKeys })}
                />
              </label>
            </div>
          </div>
        </Dropdown>
      )}

      <section className="editorToolbar">
        <div className="editorSearch">
          <input
            type="text"
            className="input editorSearch-input"
            placeholder="Search..."
            value={searchQuery || ''}
            onChange={handleSearchQueryChange}
          />
          <div className="editorSearch-controls">
            <i
              className={`_casing-tooltip-anchor editorSearch-control editorSearch-control_casing ${searchParams[ESearchParams.caseSensitive] ? 'isActive' : ''}`}
              onClick={() => handleSearchParamChange(ESearchParams.caseSensitive)}
            />
            <i
              className={`_exact-tooltip-anchor editorSearch-control editorSearch-control_exactMatch ${searchParams[ESearchParams.exactMatch] ? 'isActive' : ''}`}
              onClick={() => handleSearchParamChange(ESearchParams.exactMatch)}
            />
            <i
              className={`_advanced-tooltip-anchor editorSearch-control editorSearch-control_advanced ${extendedSearchModalVisible ? 'isActive' : ''}`}
              onClick={handleExtendedSearchClick}
            />
          </div>
        </div>

        <div className="editorControls">
          <button
            type="button"
            className="button primary editorControls-button _button-sorting"
            onClick={handleSortByButtonClick}
          >
            Sort by
          </button>

          <button
            type="button"
            className="button primary editorControls-button _button-filters"
            onClick={handleFiltersButtonClick}
          >
            Filters
          </button>
        </div>

        <div className="editorCreateBlock">
          <button
            type="button"
            className="button success editorToolbar-createKeyButton"
            onClick={() => handleNewKeyClick(EntityType.String)}
          >
            Key
          </button>

          <button
            type="button"
            className="button success editorToolbar-createKeyButton"
            onClick={() => handleNewKeyClick(EntityType.Folder)}
          >
            Folder
          </button>

          <button
            type="button"
            className="button success editorToolbar-createKeyButton"
            onClick={() => handleNewKeyClick(EntityType.Component)}
          >
            Component
          </button>
        </div>
      </section>

      {project && (
        <Breadcrumbs project={project} />
      )}

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
            page={page}
            totalCount={project.keysTotalCount}
            itemsPerPage={itemsPerPage}
            navigationData={{
              page,
              itemsPerPage,
              sorting,
              filters,
            }}
          />
        </div>
      )}
      <Footer />
    </>
  );
}
