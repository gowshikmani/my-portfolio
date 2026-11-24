
import { Link } from "react-router-dom";

function JasheyHero() {
  return (
    <section className="jashey-hero">
      <div className="container jashey-hero__inner">

        <p className="jashey-eyebrow">
          FIGK / ECOSYSTEM / JASHEY
        </p>

        <h1>
          Open source.
          <span>Open possibilities.</span>
        </h1>

        <p className="jashey-hero__description">
          FIGK-JASHEY is an open-source development
          initiative where people can explore ideas,
          contribute and build together.
        </p>

        <div className="jashey-hero__actions">
          <a
            href="#jashey-approach"
            className="jashey-button"
          >
            Discover JASHEY
            <span>↓</span>
          </a>

          <Link
            to="/ecosystem"
            className="jashey-text-link"
          >
            Back to ecosystem →
          </Link>
        </div>

        <div className="jashey-hero__signature">
          <span>OPEN DEVELOPMENT</span>
          <span>/</span>
          <span>SHARED IDEAS</span>
          <span>/</span>
          <span>COLLABORATION</span>
        </div>

      </div>
    </section>
  );
}

export default JasheyHero;
