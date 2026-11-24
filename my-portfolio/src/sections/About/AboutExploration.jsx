
import { Link } from "react-router-dom";

const explorations = [
  {
    number: "01",
    title: "Technology",
    description:
      "Exploring software, artificial intelligence and digital ideas through development and experimentation.",
    link: "/projects",
    linkLabel: "Explore projects",
  },
  {
    number: "02",
    title: "Open source",
    description:
      "Building an open environment for development, shared ideas and collaboration.",
    link: "/ecosystem/jashey",
    linkLabel: "Discover JASHEY",
  },
  {
    number: "03",
    title: "Writing",
    description:
      "Expressing ideas, perspectives and stories through words and creative publications.",
    link: "/ecosystem/skamara",
    linkLabel: "Discover SKAMARA",
  },
  {
    number: "04",
    title: "Experimentation",
    description:
      "Exploring unfamiliar questions, creative possibilities and ideas that deserve a chance to develop.",
    link: "/projects",
    linkLabel: "Explore projects",
  },
];

function AboutExploration() {
  return (
    <section className="about-exploration">
      <div className="container">

        <div className="about-section-heading">
          <div>
            <p className="about-eyebrow">AREAS OF INTEREST / 03</p>
            <h2>What FIGK explores.</h2>
          </div>

          <p>
            Different directions. Different possibilities.
            One independent space.
          </p>
        </div>

        <div className="about-exploration__grid">
          {explorations.map((item) => (
            <article
              className="about-exploration__card"
              key={item.number}
            >
              <span className="about-exploration__number">
                {item.number}
              </span>

              <h3>{item.title}</h3>

              <p>{item.description}</p>

              <Link
                to={item.link}
                className="about-text-link"
              >
                {item.linkLabel} <span>→</span>
              </Link>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

export default AboutExploration;
