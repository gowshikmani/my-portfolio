
import ProjectsHero from "../../sections/Projects/ProjectsHero";
import ProjectList from "../../sections/Projects/ProjectList";
import { projectsContent } from "../../data/projects";

import "../../sections/Projects/Projects.css";

function Projects() {
  return (
    <main className="projects-page">
      <ProjectsHero content={projectsContent} />
      <ProjectList content={projectsContent} />
    </main>
  );
}

export default Projects;
