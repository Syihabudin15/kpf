"use client";
import { Divider, Spin, Table, TableProps } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  CheckCircleOutlined,
  DoubleRightOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { formatNumber } from "@/components/utils/inputUtils";

import {
  DataDataPengajuan,
  DataTableEntryData,
  DataTypePengajuan,
  DataUser,
} from "@/components/utils/Interfaces";
import dynamic from "next/dynamic";

const ChartEntry = dynamic(
  () => import("@/components/views/dahsboard/ChartEntry"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default function DashboardEntry() {
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState<DataTableEntryData[]>([]);
  const [dataHari, setDataHari] = useState<DataDataPengajuan[]>();
  const [namaArea, setNamaArea] = useState<string>();

  const getData = async () => {
    setLoading(true);
    const res = await fetch("/api/dashboard/entry_data");
    const { pengajuanHariIni, dataTable, namaArea } = await res.json();
    setDataHari(pengajuanHariIni);
    setNamaArea(namaArea);
    setDataTable(
      dataTable.map((d: DataTableEntryData) => {
        return { ...d, key: d.id };
      })
    );
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
                <p className="font-bold">
                  Report Statistic {new Date().getFullYear()}
                </p>
              </div>
            </div>
            <div>
              <ChartEntry />
            </div>
          </div>
          <div className="flex-1 bg-white p-3 rounded shadow">
            <div className="flex justify-between items-center ">
              <p className="font-bold">Pengajuan Hari Ini</p>
              <p className="text-gray-500 text-xs">{moment().format("LL")}</p>
            </div>
            <Divider style={{ marginBottom: 8 }} />
            {dataHari &&
              dataHari.map((d: DataDataPengajuan, ind) => (
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
                    <div className="flex-1 flex gap-2 justify-end">
                      <span
                        className={`text-${
                          d.status_verifikasi === "DITOLAK"
                            ? "red"
                            : d.status_verifikasi === "ANTRI"
                            ? "blue"
                            : "green"
                        }-500 mr-3`}
                      >
                        <CheckCircleOutlined />
                      </span>{" "}
                      <p>{d.status_verifikasi}</p>
                    </div>
                  </div>
                </div>
              ))}
            <div className="justify-self-end items-baseline mt-5 text-xs text-blue-600 italic text-right">
              <Link href={"/monitoring/entry-data"}>
                See more <DoubleRightOutlined />
              </Link>
            </div>
          </div>
        </div>
        {/* Table */}
        <div>
          <div className="bg-orange-500 text-white p-3 text-center rounded">
            <p>DATA AREA {namaArea}</p>
          </div>
          <div className="bg-white p-2">
            <Table
              columns={columns}
              dataSource={dataTable}
              bordered
              loading={loading}
              size="small"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 1000 }}
              expandable={{
                expandedRowRender: (record) => {
                  return (
                    <Table
                      columns={columnsExpandUser}
                      dataSource={record.User.map((e) => {
                        return { ...e, key: e.id };
                      })}
                      bordered
                      size="small"
                      scroll={{ x: 1000 }}
                      pagination={false}
                      expandable={{
                        expandedRowRender: (record) => {
                          return (
                            <Table
                              columns={columnsExpandPengajuan}
                              dataSource={record.DataPengajuan.map((e: any) => {
                                return { ...e, key: e.id };
                              })}
                              bordered
                              size="small"
                              scroll={{ x: 1000 }}
                              pagination={false}
                            />
                          );
                        },
                      }}
                    />
                  );
                },
              }}
            />
          </div>
        </div>
        {/* End Table */}
      </Spin>
    </div>
  );
}

const columns: TableProps<DataTableEntryData>["columns"] = [
  {
    title: "Kode Cabang",
    dataIndex: "kode_cabang",
    key: "kode_cabang",
    render(value, record, index) {
      return <>{record.kode_area}</>;
    },
  },
  {
    title: "Nama Cabang",
    dataIndex: "nama_cabang",
    key: "nama_cabang",
    render(value, record, index) {
      return <>{record.name}</>;
    },
  },
  {
    title: "NOA",
    key: "noa",
    dataIndex: "noa",
    render(value, record, index) {
      let noa = 0;
      record.User.forEach((user) => {
        noa += user.DataPengajuan.length;
      });
      return <>{noa}</>;
    },
  },
  {
    title: "Total Plafon",
    key: "total_plafon",
    dataIndex: "total_plafon",
    render(value, record, index) {
      let plafond = 0;
      record.User.forEach((user) => {
        user.DataPengajuan.forEach((pengajuan) => {
          plafond += pengajuan.DataPembiayaan.plafond;
        });
      });
      return <>Rp. {formatNumber(plafond.toFixed(0))}</>;
    },
  },
];

const columnsExpandUser: TableProps<DataUser>["columns"] = [
  {
    title: "Nama Marketing",
    key: "nama_marketing",
    dataIndex: "nama_marketing",
    render(value, record, index) {
      return <>{record.first_name + " " + record.last_name}</>;
    },
  },
  {
    title: "NOA",
    key: "noa",
    dataIndex: "noa",
    render(value, record, index) {
      return <>{record.DataPengajuan.length}</>;
    },
  },
  {
    title: "Total Plafond",
    key: "total_plafond",
    dataIndex: "total_plafond",
    render(value, record, index) {
      let plafond = 0;
      record.DataPengajuan.forEach((pengajuan) => {
        plafond += pengajuan.DataPembiayaan.plafond;
      });
      return <>Rp. {formatNumber(plafond.toFixed(0))}</>;
    },
  },
];

const columnsExpandPengajuan: TableProps<DataTypePengajuan>["columns"] = [
  {
    title: "Nama Pemohon",
    key: "nama_pemohon",
    dataIndex: "nama_pemohon",
    render(value, record, index) {
      return <>{record.DataPembiayaan.name}</>;
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
    title: "Sumber Dana",
    key: "sumber_dana",
    dataIndex: "sumber_dana",
    render(value, record, index) {
      return <>{record.DataPembiayaan.Produk.Bank.name}</>;
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
];
