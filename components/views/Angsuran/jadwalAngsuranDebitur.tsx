"use client";
import {
  AngsuranDebitur,
  JadwalAngsuranDebitur as JDANGS,
} from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import { ceiling } from "@/components/utils/pdf/pdfUtil";
import {
  CheckCircleOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Spin, Table, TableProps, message } from "antd";
import moment from "moment";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getAngsuranPerBulan } from "../simulasi/simulasiUtil";

const CetakExcelAngsuranDebitur = dynamic(
  () => import("@/components/views/Angsuran/CetakExcelAngsuranDebitur"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
const CetakPdfAngsuranDebitur = dynamic(
  () => import("@/components/views/Angsuran/CetakPdfAngsuranDebitur"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default function JadwalAngsuranDebitur({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AngsuranDebitur>();
  const [pageSize, setPageSize] = useState(12);
  const [page, setPage] = useState(1);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/angsuran?id=${id}`);
      const result = await res.json();
      result.data.JadwalAngsuran.sort(
        (a: JDANGS, b: JDANGS) => a.angsuran_ke - b.angsuran_ke
      );
      setData(result.data);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, []);

  const handleClick = async (id: string) => {
    setLoading(true);
    const res = await fetch(`/api/angsuran`, {
      method: "PUT",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ id: id }),
    });
    const { msg } = await res.json();
    if (res.ok) {
      message.success(msg);
    } else {
      message.error(msg);
    }
    setLoading(false);
    await getData();
  };
  const handleDelete = async (id: string) => {
    setLoading(true);
    const res = await fetch(`/api/angsuran`, {
      method: "DELETE",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ id: id }),
    });
    const { msg } = await res.json();
    if (res.ok) {
      message.success(msg);
    } else {
      message.error(msg);
    }
    setLoading(false);
    await getData();
  };

  const columns: TableProps<JDANGS>["columns"] = [
    {
      title: "NO",
      dataIndex: "angsuran_ke",
      key: "angsuran_ke",
      width: 50,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
    },
    {
      title: "JADWAL BAYAR",
      dataIndex: "tanggal_bayar",
      key: "tanggal_bayar",
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
        return <>{moment(record.tanggal_bayar).format("DD-MM-YYYY")}</>;
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
          title: "ANGSURAN",
          dataIndex: "angsuran_perbulan",
          key: "angsuran_perbulan",
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
            return <>{formatNumber(record.angsuran.toFixed(0))}</>;
          },
        },
        {
          title: "ANGSURAN BANK",
          dataIndex: "angsuran_bank",
          key: "angsuran_bank",
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
            const angsuran = ceiling(
              parseInt(
                getAngsuranPerBulan(
                  record.DataPengajuan.DataPembiayaan.margin_bank,
                  record.DataPengajuan.DataPembiayaan.tenor,
                  record.DataPengajuan.DataPembiayaan.plafond
                )
              ),
              record.DataPengajuan.DataPembiayaan.pembulatan
            );
            return <>{formatNumber(angsuran.toFixed(0))}</>;
          },
        },
        {
          title: "SELISIH",
          dataIndex: "selisih",
          key: "selisih",
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
            const angsuran = ceiling(
              parseInt(
                getAngsuranPerBulan(
                  record.DataPengajuan.DataPembiayaan.mg_bunga,
                  record.DataPengajuan.DataPembiayaan.tenor,
                  record.DataPengajuan.DataPembiayaan.plafond
                )
              ),
              record.DataPengajuan.DataPembiayaan.pembulatan
            );
            const angsuranBank = ceiling(
              parseInt(
                getAngsuranPerBulan(
                  record.DataPengajuan.DataPembiayaan.margin_bank,
                  record.DataPengajuan.DataPembiayaan.tenor,
                  record.DataPengajuan.DataPembiayaan.plafond
                )
              ),
              record.DataPengajuan.DataPembiayaan.pembulatan
            );
            return <>{formatNumber((angsuran - angsuranBank).toFixed(0))}</>;
          },
        },
      ],
    },
    {
      title: "POKOK",
      dataIndex: "pokok",
      key: "pokok",
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
        return <>{formatNumber(record.pokok.toFixed(0))}</>;
      },
    },
    {
      title: "MARGIN",
      dataIndex: "margin",
      key: "margin",
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
        return <>{formatNumber(record.margin.toFixed(0))}</>;
      },
    },
    {
      title: "STATUS PEMBAYARAN",
      dataIndex: "status",
      key: "status",
      width: 150,
      className: "text-center",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return (
          <div className="flex justify-center gap-2 text-xs font-bold italic">
            <div
              className={`py-1 px-5 text-center text-white bg-${
                record.tanggal_pelunasan ? "green" : "red"
              }-500 text-xs`}
            >
              {record.tanggal_pelunasan ? "SUDAH BAYAR" : "BELUM BAYAR"}
            </div>
          </div>
        );
      },
    },
    {
      title: "TANGGAL PEMBAYARAN",
      dataIndex: "tanggal_bayar",
      key: "tanggal_bayar",
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
          <div className="text-center">
            {record.tanggal_pelunasan
              ? moment(record.tanggal_pelunasan).format("DD-MM-YYYY")
              : "-"}
          </div>
        );
      },
    },
    {
      title: "AKSI",
      dataIndex: "id",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      key: "aksi",
      width: 80,
      fixed: window.innerWidth < 600 ? false : "right",
      render(value, record, index) {
        return (
          <div className="flex justify-center gap-2">
            {!record.tanggal_pelunasan && (
              <button
                className="bg-green-500 hover:bg-green-600 text-white rounded shadow py-1 px-2"
                onClick={() => handleClick(record.id)}
              >
                {loading ? <LoadingOutlined /> : <CheckCircleOutlined />}
              </button>
            )}
            <button
              className="bg-red-500 hover:bg-red-600 text-white rounded shadow py-1 px-2"
              onClick={() => handleDelete(record.id)}
            >
              {loading ? <LoadingOutlined /> : <MinusCircleOutlined />}
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <Spin spinning={loading}>
      <div>
        <div className="my-1 px-2 flex gap-2 flex-wrap">
          {data ? <CetakPdfAngsuranDebitur data={data} /> : <LoadingOutlined />}
          {data ? (
            <CetakExcelAngsuranDebitur data={data} />
          ) : (
            <LoadingOutlined />
          )}
        </div>
        <div
          className="m-1 p-1 border font-bold flex justify-center gap-2 flex-wrap"
          style={{ fontSize: 12 }}
        >
          <div className="flex-1">
            <div className="flex gap-2">
              <span style={{ flex: 1.25 }}>NOPEN</span>
              <span style={{ flex: 0.5 }}>:</span>
              <span style={{ flex: 1.25 }}>{data && data.nopen}</span>
            </div>
            <div className="flex gap-2">
              <span style={{ flex: 1.25 }}>NAMA</span>
              <span style={{ flex: 0.5 }}>:</span>
              <span style={{ flex: 1.25 }}>{data && data.nama}</span>
            </div>
            <div className="flex gap-2">
              <span style={{ flex: 1.25 }}>TANGGAL AKAD</span>
              <span style={{ flex: 0.5 }}>:</span>
              <span style={{ flex: 1.25 }}>
                {data && moment(data.tanggal_cetak_akad).format("DD-MM-YYYY")}
              </span>
            </div>
            <div className="flex gap-2">
              <span style={{ flex: 1.25 }}>TANGGAL LUNAS</span>
              <span style={{ flex: 0.5 }}>:</span>
              <span style={{ flex: 1.25 }}>
                {data &&
                  moment(data.tanggal_cetak_akad)
                    .add(data.DataPembiayaan.tenor, "M")
                    .format("DD-MM-YYYY")}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex gap-2">
              <span style={{ flex: 1.25 }}>PLAFOND</span>
              <span style={{ flex: 0.5 }}>:</span>
              <span style={{ flex: 1.25 }}>
                {data && formatNumber(data.DataPembiayaan.plafond.toFixed(0))}
              </span>
            </div>
            <div className="flex gap-2">
              <span style={{ flex: 1.25 }}>TENOR</span>
              <span style={{ flex: 0.5 }}>:</span>
              <span style={{ flex: 1.25 }}>
                {data && data.DataPembiayaan.tenor} Bulan
              </span>
            </div>
            <div className="flex gap-2">
              <span style={{ flex: 1.25 }}>PRODUK PEMBIAYAAN</span>
              <span style={{ flex: 0.5 }}>:</span>
              <span style={{ flex: 1.25 }}>
                {data && data.DataPembiayaan.Produk.name}
              </span>
            </div>
            <div className="flex gap-2">
              <span style={{ flex: 1.25 }}>JENIS PEMBIAYAAN</span>
              <span style={{ flex: 0.5 }}>:</span>
              <span style={{ flex: 1.25 }}>
                {data && data.DataPembiayaan.jenis_pembiayaan_id
                  ? data.DataPembiayaan.JenisPembiayaan.name
                  : "Sisa Gaji"}
              </span>
            </div>
          </div>
        </div>
        <div className="p-2">
          <Table
            dataSource={data?.JadwalAngsuran || []}
            columns={columns}
            size="small"
            loading={loading}
            bordered
            pagination={{
              pageSizeOptions: [12, 24, 36, 48, 60, 72, 84, 96, 108, 120],
              pageSize: pageSize,
              onChange(page, pageSize) {
                setPageSize(pageSize);
              },
            }}
            scroll={{ x: "max-content", y: "calc(62vh - 100px)" }}
            summary={(pageData) => {
              let totalPokok = 0;
              let totalAngsuranBank = 0;
              let totalAngsuran = 0;
              let totalSelisih = 0;
              let totalMargin = 0;

              pageData.forEach((j, i) => {
                const angsuran = ceiling(
                  parseInt(
                    getAngsuranPerBulan(
                      j.DataPengajuan.DataPembiayaan.mg_bunga,
                      j.DataPengajuan.DataPembiayaan.tenor,
                      j.DataPengajuan.DataPembiayaan.plafond
                    )
                  ),
                  j.DataPengajuan.DataPembiayaan.pembulatan
                );
                const angsuranBank = ceiling(
                  parseInt(
                    getAngsuranPerBulan(
                      j.DataPengajuan.DataPembiayaan.margin_bank,
                      j.DataPengajuan.DataPembiayaan.tenor,
                      j.DataPengajuan.DataPembiayaan.plafond
                    )
                  ),
                  j.DataPengajuan.DataPembiayaan.pembulatan
                );

                totalPokok += j.pokok;
                totalAngsuran += angsuran;
                totalAngsuranBank += angsuranBank;
                totalSelisih += angsuran - angsuranBank;
                totalMargin += j.margin;
              });
              return (
                <Table.Summary.Row className="bg-green-500 text-white text-center">
                  <Table.Summary.Cell index={1} className="text-center">
                    Summary
                    <></>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>
                    <></>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>
                    <>{formatNumber(totalAngsuran.toFixed(0))}</>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>
                    <>{formatNumber(totalAngsuranBank.toFixed(0))}</>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={5}>
                    <>{formatNumber(totalSelisih.toFixed(0))}</>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={6}>
                    <>{formatNumber(totalPokok.toFixed(0))}</>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={7}>
                    <>{formatNumber(totalMargin.toFixed(0))}</>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={8}></Table.Summary.Cell>
                  <Table.Summary.Cell index={9}></Table.Summary.Cell>
                  <Table.Summary.Cell index={10}></Table.Summary.Cell>
                </Table.Summary.Row>
              );
            }}
          />
        </div>
      </div>
    </Spin>
  );
}
