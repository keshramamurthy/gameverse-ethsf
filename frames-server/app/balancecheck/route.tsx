/* eslint-disable react/jsx-key */
import { BASE_URL } from "@/lib/constants";
import { Button, createFrames } from "frames.js/next";

const frames = createFrames();

const handleRequest = frames(async (ctx) => {
    const address = ctx.url.searchParams.get("address") || "No address found";
    const balance = ctx.url.searchParams.get("balance") || "No balance found";

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
                    {/* Header Section */}
                    <h1
                        style={{
                            color: "#4CAF50",
                            fontSize: "2.5rem",
                            fontWeight: "bold",
                            display: "flex",
                            marginBottom: "20px",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                        }}
                    >
                        Balance Details
                    </h1>

                    {/* Address Section */}
                    <div
                        style={{
                            backgroundColor: "#383838",
                            borderRadius: "8px",
                            padding: "15px 20px",
                            marginBottom: "20px",
                            color: "#FFD700", // Gold color for the address
                            fontSize: "1.1rem",
                            wordWrap: "break-word",
                            fontFamily: "monospace",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.2)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            maxWidth: "100%",
                        }}
                    >
                        {address || 'N/A'}
                    </div>

                    {/* Balance Section */}
                    <div
                        style={{
                            color: "#FFFFFF",
                            fontSize: "3rem",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontStyle: "normal",
                            letterSpacing: "-0.025em",
                            lineHeight: 1.4,
                            whiteSpace: "pre-wrap",
                            marginBottom: "10px",
                        }}
                    >
                        {balance || '0'} coins
                    </div>

                    {/* Additional Info Section (optional) */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                            marginTop: "20px",
                            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                            paddingTop: "10px",
                        }}
                    >
                        <div style={{ color: "#aaa", fontSize: "0.9rem", display: "flex" }}>
                            Last updated: {new Date().toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        ),
    };
});

export const GET = handleRequest;
export const POST = handleRequest;
