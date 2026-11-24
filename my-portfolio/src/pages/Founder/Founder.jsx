import {
  ContentImageField,
  ContentTextField,
  default as PrivateContentEditor,
} from "../../components/PrivateContentEditor/PrivateContentEditor";
import { useSiteContent } from "../../hooks/useSiteContent";
import "./Founder.css";

function Founder() {
  const { content, error, saveSection } = useSiteContent();

  if (!content) {
    return (
      <main className="founder-page">
        <div className="container">
          <p role="status">{error || "Loading founder content..."}</p>
        </div>
      </main>
    );
  }

  const founder = content.founder;

  return (
    <main className="founder-page">
      <div className="container">
        {error && <p role="status">{error}</p>}
        <PrivateContentEditor
          section="founder"
          title="founder photos and titles"
          value={founder}
          onSave={saveSection}
        >
          {({ draft, updateField, updateItem, addItem, removeItem }) => (
            <div className="content-editor__grid">
              <div className="content-editor__group">
                <h3>Founder profile</h3>
                <ContentTextField
                  label="Page title"
                  value={draft.pageTitle}
                  onChange={(value) => updateField("pageTitle", value)}
                />
                <ContentTextField
                  label="Founder name"
                  value={draft.name}
                  onChange={(value) => updateField("name", value)}
                />
                <ContentImageField
                  label="Portrait"
                  value={draft.portrait}
                  onChange={(value) => updateField("portrait", value)}
                />
              </div>

              <div className="content-editor__group">
                <h3>Highlights</h3>
                <ContentTextField
                  label="Section title"
                  value={draft.highlightsTitle}
                  onChange={(value) => updateField("highlightsTitle", value)}
                />
                {draft.highlights.map((highlight) => (
                  <div className="content-editor__group" key={highlight.id}>
                    <ContentTextField
                      label="Photo title"
                      value={highlight.title}
                      onChange={(value) =>
                        updateItem("highlights", highlight.id, "title", value)
                      }
                    />
                    <ContentImageField
                      label="Photo"
                      value={highlight.image}
                      onChange={(value) =>
                        updateItem("highlights", highlight.id, "image", value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeItem("highlights", highlight.id)}
                    >
                      Remove highlight
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    addItem("highlights", {
                      id: `highlight-${crypto.randomUUID()}`,
                      title: "New highlight",
                      category: "Highlights",
                      date: String(new Date().getFullYear()),
                      image: "",
                      description: "",
                    })
                  }
                >
                  Add highlight
                </button>
              </div>
            </div>
          )}
        </PrivateContentEditor>
      </div>

      <section className="founder-hero">
        <div className="container founder-hero__layout">
          <div className="founder-hero__content">
            <p className="founder-eyebrow">THE PERSON BEHIND FIGK</p>
            <h1>{founder.pageTitle}</h1>
            <p className="founder-hero__description">{founder.description}</p>
            <h2>{founder.name}</h2>
          </div>
          <img
            className="founder-hero__portrait"
            src={founder.portrait}
            alt={`Portrait of ${founder.name}`}
          />
        </div>
      </section>

      <section className="founder-gallery">
        <div className="container">
          <div className="founder-gallery__heading">
            <div>
              <p className="founder-eyebrow">MOMENTS & MILESTONES</p>
              <h2>{founder.highlightsTitle}</h2>
            </div>
          </div>

          <div className="founder-gallery__grid">
            {founder.highlights.map((highlight) => (
              <article className="founder-card" key={highlight.id}>
                {highlight.image && (
                  <img
                    src={highlight.image}
                    alt={highlight.description || highlight.title}
                    className="founder-card__image"
                  />
                )}
                <div className="founder-card__details">
                  <p>{highlight.category} · {highlight.date}</p>
                  <h3>{highlight.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Founder;
