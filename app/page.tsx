import {client, homeQuery} from "@/sanity/lib/client";
import {defineQuery} from "next-sanity";
import {draftMode} from "next/headers";
import { Metadata } from "next";
import { sanityFetch } from "@/sanity/lib/live";
import Homepage from "@/components/pages/Home";

export const revalidate = 2592000;

export async function generateMetadata(): Promise<Metadata> {
  const query = defineQuery(homeQuery);

    const { data } = await sanityFetch({
      query: query,
    });

  const aspectRatio = 1.91; // The desired aspect ratio
  let width = 1200; // Default width

  let height = Math.round(width / aspectRatio);

  if (height > 630) {
    height = 630;
    width = Math.round(height * aspectRatio);
  }

  console.log(data)

  const metaTitle = `PeakPulse`;
  const metadata = {
    title: metaTitle,
    description: "",

    openGraph: {
      title: metaTitle,
      description:
        data && data.meta_description != null ? data.meta_description : "PeakPulse Agency is a performance-driven digital solutions firm based in Puerto Princesa, Mimaropa, Philippines. We deliver expert web development, professional video production, strategic digital marketing, and comprehensive automation solutions to small and large businesses.",
      url: `https://peak-pulse.vercel.app/`,
      siteName: `${metaTitle}`,
      images: [
        {
          url: data && data.meta_image && data.meta_image,
          width: 1200,
          height: 630,
          aspectRatio: aspectRatio,
        },
      ],
      type: "website",
    },
    other: {
      "Permissions-Policy":
        "payment=(), microphone=(), camera=(), geolocation=()",
    },
  };
  return metadata;
}

export default async function Home() {
  // get api query from client.ts
  // defineQuery a type safety to reduce errors and slowness of getting data
  const query = defineQuery(homeQuery);

  const { data } = await sanityFetch({
    query: query,
  });

  return <Homepage data={data} />;
}

export async function generateStaticParams() {

  return [
    {slug: "/"}
  ];
}