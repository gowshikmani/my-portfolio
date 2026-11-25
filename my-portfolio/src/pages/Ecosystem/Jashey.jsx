
import {
  ContentImageField,
  ContentTextField,
  default as PrivateContentEditor,
} from "../../components/PrivateContentEditor/PrivateContentEditor";
import { useSiteContent } from "../../hooks/useSiteContent";
import JasheyHero from "../../sections/Jashey/JasheyHero";
import JasheyApproach from "../../sections/Jashey/JasheyApproach";
import JasheyIdentity from "../../sections/Jashey/JasheyIdentity";
import JasheyClosing from "../../sections/Jashey/JasheyClosing";

import "../../sections/Jashey/Jashey.css";

function Jashey() {
  const { content, error, saveSection } = useSiteContent();

  if (!content) {
    return (
      <main className="jashey-page">
        <div className="container">
          <p role="status">{error || "Loading JASHEY content..."}</p>
        </div>
      </main>
    );
  }

  const jashey = content.jashey;

  return (
    <main className="jashey-page">
      <div className="container">
        {error && <p role="status">{error}</p>}
        <PrivateContentEditor
          section="jashey"
          title="JASHEY photos and titles"
          value={jashey}
          onSave={saveSection}
        >
          {({
            draft,
            updateField,
            updateItem,
            addItem,
            removeItem,
          }) => (
            <div className="content-editor__grid">
              <div className="content-editor__group">
                <h3>JASHEY page titles and photo</h3>
                <ContentTextField
                  label="Title line 1"
                  value={draft.titleLine1}
                  onChange={(value) => updateField("titleLine1", value)}
                />
                <ContentTextField
                  label="Title line 2"
                  value={draft.titleLine2}
                  onChange={(value) => updateField("titleLine2", value)}
                />
                <ContentImageField
                  label="Page photo"
                  value={draft.heroImage}
                  onChange={(value) => updateField("heroImage", value)}
                />
              </div>

              <div className="content-editor__group">
                <h3>Approach titles</h3>
                <ContentTextField
                  label="Section title line 1"
                  value={draft.approachLine1}
                  onChange={(value) => updateField("approachLine1", value)}
                />
                <ContentTextField
                  label="Section title line 2"
                  value={draft.approachLine2}
                  onChange={(value) => updateField("approachLine2", value)}
                />
                {draft.approaches.map((approach) => (
                  <ContentTextField
                    key={approach.id}
                    label={`${approach.number} card title`}
                    value={approach.title}
                    onChange={(value) =>
                      updateItem("approaches", approach.id, "title", value)
                    }
                  />
                ))}
              </div>

              <div className="content-editor__group">
                <h3>JASHEY projects</h3>
                <ContentTextField
                  label="Projects section title"
                  value={draft.projectsTitle}
                  onChange={(value) => updateField("projectsTitle", value)}
                />
                {draft.projects.map((project) => (
                  <div className="content-editor__group" key={project.id}>
                    <ContentTextField
                      label="Project title"
                      value={project.title}
                      onChange={(value) =>
                        updateItem("projects", project.id, "title", value)
                      }
                    />
                    <ContentTextField
                      label="Project link (optional)"
                      value={project.url}
                      inputType="url"
                      onChange={(value) =>
                        updateItem("projects", project.id, "url", value)
                      }
                    />
                    <ContentTextField
                      label="Description"
                      value={project.description}
                      multiline
                      onChange={(value) =>
                        updateItem(
                          "projects",
                          project.id,
                          "description",
                          value
                        )
                      }
                    />
                    <ContentImageField
                      label="Project photo (optional)"
                      value={project.image}
                      onChange={(value) =>
                        updateItem("projects", project.id, "image", value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeItem("projects", project.id)}
                    >
                      Remove project
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    addItem("projects", {
                      id: `jashey-project-${crypto.randomUUID()}`,
                      title: "New project",
                      description: "",
                      url: "",
                      image: "",
                    })
                  }
                >
                  Add project
                </button>
              </div>
            </div>
          )}
        </PrivateContentEditor>
      </div>
      <JasheyHero content={jashey} />
      <JasheyApproach content={jashey} />
      <section className="jashey-projects" id="jashey-projects">
        <div className="container">
          <div className="jashey-section-heading">
            <div>
              <p className="jashey-eyebrow">PROJECTS / 02</p>
              <h2>{jashey.projectsTitle}</h2>
            </div>
            <p>
              Explore projects developed through the JASHEY open-source
              initiative.
            </p>
          </div>
          {jashey.projects.length ? (
            <ul className="jashey-projects__grid">
              {jashey.projects.map((project) => (
                <li className="jashey-project" key={project.id}>
                  {project.image && (
                    <img src={project.image} alt="" />
                  )}
                  <h3>{project.title}</h3>
                  {project.description && <p>{project.description}</p>}
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Explore project <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="jashey-projects__empty">
              JASHEY projects will be shared here soon.
            </p>
          )}
        </div>
      </section>
      <JasheyIdentity />
      <JasheyClosing />
    </main>
  );
}

export default Jashey;
