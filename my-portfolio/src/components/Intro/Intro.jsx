import { useEffect, useRef, useState } from "react";
import Logo from "../Logo/Logo";
import "./Intro.css";

function getClockAngles(date) {
  const seconds =
    date.getSeconds() + date.getMilliseconds() / 1000;

  const minutes = date.getMinutes() + seconds / 60;

  const hours =
    (date.getHours() % 12) + minutes / 60;

  return {
    hour: hours * 30,
    minute: minutes * 6,
    second: seconds * 6,
  };
}

function Intro({ onComplete }) {
  const [now, setNow] = useState(() => new Date());
  const [stage, setStage] = useState("clock");

  // Keep the latest callback without restarting the timers.
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Update the live clock every 50 milliseconds.
    const clockInterval = window.setInterval(() => {
      setNow(new Date());
    }, 50);

    // Clock stage ends after 2.1 seconds.
    const revealTimer = window.setTimeout(() => {
      setStage("reveal");
    }, 2100);

    // Finish the intro after 3.5 seconds.
    const completeTimer = window.setTimeout(() => {
      onCompleteRef.current?.();
    }, 3500);

    return () => {
      window.clearInterval(clockInterval);
      window.clearTimeout(revealTimer);
      window.clearTimeout(completeTimer);
    };
  }, []);

  const angles = getClockAngles(now);

  const skipIntro = () => {
    onCompleteRef.current?.();
  };

  return (
    <div
      className={`figk-intro ${
        stage === "reveal" ? "figk-intro--reveal" : ""
      }`}
    >
      <div className="figk-intro__scene">

        {/* Stage 1: Live clock */}
        <div
          className="figk-intro__clock"
          aria-hidden="true"
        >
          <div className="figk-clock">
            <div className="figk-clock__dial" />

            <span
              className="figk-clock__hand figk-clock__hand--hour"
              style={{ "--angle": `${angles.hour}deg` }}
            />

            <span
              className="figk-clock__hand figk-clock__hand--minute"
              style={{ "--angle": `${angles.minute}deg` }}
            />

            <span
              className="figk-clock__hand figk-clock__hand--second"
              style={{ "--angle": `${angles.second}deg` }}
            />

            <span className="figk-clock__center" />
          </div>
        </div>

        {/* Stage 2: FIGK brand reveal */}
        <div className="figk-intro__brand">
          <Logo size={78} alt="" />

          <h1 className="figk-intro__wordmark">
            FIGK.
          </h1>

          <p className="figk-intro__byline">
            BY GOWSHIK MANIKANDAN
          </p>
        </div>

      </div>

      <button
        type="button"
        className="figk-intro__skip"
        onClick={skipIntro}
        aria-label="Skip the FIGK introduction"
      >
        Skip intro <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

export default Intro;
