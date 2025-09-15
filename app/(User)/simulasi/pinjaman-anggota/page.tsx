import { KreditKaryawan } from "@/components/v1";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Pinjaman Anggota" };

export default function Page() {
  return (
    <div className="bg-white p-1">
      <KreditKaryawan />
    </div>
  );
}
