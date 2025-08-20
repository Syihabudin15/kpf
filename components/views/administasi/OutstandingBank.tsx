"use client";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { formatNumber } from "@/components/utils/inputUtils";
import { ceiling } from "@/components/utils/pdf/pdfUtil";
import { DatePicker, Input, Select, Table, TableProps, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { getAngsuranPerBulan } from "../simulasi/simulasiUtil";
import { Bank, Role } from "@prisma/client";
const { RangePicker } = DatePicker;

const checkStatusFlat = (data: DataDataPengajuan) => {
  const dateCair = parseInt(moment(data.tanggal_pencairan).format("YYYYMM"));
  const dateNow = parseInt(moment("2025/05/01").format("YYYYMM"));
  if (data.jenis_margin === "FLAT" && dateCair >= dateNow) return true;
  return false;
};

export default function OutstandingAktif({
  role,
  banks,
}: {
  role: Role;
  banks: Bank[];
}) {
  const [data, setData] = useState<DataDataPengajuan[]>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [nama, setNama] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState<string>();
  const [to, setTo] = useState<string>();
  const [selectedBank, setSelectedBank] = useState<string>();

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/administrasi/outstanding-aktif?page=${page}${
        pageSize ? "&pageSize=" + pageSize : ""
      }${nama ? "&name=" + nama : ""}${from ? "&from=" + from : ""}${
        to ? "&to=" + to : ""
      }`
    );
    const { data, total } = await res.json();
    setTotal(total);
    setData(data);
    if (selectedBank) {
      const newData = data.filter(
        (d: DataDataPengajuan) => d.bankId === selectedBank
      );
      setData(newData);
      setTotal(newData.length);
    }
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [nama, page, pageSize, to, from, selectedBank]);

  const columns: TableProps<DataDataPengajuan>["columns"] = [
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
        return <>{index + 1}</>;
      },
    },
    {
      title: "NOPEN",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      dataIndex: "nopen",
      key: "nopen",
      render(value, record, index) {
        return <>{record.DataPembiayaan.nopen}</>;
      },
    },
    {
      title: "NAMA PEMOHON",
      width: 200,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      dataIndex: "nama_pemohon",
      fixed: window.innerWidth < 600 ? false : "left",
      key: "nama_pemohon",
      render(value, record, index) {
        return <>{record.DataPembiayaan.name}</>;
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
      className: "text-center",
      render(value, record, index) {
        return <>{record.Bank.name}</>;
      },
    },

    {
      title: "TANGGAL AKAD",
      dataIndex: "tanggal_akad",
      key: "tanggal_akad",
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
          record.tanggal_cetak_akad && (
            <>{moment(record.tanggal_cetak_akad).format("DD-MM-YYYY")}</>
          )
        );
      },
    },
    {
      title: "TANGGAL CAIR",
      dataIndex: "tanggal_cair",
      key: "tanggal_cair",
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
          record.tanggal_pencairan && (
            <>{moment(record.tanggal_pencairan).format("DD-MM-YYYY")}</>
          )
        );
      },
    },
    {
      title: "TANGGAL LUNAS",
      dataIndex: "tanggal_lunas",
      width: 150,
      key: "tanggal_lunas",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        const lunas = moment(record.tanggal_cetak_akad)
          .add(record.DataPembiayaan.tenor, "M")
          .format("DD-MM-YYYY");
        return <>{lunas}</>;
      },
    },
    {
      title: "PRODUK PEMBIAYAAN",
      dataIndex: "produk",
      width: 150,
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      key: "produk",
      render(value, record, index) {
        return <>{record.DataPembiayaan.Produk.name}</>;
      },
    },
    {
      title: "JENIS PEMBIAYAAN",
      dataIndex: "jenis",
      width: 150,
      key: "jenis",
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
      dataIndex: "tenor",
      width: 150,
      key: "tenor",
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
      title: "ANGSURAN",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      dataIndex: "angsuran",
      key: "angsuran",
      width: 150,
      render(value, record, index) {
        const result = ceiling(
          parseInt(
            getAngsuranPerBulan(
              record.DataPembiayaan.mg_bunga,
              record.DataPembiayaan.tenor,
              record.DataPembiayaan.plafond,
              false,
              checkStatusFlat(record),
              record.Bank.kode,
              record.DataPembiayaan.pembulatanKhusus
            )
          ),
          record.DataPembiayaan.pembulatan
        );

        return <>{formatNumber(result.toFixed(0))}</>;
      },
    },
    {
      title: "POKOK",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      dataIndex: "pokok",
      key: "pokok",
      width: 150,
      render(value, record, index) {
        const angsuran = record.JadwalAngsuran.filter(
          (e) =>
            moment(e.tanggal_bayar).format("MM/YY") ===
            moment().add(1, "month").format("MM/YY")
        );

        return (
          <>
            {formatNumber(
              (angsuran.length > 0 ? angsuran[0].pokok : 0).toFixed(0)
            )}
          </>
        );
      },
    },
    {
      title: "MARGIN",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      dataIndex: "margin",
      key: "margin",
      width: 150,
      render(value, record, index) {
        const angsuran = record.JadwalAngsuran.filter(
          (e) =>
            moment(e.tanggal_bayar).format("MM/YY") ===
            moment().add(1, "month").format("MM/YY")
        );

        return (
          <>
            {formatNumber(
              (angsuran.length > 0 ? angsuran[0].margin : 0).toFixed(0)
            )}
          </>
        );
      },
    },

    {
      title: "ANGSURAN BANK",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      dataIndex: "angsuran_bank",
      key: "angsuran_bank",
      width: 150,
      render(value, record, index) {
        const angsuran = getAngsuranPerBulan(
          record.DataPembiayaan.margin_bank,
          record.DataPembiayaan.tenor,
          record.DataPembiayaan.plafond,
          false,
          checkStatusFlat(record),
          record.Bank.kode,
          record.DataPembiayaan.pembulatanKhusus
        );
        const result = ceiling(
          parseInt(angsuran),
          record.DataPembiayaan.pembulatan
        );
        return <>{formatNumber(result.toFixed(0))}</>;
      },
    },
    {
      title: "ANGSURAN KOPERASI",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      dataIndex: "marginkop",
      key: "marginkop",
      width: 150,
      render(value, record, index) {
        const angsuran = getAngsuranPerBulan(
          record.DataPembiayaan.mg_bunga,
          record.DataPembiayaan.tenor,
          record.DataPembiayaan.plafond,
          false,
          checkStatusFlat(record),
          record.Bank.kode
        );
        const result = ceiling(
          parseInt(angsuran),
          record.DataPembiayaan.pembulatan
        );
        const angsuranBank = getAngsuranPerBulan(
          record.DataPembiayaan.margin_bank,
          record.DataPembiayaan.tenor,
          record.DataPembiayaan.plafond,
          false,
          false,
          record.Bank.kode,
          record.DataPembiayaan.pembulatanKhusus
        );
        const resultBank = ceiling(
          parseInt(angsuranBank),
          record.DataPembiayaan.pembulatan
        );

        return <>{formatNumber((result - resultBank).toFixed(0))}</>;
      },
    },
    {
      title: "ANGSURAN KE",
      dataIndex: "angsuran_ke",
      key: "angsuran_ke",
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
        const angsuran = record.JadwalAngsuran.filter(
          (e) =>
            moment(e.tanggal_bayar).format("MM/YY") ===
            moment().add(1, "month").format("MM/YY")
        );
        return <div>{angsuran.length > 0 && angsuran[0].angsuran_ke}</div>;
      },
    },
    {
      title: "SISA TENOR",
      dataIndex: "sisa_tenor",
      key: "sisa_tenor",
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
        const angsuran = record.JadwalAngsuran.filter(
          (e) =>
            moment(e.tanggal_bayar).format("MM") ===
            moment().add(1, "month").format("MM")
        );
        return (
          <>
            {record.DataPembiayaan.tenor -
              (angsuran.length > 0 ? angsuran[0].angsuran_ke : 0)}
          </>
        );
      },
    },
    // {
    //   title: "SISA POKOK",
    //   dataIndex: "sisa_pokok",
    //   key: "sisa_pokok",
    //   width: 150,
    //   onHeaderCell: (text, record) => {
    //     return {
    //       ["style"]: {
    //         textAlign: "center",
    //       },
    //     };
    //   },
    //   className: "text-center",
    //   render(value, record, index) {
    //     const angsuran = record.JadwalAngsuran.filter(
    //       (e) =>
    //         moment(e.tanggal_bayar).format("MM/YYYY") ===
    //         moment().add(1, "month").format("MM/YYYY")
    //     );
    //     return (
    //       <>
    //         {formatNumber(
    //           angsuran.length > 0 ? angsuran[0].sisa.toFixed(0) : "0"
    //         )}
    //       </>
    //     );
    //   },
    // },
    {
      title: "PERIODE",
      dataIndex: "periode",
      key: "periode",
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
        const angsuran = record.JadwalAngsuran.filter(
          (e) =>
            moment(e.tanggal_bayar).format("MM") ===
            moment().add(1, "month").format("MM")
        );
        return (
          <>
            {moment(
              angsuran.length > 0 ? angsuran[0].tanggal_bayar : new Date()
            ).format("MMYYYY")}
          </>
        );
      },
    },
    {
      title: "OUTSTANDING",
      dataIndex: "outstanding",
      key: "outstanding",
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
        const angsuran = record.JadwalAngsuran.filter(
          (e) =>
            moment(e.tanggal_bayar).format("MMYYYY") ===
            moment().add(1, "month").format("MMYYYY")
        );
        // const angsuranBulan = getAngsuranPerBulan(
        //   record.DataPembiayaan.mg_bunga,
        //   record.DataPembiayaan.tenor,
        //   record.DataPembiayaan.plafond
        // );
        // const ceilingAngsuran = ceiling(
        //   parseInt(angsuranBulan),
        //   record.DataPembiayaan.pembulatan
        // );

        return (
          <div>{angsuran && formatNumber(angsuran[0].sisa.toFixed(0))}</div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex gap-5 my-1 mx-1">
        {/* <DatePicker
          picker="month"
          onChange={(date, dateString) => setYear(dateString as string)}
        /> */}
        <RangePicker
          onChange={(_, info) => {
            setFrom(info && info[0]);
            setTo(info && info[1]);
          }}
        />
        <Input.Search
          style={{ width: 170 }}
          onChange={(e) => setNama(e.target.value)}
        />
      </div>
      <div className="px-2">
        <Table
          dataSource={data}
          columns={columns}
          bordered
          size="small"
          loading={loading}
          scroll={{ x: "max-content", y: "calc(62vh - 100px)" }}
          pagination={{
            pageSize: pageSize,
            total: total,
            onChange(page, pageSize) {
              setPage(page);
              setPageSize(pageSize);
            },
          }}
          summary={(pageData) => {
            let plafon = 0;
            let totalAngsuran = 0;
            let totalAngsuranBank = 0;
            let totalAngsuranKoperasi = 0;
            let totalPokok = 0;
            let totalMargin = 0;
            let os = 0;

            pageData.forEach((pd, ind) => {
              plafon += pd.DataPembiayaan.plafond;

              const angsuran = ceiling(
                parseInt(
                  getAngsuranPerBulan(
                    pd.DataPembiayaan.mg_bunga,
                    pd.DataPembiayaan.tenor,
                    pd.DataPembiayaan.plafond,
                    false,
                    checkStatusFlat(pd),
                    pd.Bank.kode,
                    pd.DataPembiayaan.pembulatanKhusus
                  )
                ),
                pd.DataPembiayaan.pembulatan
              );
              const angsuranBank = ceiling(
                parseInt(
                  getAngsuranPerBulan(
                    pd.DataPembiayaan.margin_bank,
                    pd.DataPembiayaan.tenor,
                    pd.DataPembiayaan.plafond,
                    false,
                    false,
                    pd.Bank.kode,
                    pd.DataPembiayaan.pembulatanKhusus
                  )
                ),
                pd.DataPembiayaan.pembulatan
              );
              const jadwal = pd.JadwalAngsuran.filter(
                (e) =>
                  moment(e.tanggal_bayar).format("MM/YY") ===
                  moment().add(1, "month").format("MM/YY")
              );
              totalAngsuran += angsuran;
              totalAngsuranBank += angsuranBank;
              totalAngsuranKoperasi += angsuran - angsuranBank;
              totalPokok += jadwal.length > 0 ? jadwal[0].pokok : 0;
              totalMargin += jadwal.length > 0 ? jadwal[0].margin : 0;
              os += jadwal.length > 0 ? jadwal[0].sisa : 0;
            });

            return (
              <Table.Summary.Row className="bg-green-500 text-white">
                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                <Table.Summary.Cell index={2} className="text-center">
                  Summary
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={9}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={10}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={11} className="text-center">
                  <>{formatNumber(plafon.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={12}>
                  <>{formatNumber(totalAngsuran.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={13}>
                  <>{formatNumber(totalPokok.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={14}>
                  <>{formatNumber(totalMargin.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={15}>
                  <>{formatNumber(totalAngsuranBank.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={16}>
                  <>{formatNumber(totalAngsuranKoperasi.toFixed(0))}</>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={17}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={18}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={19}>
                  <></>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={20} className="text-center">
                  <>{formatNumber(os.toFixed(0))}</>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            );
          }}
        />
      </div>
    </div>
  );
}
