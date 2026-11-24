
import { Link } from "react-router-dom";
import Logo from "../../components/Logo/Logo";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">
      <div className="container hero__layout">

        {/* Main introduction */}
        <div className="hero__content">

          <p className="hero__eyebrow">
            An independent creative brand
          </p>

          <h1 className="hero__heading">
            Independent
            <span>by identity.</span>
          </h1>

          <p className="hero__description">
            A space for ideas, creativity and independent
            thinking.
          </p>

          <p className="hero__supporting-text">
            FIGK brings together technology, open-source
            development, writing and creative exploration
            under one independent identity.
          </p>

          <div className="hero__actions">
            <Link
              to="/about"
              className="hero__button hero__button--primary"
            >
              Explore FIGK
              <span aria-hidden="true">↗</span>
            </Link>

            <Link
              to="/founder"
              className="hero__button hero__button--secondary"
            >
              Meet the founder
              <span aria-hidden="true">→</span>
            </Link>
          </div>

        </div>

        {/* Brand and founder introduction */}
        <aside className="hero__aside">

          <Logo size={76} alt="FIGK official logo" />

          <p className="hero__aside-label">
            AN INDEPENDENT IDENTITY
          </p>

          <div className="hero__founder">
            <span>FOUNDED BY</span>

            <h2>Gowshik Manikandan</h2>
          </div>

          <div className="hero__explores">
            <span>EXPLORING</span>

            <p>Technology</p>
            <p>Open-source development</p>
            <p>Writing and creative ideas</p>
          </div>

          <p className="hero__signature">
            FIGK — INDEPENDENT BY IDENTITY.
          </p>

        </aside>

      </div>

      {/* Bottom information */}
      <div className="container hero__bottom">
        <span>INDEPENDENTLY CREATED</span>
        <span>IDEAS WITHOUT BOUNDARIES.</span>
      </div>

    </section>
  );
}

export default Hero;
