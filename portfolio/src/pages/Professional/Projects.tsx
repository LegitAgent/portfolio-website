import './Projects.css';
import { CLOUDFLARE_GATEWAY } from '../../config/constants.ts';
import ProjectsDisplay from '../../components/ProjectsDisplay/ProjectsDisplay.tsx';
import LoadingScreen from '../Misc/LoadingScreen.tsx';
import ErrorScreen from '../Misc/ErrorScreen.tsx';
import Fuse from 'fuse.js';
import { useState, useEffect, useMemo } from 'react';
import type { ProjectResponse } from '../../types/project.ts';

const projectGatewayURL = CLOUDFLARE_GATEWAY + 'api/db/projects'; // path to project db

function Projects() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<ProjectResponse | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(projectGatewayURL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        setProjects(json);
        setIsLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
      });
  }, []);

  const projectResults = useMemo(() => projects?.results ?? [], [projects?.results]);
  const projectSearch = useMemo(() =>
      new Fuse(projectResults, {
        keys: [
          { name: 'project_name', weight: 0.8 },
          { name: 'tags', weight: 0.15 },
          { name: 'project_description', weight: 0.05 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
        minMatchCharLength: 2,
        shouldSort: true,
      }),
    [projectResults],
  );
  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim();
    return query ? projectSearch.search(query).map((result) => result.item) : projectResults;
  }, [projectResults, projectSearch, searchQuery]);

  if (hasError) {
    return <ErrorScreen />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  const featuredProjects = filteredProjects.filter((project) => Number(project.featured) === 1);
  const otherProjects = filteredProjects.filter((project) => Number(project.featured) !== 1);

  return (
    <main className='projectsPage'>
      <header className='projectsHeader'>
        <p>Selected work</p>
        <h1>Projects</h1>
        <span>A collection of applications, experiments, and systems I have built while learning and working across the stack.</span>
      </header>

      <div className='projectSearch'>
        <svg viewBox='0 0 24 24' aria-hidden='true'>
          <circle cx='11' cy='11' r='7' />
          <path d='m20 20-4-4' />
        </svg>
        <input
          type='search'
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder='Search projects...'
          aria-label='Search projects'
        />
        {searchQuery && (
          <button type='button' onClick={() => setSearchQuery('')} aria-label='Clear project search'>
            <svg viewBox='0 0 24 24' aria-hidden='true'>
              <path d='m7 7 10 10' />
              <path d='M17 7 7 17' />
            </svg>
          </button>
        )}
      </div>

      {filteredProjects.length === 0 && (
        <div className='projectSearchEmpty'>
          <p>No projects found.</p>
          <span>Try a different name or keyword.</span>
        </div>
      )}

      {featuredProjects.length > 0 && (
        <section className='projectsSection projectsSection--featured'>
          <div className='projectsSectionHeading'>
            <div>
              <span>01</span>
              <h2>Featured Projects</h2>
            </div>
            <p>{featuredProjects.length} selected</p>
          </div>

          <div className='projectList projectList--featured'>
            {featuredProjects.map((project) => (
              <ProjectsDisplay key={project.project_name} project={project} />
            ))}
          </div>
        </section>
      )}

      {otherProjects.length > 0 && (
        <section className='projectsSection'>
          <div className='projectsSectionHeading'>
            <div>
              <span>{featuredProjects.length > 0 ? '02' : '01'}</span>
              <h2>Other Projects</h2>
            </div>
            <p>{otherProjects.length} projects</p>
          </div>

          <div className='projectList'>
            {otherProjects.map((project) => (
              <ProjectsDisplay key={project.project_name} project={project} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export default Projects;
