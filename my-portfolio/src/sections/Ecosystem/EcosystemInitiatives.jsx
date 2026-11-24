
import { Link } from "react-router-dom";

const initiatives = [
  {
    number: "01",
    category: "OPEN-SOURCE DEVELOPMENT",
    name: "FIGK-JASHEY",
    tagline: "Open source. Open possibilities.",
    description:
      "A space dedicated to open-source development, " +
      "where people can explore projects, contribute " +
      "ideas and build together.",
    detail:
      "Anyone can join and contribute.",
    link: "/ecosystem/jashey",
    linkLabel: "Explore JASHEY",
    status: "Explore the initiative",
    className: "jashey",
  },
  {
    number: "02",
    category: "WRITING & PUBLICATIONS",
    name: "FIGK-SKAMARA",
    tagline: "Ideas expressed through words.",
    description:
      "A creative space for articles, writing, " +
      "perspectives and publications.",
    detail:
      "Coming soon! Articles will be published here.",
    link: "/ecosystem/skamara",
    linkLabel: "Explore SKAMARA",
    status: "Coming soon",
    className: "skamara",
  },
];

function EcosystemInitiatives() {
  return (
    <section className="ecosystem-initiatives">
      <div className="container">

        <div className="ecosystem-section-heading">
          <div>
            <p className="ecosystem-eyebrow">
              THE INITIATIVES / 02
            </p>

            <h2>
              Two directions.
              <span>One identity.</span>
            </h2>
          </div>

          <p>
            Each initiative has a distinct focus,
            while sharing the independent spirit
            of FIGK.
          </p>
        </div>

        <div className="ecosystem-initiatives__grid">

          {initiatives.map((initiative) => (
            <article
              key={initiative.number}
              className={`ecosystem-card ecosystem-card--${initiative.className}`}
            >
              <div className="ecosystem-card__top">
                <span className="ecosystem-card__number">
                  {initiative.number}
                </span>

                <span className="ecosystem-card__category">
                  {initiative.category}
                </span>
              </div>

              <div className="ecosystem-card__content">
                <h3>{initiative.name}</h3>

                <h4>{initiative.tagline}</h4>

                <p className="ecosystem-card__description">
                  {initiative.description}
                </p>

                <p className="ecosystem-card__detail">
                  {initiative.detail}
                </p>
              </div>

              <div className="ecosystem-card__bottom">
                <span className={
                  `ecosystem-card__status ecosystem-card__status--${initiative.className}`
                }>
                  {initiative.status}
                </span>

                <Link
                  to={initiative.link}
                  className="ecosystem-card__link"
                  aria-label={initiative.linkLabel}
                >
                  Explore <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          ))}

        </div>
      </div>
    </section>
  );
}

export default EcosystemInitiatives;
