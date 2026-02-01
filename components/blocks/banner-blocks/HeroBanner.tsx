import { PortableText } from "@portabletext/react";
import Link from "next/link";
import "./heroBanner.css";
import { PortableTextBlock } from "@/components/global/component";

type BannerProps = {
  title_block?: PortableTextBlock[];
  description?: PortableTextBlock[];
  buttonLabel?: string;
  buttonLink?: string;
  sectionId?: string;
  section_size?: string;
  removeBg?: boolean;
  image: string
  logo: string
  font_size: string
};

const Banner = ({
  title_block = [],
  description = [],
  buttonLabel,
  buttonLink,
  sectionId,
  section_size = "medium",
  removeBg,
}: BannerProps) => {
  return (
    <section
      id={sectionId}
      className={`hero ${section_size} ${removeBg ? "no-bg" : ""}`}
    >
      {!removeBg && <div className="hero-grid" />}

      {!removeBg && (
        <>
          <div className="hero-blob hero-blob-primary" />
          <div className="hero-blob hero-blob-secondary" />
        </>
      )}

      <div className="hero-container">
        {title_block.length > 0 && (
          <div className="hero-title fade-up">
            <PortableText value={title_block} />
          </div>
        )}

        {description.length > 0 && (
          <div className="hero-description fade-up delay-1">
            <PortableText value={description} />
          </div>
        )}

        {(buttonLabel || buttonLink) && (
          <div className="hero-actions fade-up delay-2">
            {buttonLink && (
              <Link href={buttonLink} className="btn btn-primary">
                {buttonLabel || "Get Started"}
              </Link>
            )}

            <Link href="#services" className="btn btn-secondary">
              See Services
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Banner;
