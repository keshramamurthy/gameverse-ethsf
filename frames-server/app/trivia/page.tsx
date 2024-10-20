import { BASE_URL } from "@/lib/constants";
import { fetchMetadata } from "frames.js/next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ searchParams }: Props) {
  const url = `/triviapage`;

  const metadata = {
    title: "Trivia Frame",
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
    console.log(BASE_URL);
  return <div></div>;
}