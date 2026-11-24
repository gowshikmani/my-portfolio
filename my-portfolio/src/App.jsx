import { useCallback, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home"
import Intro from "./components/Intro/Intro";
import Navbar from "./components/Navbar/Navbar";
import NotFound from "./pages/NotFound/NotFound";
import About from "./pages/About/About";
import Ecosystem from "./pages/Ecosystem/Ecosystem";
import Jashey from "./pages/Ecosystem/Jashey";
import Skamara from "./pages/Ecosystem/Skamara";
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

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About/>}/>
        <Route path="/ecosystem" element={<Ecosystem/>}/>
        <Route path="/ecosystem/jashey" element={<Jashey/>}/>
        <Route path="ecosystem/skamara" element={<Skamara/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;