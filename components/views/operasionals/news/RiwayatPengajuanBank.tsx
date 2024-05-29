"use client";
import { FileFilled, LoadingOutlined } from "@ant-design/icons";
import { Role } from "@prisma/client";
import { Input, Modal, Table, TableProps } from "antd";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { formatNumber } from "@/components/utils/inputUtils";
import moment from "moment";
import { DataDataPengajuan } from "@/components/utils/Interfaces";

const ViewBerkasPengajuan = dynamic(
  () => import("@/components/utils/ViewBerkasPengajuan"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

const ModalBerkas = dynamic(() => import("@/components/utils/ModalBerkas"), {
  ssr: false,
  loading: () => <LoadingOutlined />,
});

export default function RiwayatPengajuanBank({ role }: { role: Role }) {
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState(0);
  const [name, setName] = useState<string>();

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/ops/riwayat-pengajuan-bank?page=${page}${
        name ? "&name=" + name : ""
      }`
    );
    const { data, total } = await res.json();
    setData(
      data.map((d: DataDataPengajuan) => {
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
      className: "text-center",
      render(value, record, index) {
        return <>{index + 1}</>;
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
      dataIndex: "nama",
      key: "nama",
      fixed: "left",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{record.DataPembiayaan.name}</>;
      },
    },
    {
      title: "PLAFOND",
      dataIndex: "plafond",
      key: "plafond",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      sorter: (a, b) => a.DataPembiayaan.plafond - b.DataPembiayaan.plafond,
      render(value, record, index) {
        return (
          <>
            Rp.{" "}
            {record.DataPembiayaan &&
              formatNumber(record.DataPembiayaan.plafond.toString())}
          </>
        );
      },
    },
    {
      title: "PRODUK PEMBIAYAAN",
      dataIndex: "produk",
      key: "produk",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{record.DataPembiayaan.Produk.name}</>;
      },
    },
    {
      title: "JENIS PEMBIAYAAN",
      dataIndex: "jenis",
      key: "jenis",
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
            {record.DataPembiayaan.jenis_pembiayaan_id &&
              record.DataPembiayaan.JenisPembiayaan.name}
          </>
        );
      },
    },
    {
      title: "ADMIN BANK",
      dataIndex: "by_admin_bank",
      key: "by_admin_bank",
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
                (record.DataPembiayaan.by_admin_bank / 100)
              ).toFixed(0)
            )}
          </>
        );
      },
    },
    {
      title: "BUKA REKENING",
      dataIndex: "by_rekening",
      key: "by_rekening",
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
      title: "CASH COLL TBO JAMINAN",
      dataIndex: "cash_coll",
      key: "cash_coll",
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
      title: "DROPPING MITRA BANK",
      dataIndex: "dropping_mitra",
      key: "dropping_mitra",
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
      title: "DROPPING NASABAH",
      dataIndex: "dropping_nasabah",
      key: "dropping_nasabah",
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
      title: "BERKAS PENGAJUAN",
      dataIndex: "berkas_pengajuan",
      key: "berkas_pengajuan",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
          className: "example-class-in-td",
        };
      },
      render(value, record, index) {
        return (
          <ViewBerkasPengajuan
            role="OPERASIONAL"
            data={record}
            allowForm={false}
          />
        );
      },
    },
    {
      title: "TANGGAL KOMITE",
      dataIndex: "tangga_komite",
      key: "tangga_komite",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{moment(record.tanggal_approval).format("DD-MM-YYYY")}</>;
      },
    },
    {
      title: "BERKAS AKAD",
      dataIndex: "berkas_akad",
      key: "berkas_akad",
      children: [
        {
          title: "VIEW",
          dataIndex: "view",
          key: "view",
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
              <ModalBerkas
                data={{
                  title: `BERKAS AKAD ${record.DataPembiayaan.name}`,
                  type: "application/pdf",
                  url: record.BerkasPengajuan.berkas_akad || "",
                }}
              />
            );
          },
        },
        {
          title: "TANGGAL",
          dataIndex: "tanggal_berkas",
          key: "tanggal_berkas",
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
                {record.BerkasPengajuan.tanggal_akad
                  ? moment(record.BerkasPengajuan.tanggal_akad).format(
                      "DD-MM-YYYY"
                    )
                  : "-"}
              </>
            );
          },
        },
      ],
    },
    {
      title: "BERKAS PELUNASAN",
      dataIndex: "berkas_pelunasan",
      key: "berkas_pelunasan",
      children: [
        {
          title: "VIEW",
          dataIndex: "view",
          key: "view",
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
                  title: `Berkas Pelunasan ${record.DataPembiayaan.name}`,
                  type: "application/pdf",
                  url: record.BerkasPengajuan.pelunasan || "",
                }}
              />
            );
          },
        },
        {
          title: "TANGGAL",
          dataIndex: "tanggal_berkas",
          key: "tanggal_berkas",
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
                {record.BerkasPengajuan.tanggal_pelunasan
                  ? moment(record.BerkasPengajuan.tanggal_pelunasan).format(
                      "DD-MM-YYYY"
                    )
                  : "-"}
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
          dataIndex: "view",
          key: "view",
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
                  title: `BERKAS JAMINAN ${record.DataPembiayaan.name}`,
                  type: "application/pdf",
                  url: record.BerkasPengajuan.jaminan || "",
                }}
              />
            );
          },
        },
        {
          title: "TANGGAL",
          dataIndex: "tanggal_berkas",
          key: "tanggal_berkas",
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
                {record.BerkasPengajuan.tanggal_jaminan
                  ? moment(record.BerkasPengajuan.tanggal_jaminan).format(
                      "DD-MM-YYYY"
                    )
                  : "-"}
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
          dataIndex: "view",
          key: "view",
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
                  title: `BUKU REKENING ${record.DataPembiayaan.name}`,
                  type: "application/pdf",
                  url: record.BerkasPengajuan.rekening || "",
                }}
              />
            );
          },
        },
        {
          title: "TANGGAL",
          dataIndex: "tanggal_berkas",
          key: "tanggal_berkas",
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
                {record.BerkasPengajuan.tanggal_rekening
                  ? moment(record.BerkasPengajuan.tanggal_rekening).format(
                      "DD-MM-YYYY"
                    )
                  : "-"}
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
          dataIndex: "view",
          key: "view",
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
                  title: `BERKAS MUTASI ${record.DataPembiayaan.name}`,
                  type: "application/pdf",
                  url: record.BerkasPengajuan.mutasi || "",
                }}
              />
            );
          },
        },
        {
          title: "TANGGAL",
          dataIndex: "tanggal_berkas",
          key: "tanggal_berkas",
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
                {record.BerkasPengajuan.tanggal_mutasi
                  ? moment(record.BerkasPengajuan.tanggal_mutasi).format(
                      "DD-MM-YYYY"
                    )
                  : "-"}
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
          dataIndex: "view",
          key: "view",
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
                  title: `BERKAS FLAGGING ${record.DataPembiayaan.name}`,
                  type: "application/pdf",
                  url: record.BerkasPengajuan.flagging || "",
                }}
              />
            );
          },
        },
        {
          title: "TANGGAL",
          dataIndex: "tanggal_berkas",
          key: "tanggal_berkas",
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
                {record.BerkasPengajuan.tanggal_flagging
                  ? moment(record.BerkasPengajuan.tanggal_flagging).format(
                      "DD-MM-YYYY"
                    )
                  : "-"}
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
          title: "VIEW",
          dataIndex: "view",
          key: "view",
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
                  title: `VIDEO CAIR ${record.DataPembiayaan.name}`,
                  type: "video/mp4",
                  url: record.BerkasPengajuan.video_cair || "",
                }}
              />
            );
          },
        },
        {
          title: "TANGGAL",
          dataIndex: "tanggal_berkas",
          key: "tanggal_berkas",
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
                {record.BerkasPengajuan.tanggal_video_cair
                  ? moment(record.BerkasPengajuan.tanggal_video_cair).format(
                      "DD-MM-YYYY"
                    )
                  : "-"}
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
    // {
    //   title: "Video Tambahan",
    //   dataIndex: "berkas_tambahan",
    //   key: "berkas_tambahan",
    //   children: [
    //     {
    //       title: "View",
    //       key: "view",
    //       dataIndex: "view",
    //       render(value, record, index) {
    //         return (
    //           <>
    //             <ModalBerkas
    //               data={{
    //                 url: record.BerkasPengajuan.berkas_lainnya || "",
    //                 type: "video/mp4",
    //                 title: `Berkas Tambahan ${record.DataPembiayaan.name}`,
    //               }}
    //             />
    //           </>
    //         );
    //       },
    //     },
    //     {
    //       title: "Tanggal",
    //       key: "tanggal",
    //       dataIndex: "tanggal",
    //       render(value, record, index) {
    //         return (
    //           <>
    //             {record.BerkasPengajuan.tanggal_berkas_lainnya &&
    //               moment(record.BerkasPengajuan.tanggal_berkas_lainnya).format(
    //                 "DD-MM-YYYY"
    //               )}
    //           </>
    //         );
    //       },
    //     },
    //   ],
    // },
    {
      title: "EPOTPEN",
      dataIndex: "epotpen",
      key: "epotpen",
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
    <section className="px-2">
      <div className="flex gap-5 my-1 mx-1">
        <Input.Search
          style={{ width: 170 }}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        dataSource={data}
        size="small"
        bordered
        scroll={{ x: 3500, y:320 }}
        loading={loading}
        pagination={{
          pageSize: 20,
          total,
          onChange(page, pageSize) {
            setPage(page);
          },
        }}
      />
    </section>
  );
}
