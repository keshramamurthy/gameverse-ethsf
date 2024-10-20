import { BASE_URL } from "@/lib/constants";
import { fetchMetadata } from "frames.js/next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ searchParams }: Props) {
  let queryParams = [];
  if (searchParams.winnerAddress) queryParams.push(`winnerAddress=${searchParams.winnerAddress}`);
  if (searchParams.item) queryParams.push(`item=${searchParams.item}`);
  const queryString = queryParams.join("&");
  const url = `/winnershow?${queryString}`;

  const metadata = {
    title: "Auction Winner Frame",
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