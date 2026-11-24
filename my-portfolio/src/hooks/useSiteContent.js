import { useEffect, useState } from "react";

const isLoopbackHost = (hostname) =>
  ["localhost", "127.0.0.1", "[::1]"].includes(hostname);

export const isPrivateEditorHost = () =>
  isLoopbackHost(window.location.hostname) &&
  window.location.port === "7171";

export function useSiteContent() {
  const [content, setContent] = useState(null);
  const [error, setError] = useState("");
  const isPrivateHost = isPrivateEditorHost();

  useEffect(() => {
    let isMounted = true;

    const loadContent = async () => {
      try {
        const response = await fetch("/content/site-content.json", {
          cache: "no-store",
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Could not load site content.");
        }

        if (isMounted) {
          setContent(result);
          setError("");
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Could not load site content."
          );
        }
      }
    };

    void loadContent();

    const shouldPoll =
      import.meta.env.DEV &&
      !isPrivateHost &&
      isLoopbackHost(window.location.hostname) &&
      window.location.port === "5173";
    const intervalId = shouldPoll
      ? window.setInterval(() => void loadContent(), 1500)
      : null;

    return () => {
      isMounted = false;
      if (intervalId !== null) {
        window.clearInterval(intervalId);
      }
    };
  }, [isPrivateHost]);

  const saveSection = async (section, value) => {
    const response = await fetch(`/api/content/${section}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Could not publish page content.");
    }

    setContent((currentContent) => ({
      ...currentContent,
      [section]: result.content,
    }));

    return result.content;
  };

  return { content, error, isPrivateHost, saveSection };
}
