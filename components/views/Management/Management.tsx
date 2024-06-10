"use client";

import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import { ceiling } from "@/components/utils/pdf/pdfUtil";
import { DatePicker, Select, Table, TableProps } from "antd";
import { useEffect, useState } from "react";
import { getAngsuranPerBulan } from "../simulasi/simulasiUtil";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";

const CetakManagement = dynamic(
  () => import("@/components/views/Management/CetakManagement"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default function Management() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [type, setType] = useState<string>();
  const [month, setMonth] = useState<string>(
    `${new Date().getFullYear()}-${new Date().getMonth() + 1}`
  );
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/management?page=${page}&pageSize=${pageSize}&month=${month}${
        type ? "&type=" + type : ""
      }`
    );
    const { data, total } = await res.json();
    setData(data);
    setTotal(total);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [page, pageSize, month, type]);

  const columns: TableProps<DataDataPengajuan>["columns"] = [
    {
      title: "NO",
      key: "no",
      dataIndex: "no",
      width: 50,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{(page - 1) * 20 + (index + 1)}</>;
      },
    },
    {
      title: "NOPEN",
      key: "nopen",
      dataIndex: "nopen",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{record.DataPembiayaan.nopen}</>;
      },
    },
    {
      title: "NAMA PEMOHON",
      key: "nopen",
      dataIndex: "nopen",
      fixed: window.innerWidth < 600 ? false : "left",
      width: 200,
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
      title: "MITRA KOPERASI",
      key: "mitra_koperasi",
      dataIndex: "mitra_koperasi",
      width: 200,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{record.Bank.name}</>;
      },
    },
    {
      title: "TENOR",
      key: "tenor",
      dataIndex: "tenor",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{record.DataPembiayaan.tenor}</>;
      },
    },
    {
      title: "PLAFOND",
      key: "plafond",
      dataIndex: "plafond",
      width: 150,
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
      title: "ANGSURAN",
      key: "angsuran",
      dataIndex: "angsuran",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      children: [
        {
          title: "ANGSURAN BANK",
          key: "angsuran_bank",
          dataIndex: "angsuran_bank",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          render(value, record, index) {
            const angsuran = getAngsuranPerBulan(
              record.DataPembiayaan.margin_bank,
              record.DataPembiayaan.tenor,
              record.DataPembiayaan.plafond
            );
            return (
              <>
                {formatNumber(
                  ceiling(
                    parseInt(angsuran),
                    record.DataPembiayaan.pembulatan
                  ).toFixed(0)
                )}
              </>
            );
          },
        },
        {
          title: "ANGSURAN KOPERASI",
          key: "angsuran_koperasi",
          dataIndex: "angsuran_koperasi",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          render(value, record, index) {
            const angsuran = getAngsuranPerBulan(
              record.DataPembiayaan.mg_bunga,
              record.DataPembiayaan.tenor,
              record.DataPembiayaan.plafond
            );
            return (
              <>
                {formatNumber(
                  ceiling(
                    parseInt(angsuran),
                    record.DataPembiayaan.pembulatan
                  ).toFixed(0)
                )}
              </>
            );
          },
        },
        {
          title: "SELISIH ANGSURAN",
          key: "selisih_angsuran",
          dataIndex: "selisih_angsuran",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          render(value, record, index) {
            const angsuran_koperasi = ceiling(
              parseInt(
                getAngsuranPerBulan(
                  record.DataPembiayaan.mg_bunga,
                  record.DataPembiayaan.tenor,
                  record.DataPembiayaan.plafond
                )
              ),
              record.DataPembiayaan.pembulatan
            );
            const angsuran_bank = ceiling(
              parseInt(
                getAngsuranPerBulan(
                  record.DataPembiayaan.margin_bank,
                  record.DataPembiayaan.tenor,
                  record.DataPembiayaan.plafond
                )
              ),
              record.DataPembiayaan.pembulatan
            );
            return (
              <>
                {formatNumber((angsuran_koperasi - angsuran_bank).toFixed(0))}
              </>
            );
          },
        },
      ],
    },
    {
      title: "ADMIN",
      key: "admin",
      dataIndex: "admin",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      children: [
        {
          title: "ADMIN BANK",
          key: "admin_bank",
          dataIndex: "admin_bank",
          width: 150,
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
                {formatNumber(
                  (record.DataPembiayaan.plafond * (1 / 100)).toFixed(0)
                )}
              </>
            );
          },
        },
        {
          title: "ADMIN KOPERASI",
          key: "admin_koperasi",
          dataIndex: "admin_koperasi",
          width: 150,
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
                {formatNumber(
                  (record.DataPembiayaan.plafond * (1 / 100)).toFixed(0)
                )}
              </>
            );
          },
        },
        {
          title: "ADMIN AREA",
          key: "pencadangan",
          dataIndex: "pencadangan",
          width: 150,
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
                {formatNumber(
                  (record.DataPembiayaan.plafond * (3 / 100)).toFixed(0)
                )}
              </>
            );
          },
        },
      ],
    },
    {
      title: "BUKA REKENING",
      key: "rekening",
      dataIndex: "rekening",
      width: 150,
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
          <>{formatNumber(record.DataPembiayaan.by_buka_rekening.toFixed(0))}</>
        );
      },
    },
    {
      title: "FLAGGING",
      key: "flagging",
      dataIndex: "flagging",
      width: 150,
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
          <>{formatNumber(record.DataPembiayaan.by_flagging.toFixed(0))}</>
        );
      },
    },
    {
      title: "EPOTPEN",
      key: "epotpen",
      dataIndex: "epotpen",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{formatNumber(record.DataPembiayaan.by_epotpen.toFixed(0))}</>;
      },
    },
    {
      title: "MATERAI",
      key: "materai",
      dataIndex: "materai",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{formatNumber(record.DataPembiayaan.by_materai.toFixed(0))}</>;
      },
    },
    {
      title: "MUTASI",
      key: "mutasi",
      dataIndex: "mutasi",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{formatNumber(record.DataPembiayaan.by_mutasi.toFixed(0))}</>;
      },
    },
    {
      title: "TATALAKSANA",
      key: "tatalaksana",
      dataIndex: "tatalaksana",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      children: [
        {
          title: "TLK_EH",
          key: "tlk_eh",
          dataIndex: "tlk_eh",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          render(value, record, index) {
            const tl =
              record.DataPembiayaan.Produk.name === "Flash Sisa Gaji"
                ? record.DataPembiayaan.by_tatalaksana * (1 / 100)
                : record.DataPembiayaan.by_tatalaksana
                ? 200000
                : 0;
            return <>{formatNumber(tl.toFixed(0))}</>;
          },
        },
        {
          title: "TLK_IB",
          key: "tlk_ib",
          dataIndex: "tlk_ib",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          render(value, record, index) {
            const tl =
              record.DataPembiayaan.Produk.name === "Flash Sisa Gaji"
                ? record.DataPembiayaan.by_tatalaksana * (2 / 100)
                : record.DataPembiayaan.by_tatalaksana
                ? 300000
                : 0;
            return <>{formatNumber(tl.toFixed(0))}</>;
          },
        },
      ],
    },
    {
      title: "ASURANSI",
      key: "asuransi",
      dataIndex: "asuransi",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      children: [
        {
          title: "ASURANSI MITRA",
          key: "asuransi_mitra",
          dataIndex: "asuransi_mitra",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          render(value, record, index) {
            return <>{formatNumber((0).toFixed(0))}</>;
          },
        },
        {
          title: "ASURANSI KOPERASI",
          key: "asuransi_koperasi",
          dataIndex: "asuransi_koperasi",
          width: 150,
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
                {formatNumber(
                  (
                    record.DataPembiayaan.plafond *
                    (record.DataPembiayaan.by_asuransi / 100)
                  ).toFixed(0)
                )}
              </>
            );
          },
        },
        {
          title: "SELISIH ASURANSI",
          key: "selisih_asuransi",
          dataIndex: "selisih_asuransi",
          width: 150,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          render(value, record, index) {
            const asuransi_koperasi =
              record.DataPembiayaan.plafond *
              (record.DataPembiayaan.by_asuransi / 100);
            const asuransi_mitra = 0;
            return (
              <>
                {formatNumber((asuransi_koperasi - asuransi_mitra).toFixed(0))}
              </>
            );
          },
        },
      ],
    },
  ];
  return (
    <div>
      <div className="flex gap-2 flex-wrap px-1 py-1 items-center">
        <Select
          options={[
            { label: "REGULER", value: "REGULER" },
            { label: "EXPRESS", value: "EXPRESS" },
          ]}
          onChange={(e: any) => setType(e)}
          allowClear
          placeholder="Select Group"
        />
        <DatePicker
          picker="month"
          onChange={(date: any, dateString: any) => setMonth(dateString)}
        />
        <CetakManagement data={data || []} type={type ? type : null} />
      </div>
      <div className="p-1">
        <Table
          columns={columns}
          dataSource={data}
          bordered
          size="small"
          pagination={{
            total: total,
            pageSize: pageSize,
            onChange(page, pageSize) {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          scroll={{ x: 4000, y: "calc(65vh - 100px)" }}
          loading={loading}
        />
      </div>
    </div>
  );
}
