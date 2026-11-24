
import JasheyHero from "../../sections/Jashey/JasheyHero";
import JasheyApproach from "../../sections/Jashey/JasheyApproach";
import JasheyIdentity from "../../sections/Jashey/JasheyIdentity";
import JasheyClosing from "../../sections/Jashey/JasheyClosing";

import "../../sections/Jashey/Jashey.css";

function Jashey() {
  return (
    <main className="jashey-page">
      <JasheyHero />
      <JasheyApproach />
      <JasheyIdentity />
      <JasheyClosing />
    </main>
  );
}

export default Jashey;
