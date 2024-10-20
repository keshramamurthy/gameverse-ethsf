import { BASE_URL } from "@/lib/constants";
import { Button, createFrames } from "frames.js/next";

const frames = createFrames();

const handleRequest = frames(async (ctx) => {
  const coins = ctx.url.searchParams.get("coins") || "0";
  const success = ctx.url.searchParams.get("success") === "true";

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
            maxWidth: "500px",
            width: "100%",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Success or Failure Message */}
          <h1
            style={{
              color: success ? "#4CAF50" : "#FF4C4C", // Green for success, red for failure
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginBottom: "20px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {success
              ? `You successfully stole ${coins} coins!`
              : `You failed and lost ${coins} coins.`}
          </h1>
        </div>
      </div>
    ),
  };
});

export const GET = handleRequest;
export const POST = handleRequest;