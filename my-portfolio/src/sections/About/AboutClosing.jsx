
import { Link } from "react-router-dom";

function AboutClosing() {
  return (
    <section className="about-closing">
      <div className="container about-closing__inner">

        <p className="about-eyebrow">
          THE FIGK PERSPECTIVE / 05
        </p>

        <h2>
          Stay curious.
          <span>Stay independent.</span>
        </h2>

        <p>
          Ideas have different beginnings and different
          destinations. Explore what FIGK brings together.
        </p>

        <Link
          to="/ecosystem"
          className="about-closing__link"
        >
          Explore the ecosystem <span>→</span>
        </Link>

      </div>
    </section>
  );
}

export default AboutClosing;
