import { createFrames } from "frames.js/next";
import { useEffect, useState } from "react";

const frames = createFrames();

// Function to animate the fanfare
const fanfareAnimation = () => {
  const elements = document.querySelectorAll('.fanfare');
  elements.forEach((element) => {
    element.classList.add('animate');
  });
};

const handleRequest = frames(async (ctx) => {
  const winnerAddress = ctx.url.searchParams.get("winnerAddress") || "Unknown";
  const item = ctx.url.searchParams.get("item") || "No item";

  return {
    accepts: [
      {
        id: "farcaster",
        version: "vNext",
      },
      {
        id: "xmtp",
        version: "vNext",
      },
    ],
    image: (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          width: "100%",
          background: "linear-gradient(135deg, #1e1e1e, #000000)",
          padding: "20px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          color: "#ffffff",
        }}
      >
        {/* Card Container */}
        <div
          style={{
            backgroundColor: "#2c2c2c",
            borderRadius: "16px",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.5)",
            maxWidth: "600px",
            width: "100%",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            animation: "fadeIn 2s ease-out",
          }}
        >
          {/* Fanfare Animation */}
          <div className="fanfare" style={{ display: "flex", marginBottom: "20px" }}>
            <img
              src="https://media.tenor.com/IW5jiF1BZHQAAAAi/confetti-glitter.gif" // Replace with actual URL for fanfare animation
              style={{ width: "80px", height: "80px", animation: "rotate 2s linear infinite" }}
            />
          </div>

          {/* Winner Message */}
          <h1
            style={{
              color: "#FFD700", // Gold color for winner text
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "20px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              animation: "textPop 1.5s ease-out",
            }}
          >
            Congratulations, Winner!
          </h1>

          {/* Address Section */}
          <div
            style={{
              backgroundColor: "#383838",
              borderRadius: "8px",
              padding: "15px 20px",
              marginBottom: "20px",
              color: "#FFD700", // Gold color for address
              fontSize: "1.1rem",
              wordWrap: "break-word",
              fontFamily: "monospace",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              maxWidth: "100%",
              animation: "fadeIn 1.5s ease-out",
            }}
          >
            {winnerAddress}
          </div>

          {/* Item Section */}
          <div
            style={{
              color: "#FFFFFF",
              fontSize: "2rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              whiteSpace: "pre-wrap",
              marginBottom: "10px",
              animation: "fadeInUp 1.5s ease-out",
            }}
          >
            Item Won: {item}
          </div>

          {/* Animation on Load */}
        </div>
      </div>
    ),
  };
});

// CSS for animations (add in a global CSS or inline style tag)
const styles = {
  '@keyframes fadeIn': {
    '0%': { opacity: 0 },
    '100%': { opacity: 1 },
  },
  '@keyframes fadeInUp': {
    '0%': { opacity: 0, transform: 'translateY(20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes textPop': {
    '0%': { transform: 'scale(0.8)' },
    '100%': { transform: 'scale(1)' },
  },
  '@keyframes rotate': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

export const GET = handleRequest;
export const POST = handleRequest;
