
import { useState } from "react";
import { motion } from "motion/react";
import { UploadCloud, X, FileText } from "lucide-react";

import {
  enquiryCategories,
  attachmentConfig,
  messageConfig,
} from "./ContactData";

function ContactForm() {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleFiles = (selectedFiles) => {
    const incoming = Array.from(selectedFiles);

    const valid = incoming.filter((file) => {
      const extension = `.${file.name.split(".").pop().toLowerCase()}`;

      if (!attachmentConfig.acceptedExtensions.includes(extension)) {
        setStatus(`${file.name}: unsupported file format.`);
        return false;
      }

      if (
        !attachmentConfig.acceptedMimeTypes.includes(file.type)
      ) {
        setStatus(`${file.name}: invalid file type.`);
        return false;
      }

      if (file.size > attachmentConfig.maxSize) {
        setStatus(`${file.name}: file exceeds 5 MB.`);
        return false;
      }

      return true;
    });

    setFiles((previous) => {
      const combined = [...previous, ...valid];

      if (combined.length > attachmentConfig.maxFiles) {
        setStatus("You can attach a maximum of 3 files.");
      } else {
        setStatus("");
      }

      return combined.slice(0, attachmentConfig.maxFiles);
    });
  };

  const removeFile = (index) => {
    setFiles((previous) =>
      previous.filter((_, i) => i !== index)
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // EmailJS and Cloudflare Turnstile integration
    // will be implemented in the next stage.

    setStatus(
      "Email submission is not connected yet. Please try again later."
    );
  };

  return (
    <section className="contact-form-section" id="contact-form">
      <div className="container contact-form-layout">

        <motion.div
          className="contact-form-intro"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label">SEND AN ENQUIRY</span>

          <h2>Tell me what's on your mind.</h2>

          <p>
            Whether it's an idea, a collaboration or simply a
            question, use the form to get in touch.
          </p>

          <p className="contact-response-note">
            We'll get back to you as soon as possible.
          </p>
        </motion.div>

        <motion.form
          className="contact-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >

          <div className="contact-field-grid">

            <label className="contact-field">
              <span>Name *</span>
              <input
                name="name"
                type="text"
                required
                placeholder="Your name"
              />
            </label>

            <label className="contact-field">
              <span>Email *</span>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
              />
            </label>

            <label className="contact-field">
              <span>Organization</span>
              <input
                name="organization"
                type="text"
                placeholder="Optional"
              />
            </label>

            <label className="contact-field">
              <span>Phone</span>
              <input
                name="phone"
                type="tel"
                placeholder="Optional"
              />
            </label>

          </div>

          <label className="contact-field">
            <span>Subject *</span>
            <input
              name="subject"
              type="text"
              required
              placeholder="What is this about?"
            />
          </label>

          <label className="contact-field">
            <span>Enquiry category *</span>

            <select
              name="category"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select a category
              </option>

              {enquiryCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="contact-field">
            <span>Message *</span>

            <textarea
              name="message"
              required
              maxLength={messageConfig.maxLength}
              rows={6}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write your message here..."
            />

            <span className="contact-character-count">
              {message.length}/{messageConfig.maxLength}
            </span>
          </label>

          <div className="contact-upload">

            <span className="contact-upload-title">
              Attachments
            </span>

            <p>
              PDF, DOCX, JPG, PNG or WEBP ·
              Maximum 5 MB per file · Up to 3 files
            </p>

            <label
              className="contact-dropzone"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                handleFiles(event.dataTransfer.files);
              }}
            >
              <UploadCloud size={25} strokeWidth={1.5} />

              <span>Drag and drop files here</span>
              <span>or browse your device</span>

              <input
                type="file"
                accept={attachmentConfig.acceptedExtensions.join(",")}
                multiple
                disabled={files.length >= attachmentConfig.maxFiles}
                onChange={(event) => {
                  handleFiles(event.target.files);
                  event.target.value = "";
                }}
              />
            </label>

            {files.length > 0 && (
              <div className="contact-file-list">

                {files.map((file, index) => (
                  <div
                    className="contact-file-item"
                    key={`${file.name}-${index}`}
                  >

                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                      />
                    ) : (
                      <FileText size={22} />
                    )}

                    <div className="contact-file-info">
                      <span>{file.name}</span>
                      <small>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </small>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      aria-label={`Remove ${file.name}`}
                    >
                      <X size={17} />
                    </button>

                  </div>
                ))}

              </div>
            )}

          </div>

          <p className="contact-privacy">
            Your information will only be used to respond to
            your enquiry. We won't use it for unrelated purposes.
          </p>

          <button className="contact-submit" type="submit">
            Send enquiry
          </button>

          {status && (
            <p className="contact-form-status" role="status">
              {status}
            </p>
          )}

        </motion.form>
      </div>
    </section>
  );
}

export default ContactForm;
