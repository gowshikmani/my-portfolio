import { useCallback, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Intro from "./components/Intro/Intro";
import Navbar from "./components/Navbar/Navbar";
import NotFound from "./pages/NotFound/NotFound";

import "./App.css";

function Home() {
  return (
    <main id="home" className="container home-hero">
      <p className="section-label">
        Independent creative brand
      </p>

      <h1>Independent by identity.</h1>

      <p>
        A space for ideas, creativity and independent thinking.
      </p>
    </main>
  );
}

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

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;