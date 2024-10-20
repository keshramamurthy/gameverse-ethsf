/* eslint-disable react/jsx-key */
import { BASE_URL } from "@/lib/constants";
import { createFrames, Button } from "frames.js/next";

const frames = createFrames();

const handleRequest = frames(async (ctx) => {
  const txLink = ctx.url.searchParams.get("txLink");
  const networkLogo = ctx.url.searchParams.get("networkLogo");
  const amount = ctx.url.searchParams.get("amount");
  const networkName = ctx.url.searchParams.get("networkName");
  const tokenName = ctx.url.searchParams.get("tokenName");
  if (!txLink) {
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
            alignItems: "center",
            background: "black",
            display: "flex",
            flexDirection: "column",
            flexWrap: "nowrap",
            height: "100%",
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              color: "white",
              fontSize: 60,
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              lineHeight: 1.4,
              marginTop: 30,
              padding: "0 120px",
              whiteSpace: "pre-wrap",
            }}
          >
            {`Invalid transaction!`}
          </div>
        </div>
      ),
    };
  }

  return {
    image: `${BASE_URL}/api/image?s=1&networkLogo=${networkLogo}&amount=${amount}&networkName=${networkName}&tokenName=${tokenName}`,
    imageOptions: {
      aspectRatio: "1.91:1",
      width: 955,
      height: 500,
    },
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
    buttons: [
      <Button action="link" target={txLink}>
        View Transaction
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
