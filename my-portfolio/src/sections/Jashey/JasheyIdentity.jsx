
function JasheyIdentity() {
  return (
    <section className="jashey-identity">
      <div className="container">

        <div className="jashey-section-heading">
          <div>
            <p className="jashey-eyebrow">
              IDENTITY & PRINCIPLES / 02
            </p>

            <h2>
              Open by intention.
              <span>Independent by identity.</span>
            </h2>
          </div>
        </div>

        <div className="jashey-identity__grid">

          {/* Licensing */}
          <article className="jashey-identity__panel">
            <span className="jashey-identity__label">
              OUR LICENSING DIRECTION
            </span>

            <h3>GNU licenses.</h3>

            <p>
              JASHEY projects are intended to be
              released under GNU licenses, reflecting
              an interest in open-source development
              and sharing.
            </p>

            <p>
              The specific license will be identified
              alongside each project when it is published.
            </p>

          </article>

          {/* Name story */}
          <article className="jashey-identity__secret">

            <span className="jashey-identity__label">
              A LITTLE SECRET
            </span>

            <h3>Why JASHEY?</h3>

            <p className="jashey-identity__quote">
              A name from the sea of my heart.
            </p>

            <p>
              The rest of the story?
            </p>

            <strong>
              Top secret. Too personal.
            </strong>

            <span className="jashey-identity__footnote">
              Some stories are better left untold.
            </span>

          </article>

        </div>

      </div>
    </section>
  );
}

export default JasheyIdentity;
