const projects = [
  {
    number: "01",
    name: "BAWSAQ",
    status: "TBA",
  },
  {
    number: "02",
    name: "Scoldish ML",
    status: "TBA",
  },
  {
    number: "03",
    name: "Aquity ML",
    status: "TBA",
  },
  {
    number: "04",
    name: "Portfolio",
  },
];

function ProjectList() {
  return (
    <section className="project-list">
      <div className="container">

        <div className="project-list__heading">
          <div>
            <p className="projects-eyebrow">
              THE PROJECT INDEX / 02
            </p>

            <h2>Projects.</h2>
          </div>

          <p>
            A growing collection of ideas and
            independent work.
          </p>
        </div>

        <div className="project-list__items">

          {projects.map((project) => (
            <article
              className="project-row"
              key={project.number}
            >
              <span className="project-row__number">
                {project.number}
              </span>

              <h3>{project.name}</h3>

              {project.status && (
                <span className="project-row__status">
                  {project.status}
                </span>
              )}
            </article>
          ))}

        </div>

      </div>
    </section>
  );
}

export default ProjectList;