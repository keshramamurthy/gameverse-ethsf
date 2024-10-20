import { BASE_URL } from "@/lib/constants";
import { fetchMetadata } from "frames.js/next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ searchParams }: Props) {
  let queryParams = [];
  if (searchParams.address) queryParams.push(`address=${searchParams.address}`);
  if (searchParams.balance)
    queryParams.push(`balance=${searchParams.balance}`);
  const queryString = queryParams.join("&");
  const url = `/balancecheck?${queryString}`;

  const metadata = {
    title: "Balance Frame",
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
    return (
        <div> </div>
    )
  }