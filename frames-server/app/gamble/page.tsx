import { BASE_URL } from "@/lib/constants";
import { fetchMetadata } from "frames.js/next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ searchParams }: Props) {
  let queryParams = [];
  if (searchParams.coins) queryParams.push(`coins=${searchParams.coins}`);
  if (searchParams.win) queryParams.push(`win=${searchParams.win}`);
  const queryString = queryParams.join("&");
  const url = `/gamblepage?${queryString}`;

  const metadata = {
    title: "Gamble Frame",
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
  return <div></div>;
}