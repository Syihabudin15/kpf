"use client";

import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import { ceiling } from "@/components/utils/pdf/pdfUtil";
import { DatePicker, Input, Table, TableProps } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { getAngsuranPerBulan } from "../simulasi/simulasiUtil";

export default function RiwayatPencairanMitra() {
  const [name, setName] = useState<string>();
  const [year, setYear] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/slik/riwayat-pencairan-mitra?page=${page}${
        name ? "&name=" + name : ""
      }${year ? "&year=" + year : ""}`
    );
    const { data, total } = await res.json();
    setTotal(total);
    setData(data);
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [page, name, year]);

  const columns: TableProps<DataDataPengajuan>["columns"] = [
    {
      title: "NO",
      key: "no",
      width: 50,
      dataIndex: "no",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        const currPage = (page - 1) * 20;
        return <>{currPage + (index + 1)}</>;
      },
    },
    {
      title: "MITRA BANK",
      key: "mitra",
      width: 200,
      dataIndex: "mitra",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{record.Bank.kode}</>;
      },
    },
    {
      title: "NAMA PEMOHON",
      key: "nama",
      width: 200,
      dataIndex: "nama",
      fixed: window.innerWidth < 600 ? false : "left",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{record.DataPembiayaan.name}</>;
      },
    },
    {
      title: "PENGAJUAN PEMBIAYAAN",
      key: "pembiayaan",
      width: 150,
      dataIndex: "pembiayaan",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{formatNumber(record.DataPembiayaan.plafond.toFixed(0))}</>;
      },
    },
    {
      title: "PENCAIRAN MITRA BANK",
      key: "pencairan_mitra",
      width: 150,
      dataIndex: "pencairan_mitra",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        const admin =
          record.DataPembiayaan.plafond *
          ((record.DataPembiayaan.by_admin +
            record.DataPembiayaan.by_admin_bank +
            record.DataPembiayaan.by_lainnya) /
            100);
        const asuransi =
          record.DataPembiayaan.plafond *
          (record.DataPembiayaan.by_asuransi / 100);
        const angsuran =
          record.jenis_margin === "FLAT"
            ? ceiling(
                parseInt(
                  getAngsuranPerBulan(
                    record.DataPembiayaan.mg_bunga,
                    record.DataPembiayaan.tenor,
                    record.DataPembiayaan.plafond,
                    false,
                    true
                  )
                ),
                record.DataPembiayaan.pembulatan
              )
            : ceiling(
                parseInt(
                  getAngsuranPerBulan(
                    record.DataPembiayaan.mg_bunga,
                    record.DataPembiayaan.tenor,
                    record.DataPembiayaan.plafond,
                    false,
                    false,
                    record.Bank.kode,
                    record.DataPembiayaan.pembulatanKhusus
                  )
                ),
                record.DataPembiayaan.pembulatan
              );
        const blokir = angsuran * record.DataPembiayaan.blokir;
        const kotor =
          record.DataPembiayaan.plafond -
          (admin +
            asuransi +
            record.DataPembiayaan.by_tatalaksana +
            record.DataPembiayaan.by_mutasi +
            record.DataPembiayaan.by_provisi +
            record.DataPembiayaan.by_buka_rekening +
            record.DataPembiayaan.by_epotpen +
            record.DataPembiayaan.by_flagging +
            blokir +
            record.DataPembiayaan.by_materai);
        const bersih =
          kotor - (record.DataPembiayaan.bpp + record.DataPembiayaan.pelunasan);
        return <>{formatNumber(bersih.toFixed(0))}</>;
      },
    },
    {
      title: "TANGGAL PENCAIRAN",
      key: "tanggal_cair",
      width: 150,
      dataIndex: "tanggal_cair",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return (
          <>
            {record.DataPencairan.tanggal_proses &&
              moment(record.DataPencairan.tanggal_proses).format("DD-MM-YYYY")}
          </>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex gap-5 my-1 mx-1">
        <DatePicker
          picker="year"
          onChange={(date, dateString) => setYear(dateString as string)}
        />
        <Input.Search
          style={{ width: 170 }}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="p-2">
        <Table
          size="small"
          dataSource={data}
          columns={columns}
          scroll={{ x: "max-content", y: "calc(62vh - 100px)" }}
          bordered
          loading={loading}
          pagination={{
            pageSize: 20,
            total: total,
            onChange(page, pageSize) {
              setPage(page);
            },
          }}
        />
      </div>
    </div>
  );
}
