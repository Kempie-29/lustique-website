import type { ReactNode } from "react";
import { Monogram } from "@/components/shell/Monogram";
import { BlurUpImage } from "@/components/shell/BlurUpImage";

interface CardProps {
  media?: ReactNode;
  /** Falls back to a monogram placeholder when no photo is supplied. */
  imageUrl?: string;
  alt?: string;
  mark?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ media, imageUrl, alt, mark, children, className = "" }: CardProps) {
  return (
    <article className={`card ${className}`.trim()}>
      {(media || imageUrl || mark) && (
        <div className="card__media">
          {media ?? (imageUrl ? <BlurUpImage src={imageUrl} alt={alt ?? ""} /> : <Monogram mark={mark} />)}
        </div>
      )}
      <div className="card__body">{children}</div>
    </article>
  );
}