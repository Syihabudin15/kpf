"use client";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import { CloudUploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { DatePicker, Input, Modal, Table, TableProps, message } from "antd";
import moment from "moment";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ModalBerkas = dynamic(() => import("@/components/utils/ModalBerkas"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});
const UploadBerkas = dynamic(
  () => import("@/components/views/operasionals/news/UploadBerkas"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default function PenerimaanBersih() {
  const [nama, setName] = useState<string>();
  const [year, setYear] = useState<string>(moment().format("YYYY-MM"));
  const [page, setPage] = useState(1);
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<DataDataPengajuan>();
  const [openUpload, setOpenUpload] = useState(false);
  const [url, setUrl] = useState<{
    berkas_lainnya: string;
    tanggal_berkas_lainnya: string;
  }>({
    berkas_lainnya: "",
    tanggal_berkas_lainnya: "",
  });

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/ops/penerimaan-bersih?page=${page}${nama ? "&nama=" + nama : ""}${
        year ? "&year=" + year : ""
      }`
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
  }, [nama, page, year]);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/ops/penerimaan-bersih/berkas", {
      method: "PUT",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({
        id: selected?.berkasPengajuanId,
        url: url.berkas_lainnya,
      }),
    });
    if (res.ok) {
      message.success("Upload berkas penerimaan bersih berhasil");
      setOpenUpload(false);
      await getData();
    } else {
      message.error("Gagal upload berkas. Coba lagi nanti!");
    }
    setLoading(false);
  };

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
      title: "NOMOR SI",
      dataIndex: "no_si",
      key: "no_si",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      width: 200,
      className: "text-center",
      render(value, record, index) {
        return <div>{record.DataPencairan.nomor_surat}</div>;
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
      title: "BERKAS PENERIMAAN BERSIH",
      dataIndex: "berkas_terima_bersih",
      key: "berkas_terima_bersih",
      children: [
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
                    setSelected(record);
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
              <ModalBerkas
                data={{
                  url: record.BerkasPengajuan.berkas_lainnya || "",
                  type: "application/pdf",
                  title: `PENERIMAAN BERSIH ${record.DataPembiayaan.name}`,
                }}
              />
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
                {record.BerkasPengajuan.tanggal_berkas_lainnya &&
                  moment(record.BerkasPengajuan.tanggal_berkas_lainnya).format(
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
      <div className="flex gap-5 my-1 mx-1 flex-wrap">
        <DatePicker
          picker="month"
          onChange={(date, dateString) => setYear(dateString as string)}
        />
        <Input.Search
          style={{ width: 170 }}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
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
      </div>
      {selected && (
        <Modal
          footer={[]}
          title={"UPLOAD BERKAS PENERIMAAN BERSIH"}
          onCancel={() => {
            setUrl({ berkas_lainnya: "", tanggal_berkas_lainnya: "" });
            setOpenUpload(false);
          }}
          open={openUpload}
        >
          <div className="mb-5">
            <UploadBerkas
              name="Berkas Terima Bersih"
              pathName="berkas_lainnya"
              dir="berkas_lainnya"
              url="/api/ops/penerimaan-bersih/berkas"
              fileType={"application/pdf"}
              setUrl={setUrl}
              filePath={selected.BerkasPengajuan.berkas_lainnya}
              id={selected.berkasPengajuanId || ""}
              ext="pdf"
            />
          </div>
          <div className="flex justify-end">
            <button
              className="py-2 px-5 bg-blue-500 hover:bg-blue-600 text-white rounded shadow text-xs"
              disabled={loading}
              style={{ opacity: loading ? 0.7 : 1 }}
              onClick={() => handleSubmit()}
            >
              SUBMIT {loading && <LoadingOutlined />}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
