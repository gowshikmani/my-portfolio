
import { Link } from "react-router-dom";

function JasheyHero({ content }) {
  return (
    <section className="jashey-hero">
      <img
        className="jashey-page__logo"
        src="/logos/jashey.png"
        alt="JASHEY logo"
      />
      <div className="container jashey-hero__inner">

        <p className="jashey-eyebrow">
          FIGK / ECOSYSTEM / JASHEY
        </p>

        <div
          className={`jashey-hero__layout ${
            content.heroImage ? "jashey-hero__layout--with-image" : ""
          }`}
        >
          <div>
            <h1>
              {content.titleLine1}
              <span>{content.titleLine2}</span>
            </h1>

            <p className="jashey-hero__description">{content.description}</p>

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
          </div>

          {content.heroImage && (
            <img
              className="jashey-hero__image"
              src={content.heroImage}
              alt=""
            />
          )}
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
