"use client";
import { formatNumber, formatNumberTitik } from "@/components/utils/inputUtils";
import { CloudUploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { Input, Modal, Table, TableProps, Tooltip, message } from "antd";
import { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { DataDataPencairan } from "@/components/utils/Interfaces";
import CetakNominatif from "@/components/utils/CetakNominatif";
import { notifContext } from "@/components/NotifContext";
import moment from "moment";
import { ceiling } from "@/components/utils/pdf/pdfUtil";
import { getAngsuranPerBulan } from "../../simulasi/simulasiUtil";

const ModalBerkas = dynamic(() => import("@/components/utils/ModalBerkas"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});
const CetakCIFTAB = dynamic(() => import("../CetakCiftab"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});
const CetakUPPINJ = dynamic(() => import("../CetakUppinj"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});
const UploadBerkas = dynamic(() => import("./UploadBerkas"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});
const ModalProsesCair = dynamic(() => import("./ModalProsesCair"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});
const ModalUploadBerkas = dynamic(() => import("./ModalUploadBerkas"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

export default function PencairanBank() {
  const [data, setData] = useState<DataDataPencairan[]>();
  const [name, setName] = useState<string>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const notifCtx = useContext(notifContext);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/ops/uploads/bukti/bukti_transfer?page=${page}&pageSize=${pageSize}${
        name ? "&name=" + name : ""
      }`
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

  const handleProses = async (id: string) => {
    setLoading(true);
    const res = await fetch("/api/pencairan/proses", {
      method: "POST",
      body: JSON.stringify({ id: id }),
    });
    if (res.ok) {
      message.success("Proses pencairan berhasil");
      await notifCtx.getNotifFunction();
      await getData();
    } else {
      message.error("Proses pencairan gagal. Coba lagi!");
    }
    setLoading(false);
    await getData();
  };

  const handleUpload = async (id: string, url: string) => {
    setLoading(true);
    const res = await fetch("/api/ops/uploads/bukti_transfer", {
      method: "PUT",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify({
        id: id,
        url: url,
      }),
    });
    if (res.ok) {
      message.success("Bukti Transfer berhasil di upload");
      await notifCtx.getNotifFunction();
      await getData();
    } else {
      message.error("Gagal upload bukti transfer. Coba lagi!");
    }
    setLoading(false);
    await getData();
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [name, page, pageSize]);

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
        const currPage = (page - 1) * pageSize;
        return <>{currPage + (index + 1)}</>;
      },
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
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
        return (
          <div className="flex justify-center text-xs font-bold italic">
            <div
              className={`py-1 px-3 text-white bg-${
                record.status ? "green" : "red"
              }-500 text-center w-24`}
            >
              {record.status ? "SELESAI" : "ANTRI"}
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
      title: "PROSES PENCAIRAN",
      dataIndex: "proses",
      key: "proses",
      width: 100,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        let title: string[] = [];
        record.DataPengajuan.forEach((e) => {
          title.push(e.nama || "");
        });
        return (
          <Tooltip title={title && title.join(", ")} key={record.id}>
            <div className="flex justify-center">
              <ModalProsesCair
                data={record}
                handleProses={handleProses}
                key={record.id}
              />
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: "BUKTI TRANSFER",
      dataIndex: "surat",
      key: "surat",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      children: [
        {
          title: "UPLOAD",
          key: "upload_surat",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          width: 100,
          dataIndex: "upload_surat",
          render(value, record, index) {
            return (
              <div className="flex justify-center" key={index}>
                <ModalUploadBerkas data={record} handleUpload={handleUpload} />
              </div>
            );
          },
        },
        {
          title: "VIEW",
          key: "view_bukti_transfer",
          dataIndex: "view_bukti_transfer",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          width: 100,
          render(value, record, index) {
            return (
              <ModalBerkas
                data={{
                  type: "application/pdf",
                  url: record.bukti_transfer || "",
                  title: `BUKTI TRANSFER ${record.nomor_surat}`,
                }}
              />
            );
          },
        },
      ],
    },
    {
      title: "VIEW SI",
      key: "view_si",
      dataIndex: "view_si",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      width: 100,
      render(value, record, index) {
        return (
          <ModalBerkas
            data={{
              type: "application/pdf",
              url: record.berkas_si || "",
              title: `BERKAS SI ${record.nomor_surat}`,
            }}
          />
        );
      },
    },
    {
      title: "CIFTAB",
      key: "ciftab",
      dataIndex: "ciftab",
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
        return (
          <>
            <CetakCIFTAB data={record.DataPengajuan} />
          </>
        );
      },
    },
    {
      title: "UPPINJ",
      key: "uppinj",
      dataIndex: "uppinj",
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
        return (
          <>
            <CetakUPPINJ data={record.DataPengajuan} />
          </>
        );
      },
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
      className: "text-center",
      render(value, record, index) {
        return <CetakNominatif data={record} />;
      },
    },
    {
      title: "END USER",
      key: "end_user",
      dataIndex: "end_user",
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
        return <>{record.DataPengajuan.length}</>;
      },
    },
    {
      title: "PLAFOND",
      key: "plafon",
      dataIndex: "plafon",
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
      dataIndex: "dropping",
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
        let totalplaf = 0;
        let totalBiaya = 0;
        record.DataPengajuan.forEach((d) => {
          totalplaf += d.DataPembiayaan.plafond;

          let admin =
            d.DataPembiayaan.plafond * (d.DataPembiayaan.by_admin_bank / 100);
          totalBiaya +=
            d.DataPembiayaan.by_buka_rekening +
            d.DataPembiayaan.by_provisi +
            admin;
          if (d.Bank.kode === "BPR BNM" || d.Bank.kode === "BPR SIP") {
            const angsuran = ceiling(
              parseInt(
                getAngsuranPerBulan(
                  d.DataPembiayaan.mg_bunga,
                  d.DataPembiayaan.tenor,
                  d.DataPembiayaan.plafond,
                  false,
                  false,
                  d.Bank.kode
                )
              ),
              d.DataPembiayaan.pembulatan
            );
            totalBiaya += angsuran * d.DataPembiayaan.blokir;
          }
        });
        return <>{formatNumberTitik((totalplaf - totalBiaya).toFixed(0))}</>;
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
      width: 100,
      className: "text-center",
      key: "tanggal_cair",
      render(value, record, index) {
        return (
          <>
            {record.tanggal_proses &&
              moment(record.tanggal_proses).format("DD-MM-YYYY")}
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
          scroll={{ x: "max-content", y: "calc(62vh - 100px)" }}
          bordered
          size="small"
          pagination={{
            pageSize: pageSize,
            pageSizeOptions: [20, 50, 100, 200, 500, 1000, 1000],
            total,
            onChange(page, pageSize) {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </div>
    </div>
  );
}
