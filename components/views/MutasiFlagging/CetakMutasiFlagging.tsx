"use client";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { PrinterOutlined } from "@ant-design/icons";

export default function CetakMutasiFlagging({
  data,
}: {
  data: DataDataPengajuan[];
}) {
  return (
    <div>
      <button className="bg-green-500 hover:bg-green-600 italic rounded shadow py-1 px-2 text-xs text-white">
        <PrinterOutlined /> Cetak
      </button>
    </div>
  );
}
