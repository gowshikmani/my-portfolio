
import AboutHero from "../../sections/About/AboutHero";
import AboutPerspective from "../../sections/About/AboutPerspective";
import AboutExploration from "../../sections/About/AboutExploration";
import AboutPrinciples from "../../sections/About/AboutPrinciples";
import AboutClosing from "../../sections/About/AboutClosing";

import "../../sections/About/About.css";

function About() {
  return (
    <main className="about-page">
      <AboutHero />
      <AboutPerspective />
      <AboutExploration />
      <AboutPrinciples />
      <AboutClosing />
    </main>
  );
}

export default About;
