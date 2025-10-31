"use client";

import Link from "next/link";
import Image from "next/image";

interface FolderCardProps {
  title: string;
  subtitle?: string;
  href: string;
  imageSrc?: string;
}

const FolderCard = ({ title, subtitle, href, imageSrc }: FolderCardProps) => {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm shadow-sm hover:shadow-md transition-all overflow-hidden"
    >
      <div className="relative aspect-[5/3] w-full bg-gray-50 dark:bg-neutral-800">
        <Image
          src={imageSrc || "/mockUps/tshirt1.png"}
          alt={title}
          fill
          className="object-cover transform transition-transform duration-300 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        <div className="absolute left-3 top-3 inline-flex items-center gap-2 text-white">
          <Image src="/icons/folder.svg" alt="folder" width={18} height={18} />
          <span className="text-sm font-medium drop-shadow">{title}</span>
        </div>
        {subtitle ? (
          <div className="absolute right-3 bottom-3 text-[11px] px-2 py-0.5 rounded-full bg-white/95 text-gray-800 dark:bg-neutral-800 dark:text-gray-100">
            {subtitle}
          </div>
        ) : null}
      </div>
    </Link>
  );
};

export default FolderCard;


