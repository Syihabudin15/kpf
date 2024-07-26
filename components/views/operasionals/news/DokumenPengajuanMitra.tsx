"use client";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import {
  CloudUploadOutlined,
  FileFilled,
  LoadingOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { Input, Modal, Table, TableProps } from "antd";
import moment from "moment";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ModalBerkas = dynamic(() => import("@/components/utils/ModalBerkas"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});
const UploadBerkasOps = dynamic(
  () => import("@/components/views/operasionals/news/UploadBerkasOps"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
const ViewBerkasPengajuan = dynamic(
  () => import("@/components/utils/ViewBerkasPengajuan"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
const RiplaySIP = dynamic(() => import("@/components/utils/pdf/RiplaySIP"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

export default function DokumenPengajuanMitra() {
  const [name, setName] = useState<string>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DataDataPengajuan>();
  const [openUpload, setOpenUpload] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState<DataDataPengajuan>();
  const [openRiplay, setOpenRiplay] = useState(false);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/ops/pengajuan-mitra?page=${page}${name ? "&name=" + name : ""}`
    );
    const { data, total } = await res.json();
    setData(
      data.map((d: any, ind: number) => {
        return { ...d, key: ind };
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

  const columns: TableProps<DataDataPengajuan>["columns"] = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      width: 50,
      className: "text-center",
      render(value, record, index) {
        const currPage = (page - 1) * 20;
        return <>{currPage + (index + 1)}</>;
      },
    },
    {
      title: "NO PENSIUN",
      dataIndex: "no",
      key: "nopen",
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
      title: "NO SK PENSIUN",
      dataIndex: "no_skep",
      key: "no_skep",
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
        return <>{record.nomor_sk_pensiun}</>;
      },
    },
    {
      title: "NAMA PEMOHON",
      dataIndex: "nama",
      key: "nama",
      width: 200,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      fixed: window.innerWidth < 600 ? false : "left",
      render(value, record, index) {
        return <>{record.DataPembiayaan.name}</>;
      },
    },
    {
      title: "AREA PELAYANAN",
      dataIndex: "up",
      key: "up",
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
        return <>{record.User.UnitCabang.UnitPelayanan.name}</>;
      },
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
      title: "PLAFOND",
      dataIndex: "plafon",
      key: "plafon",
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
      title: "PRODUK PEMBIAYAAN",
      dataIndex: "produk_pembiayaan",
      key: "produk_pembiayaan",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{record.DataPembiayaan.Produk.name}</>;
      },
    },
    {
      title: "JENIS PEMBIAYAAN",
      dataIndex: "jenis_pembiayaan",
      key: "jenis_pembiayaan",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return (
          <>
            {record.DataPembiayaan.jenis_pembiayaan_id
              ? record.DataPembiayaan.JenisPembiayaan.name
              : "Sisa Gaji"}
          </>
        );
      },
    },
    {
      title: "UPLOAD BERKAS",
      dataIndex: "upload_berkas",
      key: "upload_berkas",
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
          <div className="flex justify-center">
            <button
              className="py-1 px-2 border rounded shadow bg-green-500 hover:bg-green-600 text-white"
              onClick={() => {
                setSelectedUpload(record);
                setOpenUpload(true);
              }}
            >
              <CloudUploadOutlined />
            </button>
          </div>
        );
      },
    },
    {
      title: "BERKAS PENGAJUAN",
      dataIndex: "berkas_pengajuan",
      key: "berkas_pengajuan",
      children: [
        {
          title: "VIEW",
          key: "view",
          dataIndex: "view",
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
              <div className="flex justify-center">
                <button
                  className="py-1 px-2 rounded shadow"
                  onClick={() => {
                    setSelected(record);
                    setOpen(true);
                  }}
                >
                  <FileFilled />
                </button>
              </div>
            );
          },
        },
        {
          title: "TANGGAL",
          key: "tanggal",
          width: 100,
          dataIndex: "tanggal",
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
                {moment(record.DataPembiayaan.tanggal_input).format(
                  "DD-MM-YYYY"
                )}
              </>
            );
          },
        },
      ],
    },
    {
      title: "BERKAS AKAD",
      dataIndex: "berkas_akad",
      key: "berkas_akad",
      children: [
        {
          title: "VIEW",
          key: "view",
          dataIndex: "view",
          width: 100,
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
                  url: record.BerkasPengajuan.berkas_akad || "",
                  type: "application/pdf",
                  title: `BERKAS AKAD ${record.DataPembiayaan.name}`,
                }}
              />
            );
          },
        },
        {
          title: "TANGGAL",
          key: "tanggal",
          dataIndex: "tanggal",
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
                {record.BerkasPengajuan.tanggal_akad &&
                  moment(record.BerkasPengajuan.tanggal_akad).format(
                    "DD-MM-YYYY"
                  )}
              </>
            );
          },
        },
      ],
    },
    {
      title: "RIPLAY",
      key: "riplay",
      dataIndex: "riplay",
      width: 100,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return (
          <div
            className={`flex justify-center ${
              record.Bank.kode !== "BPR SIP" ? "hidden" : ""
            }`}
          >
            <button
              className="py-1 px-2 rounded shadow border"
              onClick={() => {
                setSelected(record);
                setOpenRiplay(true);
              }}
            >
              <PrinterOutlined />
            </button>
          </div>
        );
      },
    },
    {
      title: "BERKAS PELUNASAN",
      dataIndex: "berkas_pelunasan",
      key: "berkas_pelunasan",
      children: [
        {
          title: "VIEW",
          key: "view",
          dataIndex: "view",
          width: 100,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return (
              <>
                <ModalBerkas
                  data={{
                    url: record.BerkasPengajuan.pelunasan || "",
                    type: "application/pdf",
                    title: `BERKAS PELUNASAN ${record.DataPembiayaan.name}`,
                  }}
                />
              </>
            );
          },
        },
        {
          title: "TANGGAL",
          key: "tanggal",
          dataIndex: "tanggal",
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
                {record.BerkasPengajuan.tanggal_pelunasan &&
                  moment(record.BerkasPengajuan.tanggal_pelunasan).format(
                    "DD-MM-YYYY"
                  )}
              </>
            );
          },
        },
      ],
    },
    {
      title: "BERKAS JAMINAN",
      dataIndex: "berkas_jaminan",
      key: "berkas_jaminan",
      children: [
        {
          title: "VIEW",
          key: "view",
          dataIndex: "view",
          width: 100,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return (
              <>
                <ModalBerkas
                  data={{
                    url: record.BerkasPengajuan.jaminan || "",
                    type: "application/pdf",
                    title: `BERKAS JAMINAN ${record.DataPembiayaan.name}`,
                  }}
                />
              </>
            );
          },
        },
        {
          title: "TANGGAL",
          key: "tanggal",
          dataIndex: "tanggal",
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
                {record.BerkasPengajuan.tanggal_jaminan &&
                  moment(record.BerkasPengajuan.tanggal_jaminan).format(
                    "DD-MM-YYYY"
                  )}
              </>
            );
          },
        },
      ],
    },
    {
      title: "BUKU REKENING",
      dataIndex: "berkas_rekening",
      key: "berkas_rekening",
      children: [
        {
          title: "VIEW",
          key: "view",
          dataIndex: "view",
          width: 100,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return (
              <>
                <ModalBerkas
                  data={{
                    url: record.BerkasPengajuan.rekening || "",
                    type: "application/pdf",
                    title: `BUKU REKENING ${record.DataPembiayaan.name}`,
                  }}
                />
              </>
            );
          },
        },
        {
          title: "NO REKENING",
          key: "no_Rek",
          dataIndex: "no_rek",
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
            return <>{record.BerkasPengajuan.no_rekening}</>;
          },
        },
        {
          title: "NAMA BANK",
          key: "nama_bank",
          dataIndex: "nama_bank",
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
            return <>{record.BerkasPengajuan.nama_bank}</>;
          },
        },
        {
          title: "TANGGAL",
          key: "tanggal",
          width: 100,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          className: "text-center",
          dataIndex: "tanggal",
          render(value, record, index) {
            return (
              <>
                {record.BerkasPengajuan.tanggal_rekening &&
                  moment(record.BerkasPengajuan.tanggal_rekening).format(
                    "DD-MM-YYYY"
                  )}
              </>
            );
          },
        },
      ],
    },
    {
      title: "BERKAS MUTASI",
      dataIndex: "berkas_mutasi",
      key: "berkas_mutasi",
      children: [
        {
          title: "VIEW",
          key: "view",
          dataIndex: "view",
          width: 100,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return (
              <>
                <ModalBerkas
                  data={{
                    url: record.BerkasPengajuan.mutasi || "",
                    type: "application/pdf",
                    title: `BERKAS MUTASI ${record.DataPembiayaan.name}`,
                  }}
                />
              </>
            );
          },
        },
        {
          title: "TANGGAL",
          key: "tanggal",
          dataIndex: "tanggal",
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
                {record.BerkasPengajuan.tanggal_mutasi &&
                  moment(record.BerkasPengajuan.tanggal_mutasi).format(
                    "DD-MM-YYYY"
                  )}
              </>
            );
          },
        },
      ],
    },
    {
      title: "BERKAS FLAGGING",
      dataIndex: "berkas_flagging",
      key: "berkas_flagging",
      children: [
        {
          title: "VIEW",
          key: "view",
          dataIndex: "view",
          width: 100,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return (
              <>
                <ModalBerkas
                  data={{
                    url: record.BerkasPengajuan.flagging || "",
                    type: "application/pdf",
                    title: `BERKAS FLAGGING ${record.DataPembiayaan.name}`,
                  }}
                />
              </>
            );
          },
        },
        {
          title: "TANGGAL",
          key: "tanggal",
          dataIndex: "tanggal",
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
                {record.BerkasPengajuan.tanggal_flagging &&
                  moment(record.BerkasPengajuan.tanggal_flagging).format(
                    "DD-MM-YYYY"
                  )}
              </>
            );
          },
        },
      ],
    },
    {
      title: "BUKTI CAIR",
      dataIndex: "bukti_cair",
      key: "bukti_cair",
      children: [
        {
          title: "VIEW",
          key: "view",
          width: 100,
          dataIndex: "view",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return (
              <>
                <ModalBerkas
                  data={{
                    url: record.BerkasPengajuan.bukti_cair || "",
                    type: "application/pdf",
                    title: `BUKTI CAIR ${record.DataPembiayaan.name}`,
                  }}
                />
              </>
            );
          },
        },
        {
          title: "TANGGAL",
          key: "tanggal",
          dataIndex: "tanggal",
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
                {record.BerkasPengajuan.tanggal_bukti_cair &&
                  moment(record.BerkasPengajuan.tanggal_bukti_cair).format(
                    "DD-MM-YYYY"
                  )}
              </>
            );
          },
        },
      ],
    },
    {
      title: "VIDEO CAIR",
      dataIndex: "video_cair",
      key: "video_cair",
      children: [
        {
          title: "View",
          key: "view",
          dataIndex: "view",
          width: 100,
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return (
              <>
                <ModalBerkas
                  data={{
                    url: record.BerkasPengajuan.video_cair || "",
                    type: "video/mp4",
                    title: `VIDEO CAIR ${record.DataPembiayaan.name}`,
                  }}
                />
              </>
            );
          },
        },
        {
          title: "TANGGAL",
          key: "tanggal",
          dataIndex: "tanggal",
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
                {record.BerkasPengajuan.tanggal_video_cair &&
                  moment(record.BerkasPengajuan.tanggal_video_cair).format(
                    "DD-MM-YYYY"
                  )}
              </>
            );
          },
        },
      ],
    },
    {
      title: "VIDEO CAIR 2",
      dataIndex: "video_cair2",
      key: "video_cair2",
      children: [
        {
          title: "VIEW",
          key: "view",
          width: 100,
          dataIndex: "view",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return (
              <>
                <ModalBerkas
                  data={{
                    url: record.BerkasPengajuan.video_cair2 || "",
                    type: "video/mp4",
                    title: `VIDEO CAIR 2 ${record.DataPembiayaan.name}`,
                  }}
                />
              </>
            );
          },
        },
        {
          title: "TANGGAL",
          key: "tanggal",
          dataIndex: "tanggal",
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
                {record.BerkasPengajuan.tanggal_video_cair2 &&
                  moment(record.BerkasPengajuan.tanggal_video_cair2).format(
                    "DD-MM-YYYY"
                  )}
              </>
            );
          },
        },
      ],
    },
    {
      title: "VIDEO CAIR 3",
      dataIndex: "video_cair3",
      key: "video_cair2",
      children: [
        {
          title: "VIEW",
          key: "view",
          width: 100,
          dataIndex: "view",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return (
              <>
                <ModalBerkas
                  data={{
                    url: record.BerkasPengajuan.video_cair3 || "",
                    type: "video/mp4",
                    title: `VIDEO CAIR 3 ${record.DataPembiayaan.name}`,
                  }}
                />
              </>
            );
          },
        },
        {
          title: "TANGGAL",
          key: "tanggal",
          dataIndex: "tanggal",
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
                {record.BerkasPengajuan.tanggal_video_cair3 &&
                  moment(record.BerkasPengajuan.tanggal_video_cair3).format(
                    "DD-MM-YYYY"
                  )}
              </>
            );
          },
        },
      ],
    },
    {
      title: "EPOTPEN",
      dataIndex: "epotpen",
      key: "epotpen",
      children: [
        {
          title: "VIEW",
          key: "view",
          width: 100,
          dataIndex: "view",
          onHeaderCell: (text, record) => {
            return {
              ["style"]: {
                textAlign: "center",
              },
            };
          },
          render(value, record, index) {
            return (
              <>
                <ModalBerkas
                  data={{
                    url: record.BerkasPengajuan.epotpen || "",
                    type: "application/pdf",
                    title: `BERKAS EPOTPEN ${record.DataPembiayaan.name}`,
                  }}
                />
              </>
            );
          },
        },
        {
          title: "TANGGAL",
          key: "tanggal",
          width: 100,
          dataIndex: "tanggal",
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
                {record.BerkasPengajuan.tanggal_epotpen &&
                  moment(record.BerkasPengajuan.tanggal_epotpen).format(
                    "DD-MM-YYYY"
                  )}
              </>
            );
          },
        },
      ],
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
      <Table
        columns={columns}
        bordered
        size="small"
        scroll={{ x: "max-content", y: "calc(62vh - 100px)" }}
        dataSource={data}
        loading={loading}
        pagination={{
          pageSize: 20,
          total: total,
          onChange(page, pageSize) {
            setPage(page);
          },
        }}
      />
      {selected && (
        <ViewBerkasPengajuan
          data={selected}
          role="OPERASIONAL"
          allowForm={false}
          open={open}
          setOpen={setOpen}
        />
      )}
      {selectedUpload && (
        <UploadBerkasOps
          data={selectedUpload}
          getData={getData}
          open={openUpload}
          setOpen={setOpenUpload}
          setSelected={setSelectedUpload}
        />
      )}
      {selected && (
        <Modal
          open={openRiplay}
          onCancel={() => setOpenRiplay(!openRiplay)}
          width={"95vw"}
          style={{ top: 20 }}
          footer={[]}
          title={`RIPLAY ${selected.nama}`}
        >
          <div style={{ height: "80vh" }}>
            <RiplaySIP data={selected} />
          </div>
        </Modal>
      )}
    </div>
  );
}
