"use client";
import {
  BankOpt,
  Cabang,
  DataDataPengajuan,
  DataDataTaspen,
  IUser,
  Options,
  UP,
} from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import { FileFilled, LoadingOutlined } from "@ant-design/icons";
import { DatePicker, Input, Table, TableProps } from "antd";
import moment from "moment";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Refferal, User } from "@prisma/client";

const InputForm = dynamic(() => import("@/components/views/slik/InputForm"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

const ViewBerkasPengajuan = dynamic(
  () => import("@/components/utils/ViewBerkasPengajuan"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default function InputSlik() {
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [page, setPage] = useState(1);
  const [name, setName] = useState<string>();
  const [year, setYear] = useState<string>();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [up, setUp] = useState<BankOpt[]>();
  const [cabang, setCabang] = useState<Cabang[]>();
  const [marketing, setMarketing] = useState<IUser[]>();
  const [refferal, setRefferal] = useState<Options[]>();
  const [dataTaspen, setDataTaspen] = useState<DataDataTaspen[]>();
  const [provinsi, setProvinsi] = useState<Options[]>();
  const [selected, setSelected] = useState<DataDataPengajuan>();
  const [open, setOpen] = useState(false);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/slik?page=${page}${name ? "&name=" + name : ""}${
        year ? "&year=" + year : ""
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
  }, [year, name, page]);

  useEffect(() => {
    (async () => {
      const resTaspen = await fetch("/api/data-taspen");
      const { data } = await resTaspen.json();
      setDataTaspen(data);

      const resProvinsi = await fetch(
        "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
      );
      const dataProvinsi = await resProvinsi.json();
      setProvinsi(
        dataProvinsi.map((data: any, ind: number) => {
          return {
            label: data.name,
            value: data.id,
          };
        })
      );

      const resUp = await fetch("/api/master/unit/pelayanan");
      const { result } = await resUp.json();
      const marketing: IUser[] = [];
      const cabangFull: Cabang[] = [];
      const up: UP[] = result;
      const upOpt: BankOpt[] = up.map((up) => {
        const cabang: Options[] = up.UnitCabang.map((c) => {
          cabangFull.push({ ...c, unit: up.kode_area });
          c.User.forEach((u) => {
            if (u.role === "MARKETING") {
              marketing.push(u);
            }
          });
          return { label: c.name, value: c.name };
        });
        return { label: up.name, value: up.name, options: cabang };
      });
      setMarketing(marketing);
      setCabang(cabangFull);
      setUp(upOpt);

      const refRes = await fetch("/api/master/refferal");
      const ref: Refferal[] = await refRes.json();
      const refResult: Options[] = ref.map((r) => {
        return { label: r.name, value: r.id };
      });
      setRefferal(refResult);
    })();
  }, []);

  const columns: TableProps<DataDataPengajuan>["columns"] = [
    {
      title: "NO",
      dataIndex: "id",
      key: "no",
      className: "text-center",
      width: 50,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{index + 1}</>;
      },
    },
    {
      title: "TANGGAL PENGAJUAN",
      dataIndex: "created_at",
      key: "created_at",
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
          <>{moment(record.DataPembiayaan.created_at).format("DD-MM-YYYY")}</>
        );
      },
    },
    {
      title: "NO PENSIUN",
      dataIndex: "nopen",
      key: "nopen",
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
      dataIndex: "nama_pemohon",
      key: "nama_pemohon",
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
      title: "PRODUK PEMBIAYAAN",
      dataIndex: "data_pembiayaan_id",
      key: "data_pembiayaan_id",
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
      dataIndex: "data_pembiayaan_id",
      key: "data_pembiayaan_id",
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
      title: "TENOR",
      dataIndex: "data_pembiayaan_id",
      key: "data_pembiayaan_id",
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
          <>{record.DataPembiayaan && record.DataPembiayaan.tenor} Bulan</>
        );
      },
    },
    {
      title: "PLAFOND",
      dataIndex: "plafon",
      key: "plafon",
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
      title: "STATUS SLIK",
      dataIndex: `status_verifikasi`,
      key: "status_verifikasi",
      width: 120,
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
          <div className="flex justify-center text-xs font-bold italic">
            {record.status_slik && (
              <div
                className={`py-1 px-2 w-24 bg-${
                  record.status_slik === "SETUJU"
                    ? "green"
                    : record.status_slik === "DITOLAK"
                    ? "red"
                    : record.status_slik === "ANTRI"
                    ? "orange"
                    : "blue"
                }-500 text-gray-100 text-center`}
              >
                {record.status_slik}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "AREA PELAYANAN",
      dataIndex: "up",
      key: "up",
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
      title: "UNIT PELAYANAN",
      dataIndex: "cabang",
      key: "cabang",
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
          <>{record.area_pelayanan_berkas || record.User.UnitCabang.name}</>
        );
      },
    },
    {
      title: "SUMBER DANA",
      dataIndex: "sumber_dana",
      key: "sumber_dana",
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
      title: "VIEW BERKAS",
      dataIndex: "id",
      key: "view_berkas",
      width: 80,
      fixed: "right",
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
              className="py-1 px-2 border rounded shadow"
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
  ];

  return (
    <section className="px-2">
      <div className="flex gap-5 my-1 mx-1 flex-wrap">
        <InputForm
          getData={getData}
          fullCabang={cabang || []}
          fullUser={marketing || []}
          upOpt={up || []}
          refferalOpt={refferal || []}
          taspens={dataTaspen || []}
          provinsi={provinsi || []}
        />
        <DatePicker
          picker="year"
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
          dataSource={data}
          bordered
          scroll={{ x: 2500, y: "calc(65vh - 100px)" }}
          size="small"
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
            role="ENTRY_DATA"
            allowForm={true}
            open={open}
            setOpen={setOpen}
            data={selected as DataDataPengajuan}
          />
        )}
      </div>
    </section>
  );
}
