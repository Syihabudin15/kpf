"use client";
import { formatNumber, formatNumberTitik } from "@/components/utils/inputUtils";
import { LoadingOutlined, PrinterFilled } from "@ant-design/icons";
import { Input, Modal, Table, TableProps } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import UploadBerkasSI from "./UploadBerkasSI";
import dynamic from "next/dynamic";
import { DataDataPencairan } from "@/components/utils/Interfaces";
import CetakNominatif from "@/components/utils/CetakNominatif";

const ModalBerkas = dynamic(() => import("@/components/utils/ModalBerkas"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

const CetakSI = dynamic(() => import("@/components/views/dataPdf/CetakSI"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

export default function PengajuanPencairan() {
  const [data, setData] = useState<DataDataPencairan[]>();
  const [selected, setSelected] = useState<DataDataPencairan>();
  const [name, setName] = useState<string>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalSI, setModalSI] = useState(false);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/ops/pengajuan-pencairan?page=${page}${name ? "&name=" + name : ""}`
    );
    const { data, total } = await res.json();
    setData(
      data.map((d: DataDataPencairan) => {
        return { ...d, key: d.id };
      })
    );
    setTotal(total);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [name, page]);

  const columns: TableProps<DataDataPencairan>["columns"] = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
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
        const currPage = (page - 1) * 20;
        return <>{currPage + (index + 1)}</>;
      },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      width: 120,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return (
          <div className="flex justify-center text-xs font-bold italic">
            <div
              className={`py-1 px-3 text-white bg-${
                !record.berkas_si ? "red" : !record.status ? "blue" : "green"
              }-500 text-center w-24`}
            >
              {!record.berkas_si
                ? "ANTRI"
                : !record.status
                ? "PROSES"
                : "SELESAI"}
            </div>
          </div>
        );
      },
    },
    {
      title: "TANGGAL CETAK",
      dataIndex: "tanggal_cetak",
      key: "tanggal_cetak",
      width: 100,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{moment(record.tanggal_cetak).format("DD-MM-YYYY")}</>;
      },
    },
    {
      title: "NOMOR SURAT",
      dataIndex: "nomor_surat",
      key: "nomor_surat",
      width: 200,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      fixed: window.innerWidth < 600 ? false : "left",
    },
    {
      title: "SUMBER DANA",
      dataIndex: "sumber_dana",
      key: "sumber_dana",
      width: 200,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{record.Bank.name}</>;
      },
    },
    {
      title: "SURAT",
      dataIndex: "surat",
      key: "surat",
      children: [
        {
          title: "CETAK SURAT",
          key: "cetak_surat",
          width: 100,
          dataIndex: "cetak_surat",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return (
              <div className="flex justify-center">
                <button
                  className="rounded shadow border py-1 px-2"
                  onClick={() => {
                    setSelected(record);
                    setModalSI(true);
                  }}
                  disabled={record.berkas_si ? true : false}
                  style={{ opacity: record.berkas_si ? 0.5 : 1 }}
                >
                  <PrinterFilled />
                </button>
              </div>
            );
          },
        },
        {
          title: "UPLOAD",
          key: "upload_surat",
          width: 100,
          dataIndex: "upload_surat",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return <UploadBerkasSI data={record} getData={getData} />;
          },
        },
        {
          title: "VIEW",
          key: "view_surat",
          width: 100,
          dataIndex: "view_surat",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return (
              <ModalBerkas
                data={{
                  type: "application/pdf",
                  url: record.berkas_si || "",
                  title: `VIEW SURAT ${record.nomor_surat}`,
                }}
              />
            );
          },
        },
      ],
    },
    {
      title: "NOMINATIF",
      key: "nominatif",
      dataIndex: "nominatif",
      width: 100,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <CetakNominatif data={record} />;
      },
    },
    {
      title: "END USER",
      key: "end_user",
      width: 100,
      dataIndex: "end_user",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{record.DataPengajuan.length}</>;
      },
    },
    {
      title: "PLAFOND",
      key: "plafon",
      width: 150,
      dataIndex: "plafon",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        let plaf = 0;
        record.DataPengajuan.forEach((p) => {
          plaf += p.DataPembiayaan.plafond;
        });
        return <>{formatNumber(plaf.toFixed(0))}</>;
      },
    },
    {
      title: "DROPPING",
      key: "dropping",
      width: 150,
      dataIndex: "dropping",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        let total = 0;
        record.DataPengajuan.forEach((d) => {
          total += d.DataPembiayaan.plafond;
          let plaf =
            d.DataPembiayaan.plafond * (d.DataPembiayaan.by_admin_bank / 100);
          total -= plaf + d.DataPembiayaan.by_buka_rekening;
          total -= d.DataPembiayaan.by_provisi;
        });
        return <>{formatNumberTitik(total.toFixed(0))}</>;
      },
    },
    {
      title: "TANGGAL CAIR",
      dataIndex: "tanggal_cair",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      key: "tanggal_cair",
      width: 100,
      render(value, record, index) {
        return (
          <>
            {record.tanggal_proses
              ? moment(record.tanggal_proses).format("DD-MM-YYYY")
              : "-"}
          </>
        );
      },
    },
  ];
  return (
    <div>
      <div className="flex gap-5 my-1 mx-1">
        <Input.Search
          style={{ width: 170 }}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="p-2">
        <Table
          dataSource={data}
          columns={columns}
          loading={loading}
          scroll={{ x: "max-content", y: "calc(61vh - 100px)" }}
          bordered
          size="small"
          pagination={{
            pageSize: 20,
            total,
            onChange(page, pageSize) {
              setPage(page);
            },
          }}
        />
      </div>
      <Modal
        open={modalSI}
        onCancel={() => setModalSI(false)}
        width={"95vw"}
        style={{ top: 20 }}
        footer={[]}
        title="CETAK BERKAS SI"
      >
        <div style={{ height: "80vh" }}>
          <CetakSI data={selected as DataDataPencairan} />
        </div>
      </Modal>
    </div>
  );
}
