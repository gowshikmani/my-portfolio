import { useState } from "react";
import { isPrivateEditorHost } from "../../hooks/useSiteContent";
import "./PrivateContentEditor.css";

export function ContentTextField({
  label,
  value,
  onChange,
  multiline = false,
  inputType = "text",
}) {
  const Field = multiline ? "textarea" : "input";

  return (
    <label className="content-editor__field">
      <span>{label}</span>
      <Field
        type={multiline ? undefined : inputType}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={multiline ? 3 : undefined}
      />
    </label>
  );
}

export function ContentImageField({ label, value, onChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [message, setMessage] = useState("");

  const uploadFile = async (file) => {
    const allowedTypes = new Set([
      "image/avif",
      "image/gif",
      "image/jpeg",
      "image/png",
      "image/webp",
    ]);

    if (!allowedTypes.has(file.type)) {
      setMessage("Use a JPEG, PNG, GIF, WebP, or AVIF image.");
      return;
    }

    try {
      const response = await fetch("/api/uploads", {
        method: "POST",
        headers: {
          "Content-Type": file.type,
          "X-File-Name": encodeURIComponent(file.name),
        },
        body: file,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Could not upload ${file.name}.`);
      }

      onChange(result.src);
      setMessage("Image ready. Save changes to publish it.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not upload this image."
      );
    }
  };

  return (
    <div className="content-editor__field">
      <span>{label}</span>
      <label
        className={`content-editor__image-drop ${
          isDragging ? "content-editor__image-drop--active" : ""
        }`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const [file] = event.dataTransfer.files;
          if (file) {
            void uploadFile(file);
          }
        }}
      >
        <input
          className="content-editor__file-input"
          type="file"
          accept="image/avif,image/gif,image/jpeg,image/png,image/webp"
          onChange={(event) => {
            const [file] = event.target.files;
            if (file) {
              void uploadFile(file);
            }
            event.target.value = "";
          }}
        />
        {value ? (
          <img src={value} alt="" className="content-editor__image-preview" />
        ) : (
          <span>Drop an image here or browse</span>
        )}
      </label>
      <div className="content-editor__image-actions">
        {value && (
          <button type="button" onClick={() => onChange("")}>
            Remove image
          </button>
        )}
        {message && <span role="status">{message}</span>}
      </div>
    </div>
  );
}

function PrivateContentEditor({
  section,
  title,
  value,
  onSave,
  children,
}) {
  const [draft, setDraft] = useState(value);
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const isPrivateHost = isPrivateEditorHost();

  if (!isPrivateHost) {
    return null;
  }

  const updateField = (field, nextValue) => {
    setDraft((currentDraft) => ({ ...currentDraft, [field]: nextValue }));
  };

  const updateItem = (collection, id, field, nextValue) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [collection]: currentDraft[collection].map((item) =>
        item.id === id ? { ...item, [field]: nextValue } : item
      ),
    }));
  };

  const addItem = (collection, item) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [collection]: [...currentDraft[collection], item],
    }));
  };

  const removeItem = (collection, id) => {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [collection]: currentDraft[collection].filter((item) => item.id !== id),
    }));
  };

  const saveChanges = async () => {
    setIsSaving(true);
    setStatus("");

    try {
      const savedContent = await onSave(section, draft);
      setDraft(savedContent);
      setStatus(
        "Saved to public content. Rebuild and deploy to update the hosted site."
      );
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Could not publish changes."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="content-editor">
      <details>
        <summary>Edit {title}</summary>
        <div className="content-editor__body">
          {children({
            draft,
            updateField,
            updateItem,
            addItem,
            removeItem,
          })}
          <div className="content-editor__footer">
            <button
              type="button"
              onClick={saveChanges}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save and publish"}
            </button>
            {status && <p role="status">{status}</p>}
          </div>
        </div>
      </details>
    </section>
  );
}

export default PrivateContentEditor;
