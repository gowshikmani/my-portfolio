
function ProjectList({ content }) {
  return (
    <section className="project-list">
      <div className="container">

        <div className="project-list__heading">
          <div>
            <p className="projects-eyebrow">
              THE PROJECT INDEX / 02
            </p>

            <h2>{content.sectionTitle}</h2>
          </div>

          <p>{content.sectionDescription}</p>
        </div>

        <ul className="project-list__items">
          {content.items.map((project, index) => (
            <li className="project-row" key={project.id}>

              <span className="project-row__number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="project-row__content">
                <h3>{project.name}</h3>

                {project.description && (
                  <p>{project.description}</p>
                )}

                <div className="project-row__details">

                  {project.status && (
                    <span className="project-row__status">
                      {project.status}
                    </span>
                  )}

                  {project.url && (
                    <a
                      className="project-row__link"
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View project <span aria-hidden="true">↗</span>
                    </a>
                  )}

                </div>
              </div>

            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}

export default ProjectList;
