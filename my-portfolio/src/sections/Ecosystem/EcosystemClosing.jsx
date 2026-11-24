
import { Link } from "react-router-dom";

function EcosystemClosing() {
  return (
    <section className="ecosystem-closing">
      <div className="container ecosystem-closing__inner">

        <p className="ecosystem-eyebrow">
          THE FIGK ECOSYSTEM / 03
        </p>

        <h2>
          Different expressions.
          <span>One independent identity.</span>
        </h2>

        <p>
          Explore the initiatives, discover their
          individual directions and follow their journey.
        </p>

        <Link
          to="/about"
          className="ecosystem-closing__link"
        >
          More about FIGK <span>→</span>
        </Link>

      </div>
    </section>
  );
}

export default EcosystemClosing;
