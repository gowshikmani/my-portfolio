
import { Link } from "react-router-dom";
import { articles } from "../../data/articles";
import "../../sections/Skamara/Skamara.css";

const skamaraContent = {
  title: "SKAMARA",
  tagline: "A space for writing, ideas and expression.",

  announcementTitle: "Coming soon!",
  announcementDescription:
    "Articles will be published here.",
  announcementAccent: "WORDS. IDEAS. EXPRESSION.",

  articlesTitle: "Published articles.",
};

function Skamara() {
  return (
    <main className="skamara-page">

      {/* HERO */}
      <section className="skamara-hero">
        <img
          className="skamara-page__logo"
          src="/logos/skamara.png"
          alt="SKAMARA logo"
        />

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
              <h1>{skamaraContent.title}</h1>

              <p className="skamara-hero__tagline">
                {skamaraContent.tagline}
              </p>
            </div>

            <div className="skamara-hero__announcement">
              <span className="skamara-hero__announcement-label">
                AN ANNOUNCEMENT
              </span>

              <h2>{skamaraContent.announcementTitle}</h2>

              <p>
                {skamaraContent.announcementDescription}
              </p>

              <span className="skamara-hero__accent">
                {skamaraContent.announcementAccent}
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

      {/* ARTICLES */}
      <section
        className="skamara-articles"
        id="skamara-articles"
      >
        <div className="container">

          <div className="skamara-articles__heading">
            <p className="skamara-eyebrow">
              WRITING / 01
            </p>

            <h2>{skamaraContent.articlesTitle}</h2>
          </div>

          {articles.length > 0 ? (
            <ul className="skamara-articles__grid">

              {articles.map((article) => (
                <li
                  className="skamara-article"
                  key={article.id}
                >
                  <h3>{article.title}</h3>

                  <div className="skamara-article__meta">
                    {article.author && (
                      <span>{article.author}</span>
                    )}

                    {article.type && (
                      <span>{article.type}</span>
                    )}

                    {article.date && (
                      <time dateTime={article.date}>
                        {article.date}
                      </time>
                    )}
                  </div>

                  {article.description && (
                    <p>{article.description}</p>
                  )}

                  {article.url && (
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Read article
                      <span aria-hidden="true"> ↗</span>
                    </a>
                  )}
                </li>
              ))}

            </ul>
          ) : (
            <p className="skamara-articles__empty">
              Coming soon! Articles will be published here.
            </p>
          )}

        </div>
      </section>

    </main>
  );
}

export default Skamara;
