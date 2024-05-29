"use client";

import Link from "next/link";

export default function BadgeNotif({
  name,
  link,
  count,
}: {
  name: string;
  link: string;
  count: number | string;
}) {
  return (
    <Link href={link}>
      <div className="relative" style={{ cursor: "pointer", fontSize: 9 }}>
        <span className="px-4 py-2 border rounded shadow bg-white text-black">
          {name}
        </span>
        <span className="badge">{count || 0}</span>
      </div>
    </Link>
  );
}
