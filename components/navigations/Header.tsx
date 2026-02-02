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

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  
  
  if (pathname.includes("/admin")) {
    return null
  }

  return (
    <header className={`site-header ${menuOpen ? "menu-openned" :  ""}`}>
      <nav className="nav container">
        {/* Logo */}
        <Link href="/" className="logo">
          {navigation.header_logo ? (
            <Image
              src={navigation.header_logo}
              alt={navigation.title || "Logo"}
              width={140}
              height={140}
              priority
              className="w-[200px] w-[250px] h-auto"
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
        <button onClick={() => handleScroll("contact")} className="cta-button">Book Call</button>
        <button
          className="menu-button"
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>
      </nav>
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <button
            className="mobile-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>

          <ul className="mobile-nav">
            {navigation.header_menu?.map((item, index) => {
              if (item.linkId) {
                return (
                  <li key={index}>
                    <button
                      onClick={() => {
                        handleScroll(item.linkId);
                        setMenuOpen(false);
                      }}
                    >
                      {item.title}
                    </button>
                  </li>
                );
              }

              if (item.page?.slug?.slug) {
                return (
                  <li key={index}>
                    <Link
                      href={`/${item.page.slug.slug}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              }

              return null;
            })}
          </ul>

          <button
            className="mobile-cta"
            onClick={() => {
              handleScroll("contact");
              setMenuOpen(false);
            }}
          >
            Book Call
          </button>
        </div>
    </header>
  );
};

export default Header;
