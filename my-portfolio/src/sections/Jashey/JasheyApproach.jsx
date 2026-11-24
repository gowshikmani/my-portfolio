
function JasheyApproach({ content }) {
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
              {content.approachLine1}
              <span>{content.approachLine2}</span>
            </h2>
          </div>

          <p>
            Open-source development is not just about
            sharing code. It is also about making room
            for people, ideas and collaboration.
          </p>
        </div>

        <div className="jashey-approach__grid">

          {content.approaches.map((item) => (
            <article
              className="jashey-approach__card"
              key={item.id}
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
