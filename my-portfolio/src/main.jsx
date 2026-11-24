import react from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import "./styles.global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);

function App() {
  return(
    <main className="container section">
      <p className="section-labels">Independent Creative Brand</p>

        <h1>
          Independent By identity.
        </h1>

        <p>
          A Space for ideas, creativity and independent thinking.
        </p>

        <button
        style={{
          background: "var(--color-forest)",
          color: "#fff",
          border: "none",
          padding: "14px 28px",
          borderRadius: "6px",
        }}>
          Explore FIGK
        </button>
    </main>
  );
}

export default App;