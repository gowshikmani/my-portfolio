
import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <main className="not-found container">

      <div className="not-found__layout">

        {/* Error number */}
        <div className="not-found__visual">
          <span className="not-found__number">
            404
          </span>

          <span className="not-found__visual-label">
            PAGE NOT FOUND
          </span>
        </div>

        {/* Error message */}
        <div className="not-found__content">

          <p className="not-found__eyebrow">
            FIGK / LOST IN NAVIGATION
          </p>

          <h1>
            A page out of place.
          </h1>

          <p className="not-found__description">
            The page you're looking for doesn't exist,
            may have moved, or the address might be
            incorrect.
          </p>

          <Link
            to="/"
            className="not-found__home-link"
          >
            Return to homepage
            <span aria-hidden="true">→</span>
          </Link>

          <p className="not-found__signature">
            INDEPENDENT BY IDENTITY.
          </p>

        </div>

      </div>

    </main>
  );
}

export default NotFound;
