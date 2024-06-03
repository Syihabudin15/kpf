"use client";

import { formatNumber } from "@/components/utils/inputUtils";
import {
  CheckCircleOutlined,
  DoubleRightOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Divider, Spin, Table, TableProps } from "antd";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import dynamic from "next/dynamic";

const ChartMarketing = dynamic(
  () => import("@/components/views/dahsboard/ChartMarketing"),
  { ssr: false, loading: () => <LoadingOutlined /> }
);

export default function DashboardMarketing() {
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState<DataDataPengajuan[]>([]);
  const [dataHari, setDataHari] = useState<DataDataPengajuan[]>();

  const getData = async () => {
    setLoading(true);
    const res = await fetch("/api/dashboard/marketing",{ next: { revalidate: 300 }});
    const { dataHariIni, dataTable } = await res.json();
    setDataHari(dataHariIni);
    setDataTable(dataTable);

    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, []);
  return (
    <div className="p-0">
      <Spin spinning={loading}>
        <div className="my-10 flex flex-col sm:flex-row gap-5">
          <div className="flex-1 bg-white p-3 rounded shadow">
            <div className="flex justify-between items-center my-1">
              <div className="flex-1">
                <p className="font-bold">Report Statistic</p>
              </div>
            </div>
            <div>
              <ChartMarketing />
            </div>
          </div>
          <div className="flex-1 bg-white p-3 rounded shadow">
            <div className="flex justify-between items-center ">
              <p className="font-bold">Pengajuan Hari Ini</p>
              <p className="text-gray-500 text-xs">{moment().format("LL")}</p>
            </div>
            <Divider style={{ marginBottom: 8 }} />
            {dataHari &&
              dataHari.map((d: DataDataPengajuan, ind: any) => (
                <div className="flex flex-col gap-2" key={ind}>
                  <div className="text-xs flex gap-2 items-center  border-b px-2">
                    <div className="flex-1">
                      <p className="flex-1 font-bold">
                        {d.DataPembiayaan.name}
                      </p>
                      <p
                        className="flex-1 text-gray-500"
                        style={{ fontSize: 10 }}
                      >
                        {d.DataPembiayaan.nopen} |{" "}
                        {d.User.unit_cabang_id
                          ? d.User.UnitCabang.UnitPelayanan.kode_area
                          : "Jabar"}
                      </p>
                    </div>
                    <div className="flex-1 text-center">
                      <p>
                        Rp. {formatNumber(d.DataPembiayaan.plafond.toFixed(0))}
                      </p>
                    </div>
                    <div
                      className={`flex-1 flex gap-2 justify-end text-${
                        !d.status_pencairan
                          ? "orange"
                          : d.status_pencairan === "TRANSFER" ||
                            d.status_pencairan === "PROSES"
                          ? "green"
                          : "red"
                      }-500`}
                    >
                      <span className="text-right">
                        <CheckCircleOutlined />
                      </span>{" "}
                      <p>{d.status_pencairan || "PROSES"}</p>
                    </div>
                  </div>
                </div>
              ))}
            <div className="justify-self-end items-baseline mt-5 text-xs text-blue-600 italic text-right">
              <Link href={"/monitoring/marketing"}>
                See more <DoubleRightOutlined />
              </Link>
            </div>
          </div>
        </div>
        {/* Table */}
        <div>
          <div className="bg-orange-500 text-white p-3 text-center rounded">
            <p>Data Pengajuan Marketing</p>
          </div>
          <div className="bg-white p-2">
            <Table
              columns={columns}
              dataSource={dataTable}
              size="small"
              bordered
              scroll={{ x: 2000 }}
              pagination={{ pageSize: 20 }}
            />
          </div>
        </div>
        {/* End Table */}
      </Spin>
    </div>
  );
}

const columns: TableProps<DataDataPengajuan>["columns"] = [
  {
    title: "No",
    key: "no",
    dataIndex: "no",
    render(value, record, index) {
      return <>{index + 1}</>;
    },
  },
  {
    title: "Tanggal Pengajuan",
    key: "tanggal_pengajuan",
    dataIndex: "tanggal_pengajuan",
    render(value, record, index) {
      return (
        <>{moment(record.DataPembiayaan.tanggal_input).format("DD-MM-YYYY")}</>
      );
    },
  },
  {
    title: "Nopen",
    key: "nopen",
    dataIndex: "nopen",
    render(value, record, index) {
      return <>{record.DataPembiayaan.nopen}</>;
    },
  },
  {
    title: "Nama Pemohon",
    key: "Nama Pemohon",
    dataIndex: "Nama Pemohon",
    render(value, record, index) {
      return <>{record.DataPembiayaan.name}</>;
    },
  },
  {
    title: "Produk Pembiayaan",
    key: "produk",
    dataIndex: "produk",
    render(value, record, index) {
      return <>{record.DataPembiayaan.Produk.name}</>;
    },
  },
  {
    title: "Jenis Pembiayaan",
    key: "jenis",
    dataIndex: "jenis",
    render(value, record, index) {
      return (
        <>
          {record.DataPembiayaan.jenis_pembiayaan_id
            ? record.DataPembiayaan.JenisPembiayaan.name
            : "-"}
        </>
      );
    },
  },
  {
    title: "Tenor",
    key: "tenor",
    dataIndex: "tenor",
    render(value, record, index) {
      return <>{record.DataPembiayaan.tenor}</>;
    },
  },
  {
    title: "Plafond",
    key: "plafond",
    dataIndex: "plafond",
    render(value, record, index) {
      return <>Rp. {formatNumber(record.DataPembiayaan.plafond.toFixed(0))}</>;
    },
  },
  {
    title: "Sumber Dana",
    key: "sumber_dana",
    dataIndex: "sumber_dana",
    render(value, record, index) {
      return <>{record.Bank.name}</>;
    },
  },
];
