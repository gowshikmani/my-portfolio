import EcosystemHero from "../../sections/Ecosystem/EcosystemHero";
import EcosystemInitiatives from "../../sections/Ecosystem/EcosystemInitiatives";
import EcosystemClosing from "../../sections/Ecosystem/EcosystemClosing";

import "../../sections/Ecosystem/Ecosystem.css";

function Ecosystem() {
  return (
    <main className="ecosystem-page">
      <EcosystemHero />
      <EcosystemInitiatives />
      <EcosystemClosing />
    </main>
  );
}

export default Ecosystem;