
const approaches = [
  {
    number: "01",
    title: "Explore",
    description:
      "Follow projects as they are introduced and discover " +
      "the ideas, technologies and possibilities behind them.",
  },
  {
    number: "02",
    title: "Contribute",
    description:
      "Share code, documentation, feedback, testing and " +
      "ideas. Different contributions can help projects grow.",
  },
  {
    number: "03",
    title: "Build together",
    description:
      "Learn, exchange perspectives and work together " +
      "to improve open-source projects.",
  },
];

function JasheyApproach() {
  return (
    <section
      className="jashey-approach"
      id="jashey-approach"
    >
      <div className="container">

        <div className="jashey-section-heading">
          <div>
            <p className="jashey-eyebrow">
              THE APPROACH / 01
            </p>

            <h2>
              Built in the open.
              <span>Shaped together.</span>
            </h2>
          </div>

          <p>
            Open-source development is not just about
            sharing code. It is also about making room
            for people, ideas and collaboration.
          </p>
        </div>

        <div className="jashey-approach__grid">

          {approaches.map((item) => (
            <article
              className="jashey-approach__card"
              key={item.number}
            >
              <span className="jashey-approach__number">
                {item.number}
              </span>

              <h3>{item.title}</h3>

              <p>{item.description}</p>
            </article>
          ))}

        </div>

        <p className="jashey-approach__invitation">
          Anyone can join and contribute.
        </p>

      </div>
    </section>
  );
}

export default JasheyApproach;
