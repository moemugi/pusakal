"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [screen, setScreen] = useState("home");
  const [file, setFile] = useState(null);

  const handleUpload = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setScreen("result");
    }
  };

  const handleRecord = () => {
    setScreen("result");
  };

  return (
    <main className={styles.home}>

      <h1 className={styles.logo}>pusakal</h1>

      {screen === "home" && (
        <section className={styles.content}>

          <button
            className={styles.analyzeButton}
            onClick={() => setScreen("input")}
          >
            Analyze
          </button>

          <div className={styles.recent}>
            <div className={styles.recentTitle}>
              Recently heard
            </div>

            <div className={styles.recentRow}>
              <span>Happy</span>
              <span>92%</span>
            </div>

            <div className={styles.recentRow}>
              <span>Resting</span>
              <span>78%</span>
            </div>

            <div className={styles.recentRow}>
              <span>Warning</span>
              <span>84%</span>
            </div>
          </div>

        </section>
      )}

      {screen === "input" && (
        <section className={styles.content}>

          <div className={styles.inputBox}>

            <div className={styles.inputOptions}>

              <button
                className={styles.inputOption}
                onClick={handleRecord}
              >
                <span className={styles.icon}>●</span>
                <span>Record</span>
              </button>

              <label className={styles.inputOption}>
                <span className={styles.icon}>↑</span>
                <span>Upload</span>

                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleUpload}
                  hidden
                />
              </label>

            </div>

            <button
              className={styles.againButton}
              onClick={() => {
                setScreen("home");
              }}
            >
              Back to home
            </button>

          </div>

        </section>
      )}

      {screen === "result" && (
        <section className={styles.content}>

          <div className={styles.resultBox}>

            <p className={styles.resultSmall}>
              The Sound is
            </p>

            <h2 className={styles.resultMood}>
              HAPPY
            </h2>

            <p className={styles.confidence}>
              92%
            </p>

            <button
              className={styles.againButton}
              onClick={() => {
                setFile(null);
                setScreen("input");
              }}
            >
              Analyze again
            </button>

          </div>

        </section>
      )}

    </main>
  );
}