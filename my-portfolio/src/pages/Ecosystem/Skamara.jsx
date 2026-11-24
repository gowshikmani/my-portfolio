
import { Link } from "react-router-dom";
import {
  ContentImageField,
  ContentTextField,
  default as PrivateContentEditor,
} from "../../components/PrivateContentEditor/PrivateContentEditor";
import { useSiteContent } from "../../hooks/useSiteContent";
import "../../sections/Skamara/Skamara.css";

function Skamara() {
  const { content, error, saveSection } = useSiteContent();

  if (!content) {
    return (
      <main className="skamara-page">
        <div className="container">
          <p role="status">{error || "Loading SKAMARA content..."}</p>
        </div>
      </main>
    );
  }

  const skamara = content.skamara;

  return (
    <main className="skamara-page">
      <div className="container">
        {error && <p role="status">{error}</p>}
        <PrivateContentEditor
          section="skamara"
          title="SKAMARA photos and titles"
          value={skamara}
          onSave={saveSection}
        >
          {({ draft, updateField, updateItem, addItem, removeItem }) => (
            <div className="content-editor__grid">
              <div className="content-editor__group">
                <h3>SKAMARA page title and photo</h3>
                <ContentTextField
                  label="Page title"
                  value={draft.title}
                  onChange={(value) => updateField("title", value)}
                />
                <ContentTextField
                  label="Announcement title"
                  value={draft.announcementTitle}
                  onChange={(value) =>
                    updateField("announcementTitle", value)
                  }
                />
                <ContentImageField
                  label="Page photo"
                  value={draft.heroImage}
                  onChange={(value) => updateField("heroImage", value)}
                />
              </div>
              <div className="content-editor__group">
                <h3>Articles</h3>
                <ContentTextField
                  label="Articles section title"
                  value={draft.articlesTitle}
                  onChange={(value) => updateField("articlesTitle", value)}
                />
                {draft.articles.map((article) => (
                  <div className="content-editor__group" key={article.id}>
                    <ContentTextField
                      label="Article title"
                      value={article.title}
                      onChange={(value) =>
                        updateItem("articles", article.id, "title", value)
                      }
                    />
                    <ContentTextField
                      label="Article link (required)"
                      value={article.url}
                      inputType="url"
                      onChange={(value) =>
                        updateItem("articles", article.id, "url", value)
                      }
                    />
                    <ContentTextField
                      label="Description"
                      value={article.description}
                      multiline
                      onChange={(value) =>
                        updateItem(
                          "articles",
                          article.id,
                          "description",
                          value
                        )
                      }
                    />
                    <ContentImageField
                      label="Article photo (optional)"
                      value={article.image}
                      onChange={(value) =>
                        updateItem("articles", article.id, "image", value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeItem("articles", article.id)}
                    >
                      Remove article
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    addItem("articles", {
                      id: `article-${crypto.randomUUID()}`,
                      title: "New article",
                      description: "",
                      url: "",
                      image: "",
                    })
                  }
                >
                  Add article
                </button>
              </div>
            </div>
          )}
        </PrivateContentEditor>
      </div>

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
              <h1>{skamara.title}</h1>

              <p className="skamara-hero__tagline">
                {skamara.tagline}
              </p>
              {skamara.heroImage && (
                <img
                  className="skamara-hero__image"
                  src={skamara.heroImage}
                  alt=""
                />
              )}
            </div>

            <div className="skamara-hero__announcement">
              <span className="skamara-hero__announcement-label">
                AN ANNOUNCEMENT
              </span>

              <h2>{skamara.announcementTitle}</h2>

              <p>
                {skamara.announcementDescription}
              </p>

              <span className="skamara-hero__accent">
                {skamara.announcementAccent}
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

      <section className="skamara-articles" id="skamara-articles">
        <div className="container">
          <div className="skamara-articles__heading">
            <p className="skamara-eyebrow">WRITING / 01</p>
            <h2>{skamara.articlesTitle}</h2>
          </div>
          {skamara.articles.length ? (
            <div className="skamara-articles__grid">
              {skamara.articles.map((article) => (
                <article className="skamara-article" key={article.id}>
                  {article.image && (
                    <img src={article.image} alt="" />
                  )}
                  <h3>{article.title}</h3>
                  {article.description && <p>{article.description}</p>}
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Read article <span aria-hidden="true">↗</span>
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <p className="skamara-articles__empty">
              Articles will be published here.
            </p>
          )}
        </div>
      </section>

    </main>
  );
}

export default Skamara;