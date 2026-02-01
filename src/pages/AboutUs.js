import React from "react";
import PratyushPhoto from "../Team/Pratyush.jpeg";

const AboutMe = () => {
  return (
    <div className="page-container">
      {/* ABOUT ME HEADER */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 className="page-title" style={{ fontSize: "2.4rem", textAlign: "center" }}>
          About Me
        </h1>

        {/* Photo Card */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
          <div style={{
            background: "#1a2540",
            border: "1px solid #1e2d4a",
            padding: "1rem",
            borderRadius: "14px",
            width: "200px",
            textAlign: "center",
          }}>
            <img
              src={PratyushPhoto}
              alt="Pratyush"
              style={{
                width: "160px",
                height: "160px",
                borderRadius: "10px",
                objectFit: "cover",
                border: "2px solid #14b8a6"
              }}
            />
            <p style={{ marginTop: "0.6rem", fontWeight: 600, color: "#e2e8f0", fontSize: "0.92rem" }}>
              Pratyush Dalmia
            </p>
          </div>
        </div>
      </div>

      {/* STORY + FEATURES */}
      <div style={{
        background: "#1a2540",
        border: "1px solid #1e2d4a",
        padding: "1.75rem",
        borderRadius: "14px",
        marginBottom: "1.25rem",
      }}>
        <p style={{ lineHeight: "1.8", fontSize: "0.95rem", color: "#cbd5e1" }}>
          My name is Pratyush, a student at Mayo College Ajmer who loves
          technology, robotics, AI, and innovation. My dream is to build
          solutions that create real impact and leave a mark that lasts for
          generations.
        </p>
        <p style={{ lineHeight: "1.8", fontSize: "0.95rem", color: "#cbd5e1", marginTop: "1rem" }}>
          MEDIREADY originally started as an idea for WRO, but over time it
          evolved into a full-fledged AI-powered medical system that is
          capable of:
        </p>

        {/* Capability Tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem" }}>
          {[
            "Analysing symptoms",
            "Detecting injuries",
            "Monitoring vital signs",
            "Analysing radiology reports",
            "Voice-based medical assistance",
            "Chat-based medical assistance"
          ].map((cap, i) => (
            <span key={i} style={{
              background: "rgba(20,184,166,0.1)",
              border: "1px solid rgba(20,184,166,0.25)",
              color: "#2dd4bf",
              padding: "0.3rem 0.75rem",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: 500
            }}>
              ✓ {cap}
            </span>
          ))}
        </div>

        <p style={{ marginTop: "1.25rem", lineHeight: "1.8", fontSize: "0.95rem", color: "#cbd5e1" }}>
          This project represents my passion for building real-world solutions.
          And none of this would have been possible without the support of my
          mentors: <strong style={{ color: "#e2e8f0" }}>Mr. Akash Deep Rawat</strong> and{" "}
          <strong style={{ color: "#e2e8f0" }}>Mr. Chirag Saraswat</strong>.
        </p>
      </div>

      {/* MY MENTORS */}
      <div style={{
        background: "rgba(20,184,166,0.06)",
        border: "1px solid rgba(20,184,166,0.2)",
        padding: "1.75rem",
        borderRadius: "14px",
        textAlign: "center"
      }}>
        <h2 style={{
          fontSize: "1.3rem",
          fontWeight: 600,
          color: "#14b8a6",
          marginBottom: "0.75rem"
        }}>
          🙏 My Mentors
        </h2>

        <p style={{
          fontSize: "0.93rem",
          lineHeight: "1.8",
          color: "#94a3b8"
        }}>
          I sincerely thank{" "}
          <strong style={{ color: "#e2e8f0" }}>Mr. Akash Deep Rawat</strong>{" "}
          and{" "}
          <strong style={{ color: "#e2e8f0" }}>Mr. Chirag Saraswat</strong>{" "}
          for their constant support, guidance, and motivation in turning this
          vision into reality.
        </p>
      </div>
    </div>
  );
};

export default AboutMe;

