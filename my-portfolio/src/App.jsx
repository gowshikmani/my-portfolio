
import { useCallback, useState } from "react";

import Intro from "./components/Intro/Intro";
import Navbar from "./components/Navbar/Navbar";

import "./App.css";

function App() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  return (
    <>
      {showIntro && (
        <Intro onComplete={handleIntroComplete} />
      )}

      <Navbar />

      <main id="home" className="container home-hero">
        <p className="section-label">
          Independent creative brand
        </p>

        <h1>Independent by identity.</h1>

        <p>
          A space for ideas, creativity and independent thinking.
        </p>
      </main>
    </>
  );
}

export default App;
