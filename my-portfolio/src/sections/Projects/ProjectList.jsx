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

          <p>
            {content.sectionDescription}
          </p>
        </div>

        <ul className="project-list__items">

          {content.items.map((project, index) => (
            <li
              className="project-row"
              key={project.id}
            >
              <span className="project-row__number">
                {String(index + 1).padStart(2, "0")}
              </span>

              {project.image ? (
                <img
                  className="project-row__image"
                  src={project.image}
                  alt=""
                />
              ) : (
                <div className="project-row__image-placeholder">
                  Project photo
                </div>
              )}

              <h3>{project.name}</h3>

              {project.status && (
                <span className="project-row__status">
                  {project.status}
                </span>
              )}
            </li>
          ))}

        </ul>

      </div>
    </section>
  );
}

export default ProjectList;