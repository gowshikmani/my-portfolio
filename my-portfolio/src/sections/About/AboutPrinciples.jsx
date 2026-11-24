
const principles = [
  {
    number: "01",
    title: "Independence",
    description:
      "The freedom to explore ideas and develop an identity without following a predefined path.",
  },
  {
    number: "02",
    title: "Curiosity",
    description:
      "Questions are starting points. Learning and exploration keep ideas moving.",
  },
  {
    number: "03",
    title: "Creativity",
    description:
      "Ideas can take different forms, from technology and experiments to words and stories.",
  },
  {
    number: "04",
    title: "Collaboration",
    description:
      "Different perspectives can contribute to a shared idea and make it grow.",
  },
];

function AboutPrinciples() {
  return (
    <section className="about-principles">
      <div className="container">

        <div className="about-section-heading">
          <div>
            <p className="about-eyebrow">WHAT MATTERS / 04</p>
            <h2>Principles, not limitations.</h2>
          </div>
        </div>

        <div className="about-principles__list">
          {principles.map((item) => (
            <article
              className="about-principles__item"
              key={item.number}
            >
              <span>{item.number}</span>

              <h3>{item.title}</h3>

              <p>{item.description}</p>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

export default AboutPrinciples;