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
          <div>PEMASUKAN</div>
          <div></div>
          <div>BEBAN</div>
          <div></div>
        </div>
        <div>
          <div>
            <span>PEMASUKAN</span>
            <span></span>
            <span>BEBAN</span>
            <span></span>
          </div>
          <div>
            <span>PEMASUKAN</span>
            <span></span>
            <span>BEBAN</span>
            <span></span>
          </div>
        </div>
        <div>
          <span>TOTAL</span>
          <span>:</span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}
