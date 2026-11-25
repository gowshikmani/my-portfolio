import {
  ContentImageField,
  ContentTextField,
  default as PrivateContentEditor,
} from "../../components/PrivateContentEditor/PrivateContentEditor";
import { useSiteContent } from "../../hooks/useSiteContent";
import ProjectsHero from "../../sections/Projects/ProjectsHero";
import ProjectList from "../../sections/Projects/ProjectList";

import "../../sections/Projects/Projects.css";

function Projects() {
  const { content, error, saveSection } = useSiteContent();

  if (!content) {
    return (
      <main className="projects-page">
        <div className="container">
          <p role="status">{error || "Loading project content..."}</p>
        </div>
      </main>
    );
  }

  const projects = content.projects;

  return (
    <main className="projects-page">
      <div className="container">
        {error && <p role="status">{error}</p>}
        <PrivateContentEditor
          section="projects"
          title="project photos and titles"
          value={projects}
          onSave={saveSection}
        >
          {({ draft, updateField, updateItem, addItem, removeItem }) => (
            <div className="content-editor__grid">
              <div className="content-editor__group">
                <h3>Projects page titles</h3>
                <ContentTextField
                  label="Main title"
                  value={draft.heroTitle}
                  onChange={(value) => updateField("heroTitle", value)}
                />
                <ContentTextField
                  label="Main title accent"
                  value={draft.heroAccent}
                  onChange={(value) => updateField("heroAccent", value)}
                />
                <ContentTextField
                  label="Project list title"
                  value={draft.sectionTitle}
                  onChange={(value) => updateField("sectionTitle", value)}
                />
              </div>

              <div className="content-editor__group">
                <h3>Project cards</h3>
                {draft.items.map((project) => (
                  <div className="content-editor__group" key={project.id}>
                    <ContentTextField
                      label="Project title"
                      value={project.name}
                      onChange={(value) =>
                        updateItem("items", project.id, "name", value)
                      }
                    />
                    <ContentTextField
                      label="Project description"
                      value={project.description || ""}
                      multiline
                      onChange={(value) =>
                        updateItem("items", project.id, "description", value)
                      }
                    />
                    <ContentTextField
                      label="Project link"
                      value={project.url || ""}
                      inputType="url"
                      onChange={(value) =>
                        updateItem("items", project.id, "url", value)
                      }
                    />
                    <ContentImageField
                      label="Project photo"
                      value={project.image}
                      onChange={(value) =>
                        updateItem("items", project.id, "image", value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeItem("items", project.id)}
                    >
                      Remove project
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    addItem("items", {
                      id: `project-${crypto.randomUUID()}`,
                      name: "New project",
                      description: "",
                      url: "",
                      status: "",
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
      <ProjectsHero content={projects} />
      <ProjectList content={projects} />
    </main>
  );
}

export default Projects;