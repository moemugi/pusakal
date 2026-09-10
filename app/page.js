"use client";

import { useState } from "react";
import styles from "./page.module.css";
import { Upload, Mic  } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_RENDER_AIAPI;

export default function Home() {
  const [screen, setScreen] = useState("home");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (event) => {
    const selectedFile = event.target.files[0];

    if (!selectedFile) return;

    setFile(selectedFile);
    setError("");
    setLoading(true);
    setScreen("result");

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        `${API_URL}/predict`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        console.error("API ERROR:", errorData);

        throw new Error(
          errorData?.detail || "Prediction failed"
        );
      }
      
      const data = await response.json();

      console.log("API RESULT:", data);

      setResult(data);

    } catch (error) {

      console.error(error);

      setError(
        "Unable to analyze the audio. Make sure the Python server is running."
      );

    } finally {

      setLoading(false);

    }
  };

  const handleRecord = async () => {
    try {
      setError("");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);

      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => {
          track.stop();
        });

        const audioBlob = new Blob(
          audioChunks,
          {
            type: mediaRecorder.mimeType,
          }
        );

        const audioFile = new File(
          [audioBlob],
          "cat_recording.webm",
          {
            type: audioBlob.type,
          }
        );

        setFile(audioFile);
        setScreen("result");
        setLoading(true);

        try {
          const formData = new FormData();

          formData.append(
            "file",
            audioFile
          );

          const response = await fetch(
            `${API_URL}/predict`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => null);

            console.error("API ERROR:", errorData);

            throw new Error(
              errorData?.detail || "Prediction failed"
            );
          }

          const data =
            await response.json();

          console.log(
            "RECORDING RESULT:",
            data
          );

          setResult(data);

        } catch (error) {

          console.error(error);

          setError(
            "Unable to analyze the recording."
          );

        } finally {

          setLoading(false);

        }
      };

      setScreen("recording");

      mediaRecorder.start();

      setTimeout(() => {
        if (
          mediaRecorder.state === "recording"
        ) {
          mediaRecorder.stop();
        }
      }, 5000);

    } catch (error) {

      console.error(error);

      setError(
        "Microphone permission was denied or is unavailable."
      );

    }
  };

  const analyzeAgain = () => {
    setFile(null);
    setResult(null);
    setError("");
    setScreen("input");
  };

  return (
    <main className={styles.home}>

      <h1 className={styles.logo}>
        pusakal
      </h1>

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
                <Mic className={styles.icon} size={32} />
                  <span>
                    Record
                  </span>
              </button>

              <label className={styles.inputOption}>
                <Upload className={styles.icon} size={32} />
                  <span>
                    Upload
                  </span>
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
              onClick={() => setScreen("home")}
            >
              Back to home
            </button>

          </div>

        </section>

      )}

      {screen === "recording" && (

        <section className={styles.content}>

          <div className={styles.resultBox}>

            <p className={styles.resultSmall}>
              Listening...
            </p>

            <h2 className={styles.resultMood}>
              RECORDING
            </h2>

            <p>
              Recording your cat's sound
            </p>

            <p>
              Please wait...
            </p>

          </div>

        </section>

      )}

      {screen === "result" && (

        <section className={styles.content}>

          <div className={styles.resultBox}>

            {loading && (

              <>
                <p className={styles.resultSmall}>
                  Analyzing...
                </p>

                <h2 className={styles.resultMood}>
                  PLEASE WAIT
                </h2>
              </>

            )}

            {!loading && error && (

              <>
                <p className={styles.resultSmall}>
                  Error
                </p>

                <h2 className={styles.resultMood}>
                  FAILED
                </h2>

                <p>
                  {error}
                </p>
              </>

            )}

            {!loading && !error && result && (

              <>

                <p className={styles.resultSmall}>
                  The Sound is
                </p>

                <h2 className={styles.resultMood}>
                  {result.predicted_mood.toUpperCase()}
                </h2>

                <p className={styles.confidence}>
                  {result.confidence.toFixed(2)}%
                </p>

                <p>
                  {result.filename}
                </p>

              </>

            )}

            <button
              className={styles.againButton}
              onClick={analyzeAgain}
            >
              Analyze again
            </button>

          </div>

        </section>

      )}

    </main>
  );
}