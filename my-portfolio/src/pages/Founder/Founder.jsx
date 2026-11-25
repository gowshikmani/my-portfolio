
import "./Founder.css";

const founder = {
  pageTitle: "Writer, Developer & AI/ML Enthusiast",
  name: "Gowshik Manikandan",
  description: "The person behind FIGK.",

  portrait: "/founder-media/potrait/cover%20image.jpeg",

  highlightsTitle: "Moments & Milestones",

  highlights: [
    {
      id: "highlight-01",
      title: "A Memorable Moment",
      category: "Highlights",
      date: "2026",
      image: "/founder-media/highlights/test.jpeg",
      description:
        "A group moment at the Student Affairs Investiture Ceremony.",
    },
    {
      id: "highlight-02",
      title: "A Mere First Time On Stage",
      category: "Highlights",
      date: "2024",
      image: "/founder-media/highlights/els.jpeg",
      description: "The first time aboard on stage with fun elements"
    },
  ],
};

const highlightColumns = [
  founder.highlights.filter((_, index) => index % 2 === 0),
  founder.highlights.filter((_, index) => index % 2 === 1),
];

function Founder() {
  const renderHighlight = (highlight) => (
    <article className="founder-card" key={highlight.id}>
      {highlight.image && (
        <img
          src={highlight.image}
          alt={highlight.description || highlight.title}
          className="founder-card__image"
          loading="lazy"
        />
      )}

      <div className="founder-card__details">
        <p>
          {highlight.category} · {highlight.date}
        </p>

        <h3>{highlight.title}</h3>
      </div>
    </article>
  );

  return (
    <main className="founder-page">
      <section className="founder-hero">
        <div className="container founder-hero__layout">
          <div className="founder-hero__content">
            <p className="founder-eyebrow">
              THE PERSON BEHIND FIGK
            </p>

            <h1>{founder.pageTitle}</h1>

            <p className="founder-hero__description">
              {founder.description}
            </p>

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
              <p className="founder-eyebrow">
                MOMENTS & MILESTONES
              </p>

              <h2>{founder.highlightsTitle}</h2>
            </div>
          </div>

          <div className="founder-gallery__grid">
            {highlightColumns.map((column, index) => (
              <div className="founder-gallery__column" key={index}>
                {column.map(renderHighlight)}
              </div>
            ))}
          </div>

          <div className="founder-gallery__list">
            {founder.highlights.map(renderHighlight)}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Founder;
