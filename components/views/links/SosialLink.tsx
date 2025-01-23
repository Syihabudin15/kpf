import { Role } from "@prisma/client";
import Link from "next/link";

export default function SosialLink({ role }: { role: Role }) {
  return (
    <div className="flex gap-2 flex-wrap justify-evenly p-2">
      <div className="flex-1 border p-2 flex flex-col gap-2">
        {linksLeft.map((d, i: number) => (
          <div
            className={`${d.role.includes(role) ? "flex" : "hidden"} border-b`}
            key={i}
          >
            <span className="w-36 sm:w-56">{d.title}</span>
            <span className="w-4 sm:w-11">:</span>
            <Link
              href={d.link}
              className="text-right text-blue-500"
              target="_blank"
            >
              {d.linkTitle}
            </Link>
          </div>
        ))}
      </div>
      <div className="flex-1 border p-2 flex flex-col gap-2">
        {linksRight.map((d, i: number) => (
          <div
            className={`${d.role.includes(role) ? "flex" : "hidden"} border-b`}
            key={i}
          >
            <span className="w-36  sm:w-56">{d.title}</span>
            <span className="w-4 sm:w-11">:</span>
            <Link
              href={d.link}
              className="text-right text-blue-500"
              target="_blank"
            >
              {d.linkTitle}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

const linksLeft = [
  {
    title: "Web Page",
    linkTitle: "https://kpfi.co.id",
    link: "https://kpfi.co.id",
    role: ["ALL"],
  },
  {
    title: "Sistem Live",
    linkTitle: "https://sipboss.kpfi.co.id",
    link: "https://sipboss.kpfi.co.id",
    role: ["ALL"],
  },
  {
    title: "Sistem Dev",
    linkTitle: "https://sip.kpfi.co.id",
    link: "https://sip.kpfi.co.id",
    role: ["ALL"],
  },
  {
    title: "Email",
    linkTitle: "kopjasfas@kpfi.co.id",
    link: "mailto:kopjasfas@kpfi.co.id",
    role: ["ALL"],
  },
  {
    title: "Whatsapp",
    linkTitle: "0821 - 4561 - 4774",
    link: "https://wa.me/+6282145614774",
    role: ["ALL"],
  },
];
const linksRight = [
  {
    title: "Data Tabungan",
    linkTitle: "Go to Drive",
    link: "https://drive.google.com/drive/folders/1l2zFyvhA2s4TrwJgBdj5R3_odAjM-dKt?usp=sharing",
    role: ["MASTER", "OPERASIONAL", "KEUANGAN", "ENTRY_DATA"],
  },
  {
    title: "Data Deviasi",
    linkTitle: "Go to Drive",
    link: "https://drive.google.com/drive/folders/1XOWKCUkplw5SzcJkPWUapan35I1yx7o4?usp=sharing",
    role: ["MASTER", "OPERASIONAL"],
  },
  {
    title: "Data Pemberkasan",
    linkTitle: "Go to Drive",
    link: "https://drive.google.com/drive/folders/1RvXqM5k7RFPYnZljk7YNw6fIUuRDsJmO?usp=sharing",
    role: ["MASTER", "PEMBERKASAN", "OPERASIONAL"],
  },
  {
    title: "Data Keuangan",
    linkTitle: "Go to Drive",
    link: "https://drive.google.com/drive/folders/1R_rakSspicvX-yja3lPQ-QafBh7Koxfz?usp=sharing",
    role: ["MASTER", "OPERASIONAL", "KEUANGAN"],
  },
  {
    title: "Berkas Kerjasama",
    linkTitle: "Go to Drive",
    link: "https://drive.google.com/drive/folders/1IIsxpa11fvewo_mICuRqjIAPQApx8TVN?usp=sharing",
    role: ["MASTER", "OPERASIONAL"],
  },
  {
    title: "Materi Presentasi",
    linkTitle: "Go to Drive",
    link: "https://drive.google.com/drive/folders/1xe_VD8QqPsyVwk7P2xBfBHL23Q6a11ls?usp=sharing",
    role: ["MASTER", "PEMBERKASAN", "OPERASIONAL", "ENTRY_DATA"],
  },
];
