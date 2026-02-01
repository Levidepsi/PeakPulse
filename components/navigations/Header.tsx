"use client";

import Link from "next/link";
import Image from "next/image";
import { HeaderValues } from "@/types/header";
import "./navigation.css"
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const Header = ({ navigation }: { navigation: HeaderValues }) => {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState<boolean | null>(false);


  useEffect(() => {
    let lastScroll = 0;

    const header = document.querySelector(".site-header");
    const navContainer = document.querySelector(".nav-container");

    const scrollHandler = () => {
      const currentScroll = window.scrollY;

      if (currentScroll >= 300 && currentScroll > lastScroll) {
        header?.classList.add("active");
        navContainer?.classList.add("active");
        setScrolled(true);
      } else if (currentScroll < 300) {
        header?.classList.remove("active");
        navContainer?.classList.remove("active");
        setScrolled(false);
      }

      lastScroll = currentScroll;
    };

    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    console.log(id)
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  
  
  if (pathname.includes("/admin")) {
    return null
  }

  return (
    <header className="site-header">
      <nav className="nav container">
        {/* Logo */}
        <Link href="/" className="logo">
          {navigation.header_logo ? (
            <Image
              src={navigation.header_logo}
              alt={navigation.title || "Logo"}
              width={140}
              height={40}
              priority
            />
          ) : (
            navigation.title
          )}
        </Link>

        {/* Navigation */}
        <ul className="nav-links">
          {navigation.header_menu?.map((item, index) => {
            // 1️⃣ Section scroll
            if (item.linkId) {
              return (
                <li key={index}>
                  <button
                    className="nav-link"
                    onClick={() => handleScroll(item.linkId)}
                  >
                    {item.title}
                  </button>
                </li>
              );
            }

            // 2️⃣ Internal page
            if (item.page?.slug?.slug) {
              return (
                <li key={index}>
                  <Link
                    href={`/${item.page.slug.slug}`}
                    className="nav-link"
                  >
                    {item.title}
                  </Link>
                </li>
              );
            }

            // 3️⃣ External/custom link
            // if (item.link) {
            //   return (
            //     <li key={index}>
            //       <Link
            //         href={item.link}
            //         className="nav-link"
            //         target="_blank"
            //         rel="noopener noreferrer"
            //       >
            //         {item.title}
            //       </Link>
            //     </li>
            //   );
            // }

            return null;
          })}
        </ul>

        {/* CTA (optional) */}
        <button className="cta-button">Book Call</button>
      </nav>
    </header>
  );
};

export default Header;
