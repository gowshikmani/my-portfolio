
import { Link } from "react-router-dom";

function AboutHero() {
  return (
    <section className="about-hero">
      <div className="container about-hero__layout">

        <div className="about-hero__content">
          <p className="about-eyebrow">ABOUT FIGK / 01</p>

          <h1>
            More than a name.
            <span>An independent identity.</span>
          </h1>

          <p className="about-hero__description">
            An independent space for ideas, creativity,
            technology and expression.
          </p>

          <Link to="/ecosystem" className="about-text-link">
            Discover the FIGK ecosystem <span>→</span>
          </Link>
        </div>

        <div className="about-hero__side">
          <p className="about-hero__side-label">
            INDEPENDENT CREATIVE BRAND
          </p>

          <p className="about-hero__side-text">
            FIGK brings together different interests and
            forms of creative expression under one
            independent identity.
          </p>

          <div className="about-hero__founder">
            <span>FOUNDED BY</span>
            <h2>Gowshik Manikandan</h2>
          </div>
        </div>

      </div>
    </section>
  );
}

export default AboutHero;
