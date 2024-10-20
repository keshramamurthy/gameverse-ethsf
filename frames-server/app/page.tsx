import { BASE_URL } from "@/lib/constants";
import { fetchMetadata } from "frames.js/next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ searchParams }: Props) {
  let queryParams = [];
  if (searchParams.txLink) queryParams.push(`txLink=${searchParams.txLink}`);
  if (searchParams.networkLogo)
    queryParams.push(`networkLogo=${searchParams.networkLogo}`);
  if (searchParams.amount) queryParams.push(`amount=${searchParams.amount}`);
  if (searchParams.networkName)
    queryParams.push(`networkName=${searchParams.networkName}`);
  if (searchParams.tokenName)
    queryParams.push(`tokenName=${searchParams.tokenName}`);
  const queryString = queryParams.join("&");
  const url = `/frame?${queryString}`;

  const metadata = {
    title: "Receipt Frame",
    other: {
      ...(await fetchMetadata(new URL(url, BASE_URL))),
    },
  };

  return metadata;
}

export default function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { txLink, networkLogo, networkName, amount, tokenName } =
    searchParams as any;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-black">
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="text-3xl text-center font-black">Tx Receipt Bot</div>
          <div className="text-lg text-center font-semibold">
            Frame for displaying transaction receipts
          </div>
        </div>
        {txLink && networkName && (
          <div className="flex flex-col items-center justify-center space-y-2">
            <img
              className="rounded-lg"
              width={500}
              src={`${BASE_URL}/api/image?networkLogo=${networkLogo}&amount=${amount}&networkName=${networkName}&tokenName=${tokenName}`}
            />
            <div>
              <button className="bg-white rounded-lg text-black p-2">
                <a target="_blank" href={txLink}>
                  View transaction
                </a>
              </button>
            </div>
          </div>
        )}
        <div className="flex flex-col mt-8 space-y-4 justify-center items-center">
          <div className="flex flex-row space-x-2">
            <p className="text-center font-medium">
              Go to{" "}
              <a
                style={{ color: "red" }}
                href="https://github.com/fabriguespe/botkit"
              >
                BotKit
              </a>{" "}
              to learn more
            </p>
          </div>
          <div>
            <p className="text-center text-sm mt-16">
              Made with ❤️ by{" "}
              <a className="text-green-500" href="https://builders.garden">
                builders.garden
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
