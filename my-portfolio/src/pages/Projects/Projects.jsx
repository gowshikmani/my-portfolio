import ProjectsHero from "../../sections/Projects/ProjectsHero";
import ProjectList from "../../sections/Projects/ProjectList";

import "../../sections/Projects/Projects.css";

function Projects() {
  return (
    <main className="projects-page">
      <ProjectsHero />
      <ProjectList />
    </main>
  );
}

export default Projects;