/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client"

import { PortableText, SanityDocument } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import {motion} from "motion/react"
import SpreadComponents from "../global/SpreadComponents";

// create a custom type for data

// type HomePageData = {
//   _id: string;
//   _type: "home";
//   title: string;
//   slug: string;
//   components?: {
//     _key: string;
//     _type: string;
//     image_mobile?: string;
//     image_desktop?: string;
//     logo_title?: string;
//   }[];
// };

interface ICONS {
  image: string;
  link: string
}


type HomepagePageProps = {
  data: SanityDocument
}

const Homepage = ({ data }: HomepagePageProps) => {


  
  return (
    <div className="">
      
      {data && data.components && <SpreadComponents components={data.components} />}
    </div>
  );
};

export default Homepage;