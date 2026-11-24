
import { Link } from "react-router-dom";
import "../../sections/Skamara/Skamara.css";

function Skamara() {
  return (
    <main className="skamara-page">

      <section className="skamara-hero">
        <div className="container skamara-hero__inner">

          <div className="skamara-hero__top">
            <p className="skamara-eyebrow">
              FIGK / ECOSYSTEM / SKAMARA
            </p>

            <span className="skamara-hero__category">
              WRITING & PUBLICATIONS
            </span>
          </div>

          <div className="skamara-hero__content">

            <div className="skamara-hero__identity">
              <h1>FIGK-SKAMARA</h1>

              <p className="skamara-hero__tagline">
                Ideas expressed through words.
              </p>
            </div>

            <div className="skamara-hero__announcement">
              <span className="skamara-hero__announcement-label">
                AN ANNOUNCEMENT
              </span>

              <h2>Coming soon!</h2>

              <p>
                Articles will be published here.
              </p>

              <span className="skamara-hero__accent">
                More to come.
              </span>
            </div>

          </div>

          <div className="skamara-hero__bottom">

            <Link
              to="/ecosystem"
              className="skamara-hero__back"
            >
              <span aria-hidden="true">←</span>
              Back to ecosystem
            </Link>

            <span className="skamara-hero__signature">
              WORDS. IDEAS. EXPRESSION.
            </span>

          </div>

        </div>
      </section>

    </main>
  );
}

export default Skamara;