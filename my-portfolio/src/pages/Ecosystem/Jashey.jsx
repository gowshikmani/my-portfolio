
import JasheyHero from "../../sections/Jashey/JasheyHero";
import JasheyApproach from "../../sections/Jashey/JasheyApproach";
import JasheyIdentity from "../../sections/Jashey/JasheyIdentity";
import JasheyClosing from "../../sections/Jashey/JasheyClosing";

import "../../sections/Jashey/Jashey.css";

const jasheyContent = {
  titleLine1: "Open source.",
  titleLine2: "Open possibilities.",
  heroImage: "/jashey-media/jashey-hero.webp",
  description:"JASHEY is an open-source development initiative under FIGK, bringing people together to explore ideas, contribute to projects and build through collaboration.",
  approachLine1: "Ideas grow",
  approachLine2: "through collaboration.",

  approaches: [
  {
    id: "approach-1",
    number: "01",
    title: "Explore",
    description:
      "Discover ideas, experiment with possibilities and explore technology without boundaries.",
  },
  {
    id: "approach-2",
    number: "02",
    title: "Contribute",
    description:
      "Share knowledge, contribute code and bring different perspectives into development.",
  },
  {
    id: "approach-3",
    number: "03",
    title: "Build together",
    description:
      "Turn collective ideas into meaningful projects through open collaboration.",
  },
],
};

function Jashey() {
  return (
    <main className="jashey-page">
      <JasheyHero content={jasheyContent} />

      <JasheyApproach content={jasheyContent} />

      <JasheyIdentity />

      <JasheyClosing />
    </main>
  );
}

export default Jashey;
