import { useEffect, useState } from "react";
import {
  founderHighlights,
  founderProfile,
} from "../../../../founder-media/founderdata.js";
import "./Founder.css";

function Founder() {
  const isPrivatePreview =
    ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname) &&
    window.location.port === "7171";
  const [uploads, setUploads] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    if (!isPrivatePreview) {
      return;
    }

    let isMounted = true;

    fetch("/api/uploads")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "Could not load private photos.");
        }
        return result;
      })
      .then((privateUploads) => {
        if (isMounted) {
          setUploads(privateUploads);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setUploadMessage(
            error instanceof Error ? error.message : "Could not load private photos."
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isPrivatePreview]);

  const addFiles = async (fileList) => {
    const files = Array.from(fileList);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    const rejectedCount = files.length - imageFiles.length;

    if (!imageFiles.length) {
      setUploadMessage(
        rejectedCount
          ? "Only image files can be added."
          : "Choose one or more image files to upload."
      );
      return;
    }

    const results = await Promise.allSettled(
      imageFiles.map(async (file) => {
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

        return result;
      })
    );

    const savedUploads = results.flatMap((result) =>
      result.status === "fulfilled" ? [result.value] : []
    );
    const failedUploads = results
      .filter((result) => result.status === "rejected")
      .map((result) =>
        result.reason instanceof Error
          ? result.reason.message
          : "An image could not be uploaded."
      );

    setUploads((currentUploads) => [...currentUploads, ...savedUploads]);
    setUploadMessage(
      [
        rejectedCount ? "Only image files can be added." : "",
        ...failedUploads,
        savedUploads.length ? "Photos saved to this private computer." : "",
      ]
        .filter(Boolean)
        .join(" ")
    );
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const removeUpload = async (id) => {
    try {
      const response = await fetch(`/api/uploads/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Could not delete the private photo.");
      }

      setUploads((currentUploads) =>
        currentUploads.filter((upload) => upload.id !== id)
      );
      setUploadMessage("Photo deleted from the private gallery.");
    } catch (error) {
      setUploadMessage(
        error instanceof Error
          ? error.message
          : "Could not delete the private photo."
      );
    }
  };

  return (
    <main className="founder-page">
      <section className="founder-hero">
        <div className="container founder-hero__layout">
          <div className="founder-hero__content">
            <p className="founder-eyebrow">THE PERSON BEHIND FIGK</p>
            <h1>Meet the founder.</h1>
            <p className="founder-hero__description">
              The ideas, curiosity and work behind an independent creative
              identity.
            </p>
            <h2>{founderProfile.name}</h2>
          </div>
          <img
            className="founder-hero__portrait"
            src={founderProfile.image}
            alt={`Portrait of ${founderProfile.name}`}
          />
        </div>
      </section>

      <section className="founder-gallery">
        <div className="container">
          <div className="founder-gallery__heading">
            <div>
              <p className="founder-eyebrow">MOMENTS & MILESTONES</p>
              <h2>Highlights.</h2>
            </div>
            {isPrivatePreview && (
              <p>
                Add photos to your private gallery. They are saved only on this
                computer.
              </p>
            )}
          </div>

          {isPrivatePreview && (
            <>
              <label
                className={`founder-dropzone ${
                  isDragging ? "founder-dropzone--active" : ""
                }`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <input
                  className="founder-dropzone__input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    addFiles(event.target.files);
                    event.target.value = "";
                  }}
                />
                <span className="founder-dropzone__icon" aria-hidden="true">
                  +
                </span>
                <span className="founder-dropzone__title">
                  Drop photos here or browse
                </span>
                <span className="founder-dropzone__hint">
                  Image files only · saved on this computer
                </span>
              </label>

              {uploadMessage && (
                <p className="founder-gallery__message" role="status">
                  {uploadMessage}
                </p>
              )}
            </>
          )}

          <div className="founder-gallery__grid">
            {founderHighlights.map((highlight) => (
              <article className="founder-card" key={highlight.id}>
                <img
                  src={highlight.image}
                  alt={highlight.description}
                  className="founder-card__image"
                />
                <div className="founder-card__details">
                  <p>{highlight.category} · {highlight.date}</p>
                  <h3>{highlight.title}</h3>
                </div>
              </article>
            ))}

            {isPrivatePreview &&
              uploads.map((upload) => (
                <article className="founder-card" key={upload.id}>
                  <img
                    src={upload.src}
                    alt={upload.name}
                    className="founder-card__image"
                  />
                  <div className="founder-card__details">
                    <h3>{upload.name}</h3>
                    <button
                      type="button"
                      className="founder-card__remove"
                      onClick={() => removeUpload(upload.id)}
                    >
                      Delete private photo
                    </button>
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
