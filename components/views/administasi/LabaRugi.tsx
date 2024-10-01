"use client";

import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { DatePicker, Table, TableProps } from "antd";
import moment from "moment";
import { useState } from "react";

export default function LabaRugi() {
  const [month, setMonth] = useState("");

  return (
    <div>
      <div className="flex gap-2 mb-1">
        <DatePicker
          picker="month"
          onChange={(e) => {
            if (e) {
              setMonth(
                moment(`${e.get("year")}-${e.get("month") + 1}`).format(
                  "DD-MM-YYYY"
                )
              );
            } else {
              setMonth(moment().format("DD-MM-YYYY"));
            }
          }}
        />
        <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs italic rounded shadow px-3">
          Cetak
        </button>
      </div>
      <div>
        <div>
          <span>Pendapatan Operasional</span>
          <div className="flex flex-col gap-2">
            <div className="flex">
              <span className="flex-1">Pendapatan Selisih Bunga</span>
              <span className="flex-1"></span>
              <span className="flex-1"></span>
              <span className="flex-1"></span>
              <span className="flex-1">6.855.00</span>
            </div>
            <div>
              <span>Pendapatan Administrasi</span>
              <span></span>
              <span></span>
              <span></span>
              <span>6.855.00</span>
            </div>
            <div>
              <span>Pendapatan Selisih Asuransi</span>
              <span></span>
              <span></span>
              <span></span>
              <span>6.855.00</span>
            </div>
            <div>
              <span>Pendapatan Operasional Lainnya</span>
              <span></span>
              <span></span>
              <span></span>
              <span>6.855.00</span>
            </div>
          </div>
        </div>
        <div>
          <p>Beban Operasional</p>
          <div>
            <span>Beban Pemasaran</span>
            <div>
              <div>
                <span>Beban Fee Marketing/SPV</span>
                <span>14.000.000</span>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div>
                <span>Beban Pemasaran Lain-lain</span>
                <span>12.000.000</span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
