
import { Link } from "react-router-dom";

function JasheyClosing() {
  return (
    <section className="jashey-closing">
      <div className="container jashey-closing__inner">
        <p className="jashey-eyebrow">
          FIGK-JASHEY / 04
        </p>

        <h2>
          Ideas are better
          <span>when we build together.</span>
        </h2>

        <p>
          Explore the FIGK ecosystem and follow the
          development of JASHEY.
        </p>

        <div className="jashey-closing__actions">
          <Link
            to="/projects"
            className="jashey-button"
          >
            Explore projects <span aria-hidden="true">↗</span>
          </Link>

          <Link
            to="/ecosystem"
            className="jashey-text-link"
          >
            Back to ecosystem →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default JasheyClosing;
