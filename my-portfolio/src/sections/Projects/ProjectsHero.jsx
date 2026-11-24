function ProjectsHero({ content }) {
  return (
    <section className="projects-hero">
      <div className="container projects-hero__inner">

        <p className="projects-eyebrow">
          FIGK / PROJECTS / 01
        </p>

        <h1>
          {content.heroTitle}
          <span>{content.heroAccent}</span>
        </h1>

        <p className="projects-hero__description">
          {content.heroDescription}
        </p>

      </div>
    </section>
  );
}

export default ProjectsHero;