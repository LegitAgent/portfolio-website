import './Projects.css';
import { CLOUDFLARE_GATEWAY } from '../../config/constants.ts';
import ProjectsDisplay from '../../components/ProjectsDisplay/ProjectsDisplay.tsx';
import LoadingScreen from '../Misc/LoadingScreen.tsx';
import ErrorScreen from '../Misc/ErrorScreen.tsx';
import { useState, useEffect } from 'react';
import type { ProjectResponse } from '../../types/project.ts';

const projectGatewayURL = CLOUDFLARE_GATEWAY + 'api/db/projects'; // path to project db

function Projects() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<ProjectResponse | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);

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

  if (hasError) {
    return <ErrorScreen />;
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  const featuredProjects =
    projects?.results?.filter((project) => Number(project.featured) === 1) ?? [];
  const otherProjects =
    projects?.results?.filter((project) => Number(project.featured) !== 1) ?? [];

  return (
    <main className="projectsPage">
      <header className="projectsHeader">
        <p>Selected work</p>
        <h1>Projects</h1>
        <span>
          A collection of applications, experiments, and systems I have built while learning
          and working across the stack.
        </span>
      </header>

      {featuredProjects.length > 0 && (
        <section className="projectsSection projectsSection--featured">
          <div className="projectsSectionHeading">
            <div>
              <span>01</span>
              <h2>Featured Projects</h2>
            </div>
            <p>{featuredProjects.length} selected</p>
          </div>

          <div className="projectList projectList--featured">
            {featuredProjects.map((project) => (
              <ProjectsDisplay key={project.project_name} project={project} />
            ))}
          </div>
        </section>
      )}

      {otherProjects.length > 0 && (
        <section className="projectsSection">
          <div className="projectsSectionHeading">
            <div>
              <span>{featuredProjects.length > 0 ? '02' : '01'}</span>
              <h2>Other Projects</h2>
            </div>
            <p>{otherProjects.length} projects</p>
          </div>

          <div className="projectList">
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
