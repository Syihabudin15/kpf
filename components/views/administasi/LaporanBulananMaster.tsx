"use client";

import { DataCost, DataDataPengajuan } from "@/components/utils/Interfaces";
import { formatNumber, formatNumberTitik } from "@/components/utils/inputUtils";
import { DatePicker, Spin, Table, TableProps } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

export default function LaporanBulananMaster() {
  const [month, setMonth] = useState<string>(`${new Date().getFullYear()}-${new Date().getMonth()+1}`);
  const [dataTable, setDataTable] = useState<DataDataPengajuan[]>();
  const [dataCost, setDataCost] = useState<DataCost[]>();
  const [loading, setLoading] = useState(false);
  const [totalPemasukan, setPemasukan] = useState(0);
  const [totalPengeluaran, setPengeluaran] = useState(0);


  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/administrasi/bulanan${month ? "?month=" + month : ""}`
    );
    const { dataTable,  dataCost } = await res.json();
    setDataTable(dataTable);
    setDataCost(dataCost);
    let pemasukan = 0;
    let pengeluaran = 0;
    dataTable.forEach((masuk:DataDataPengajuan) => {
      pemasukan += masuk.DataPembiayaan.plafond;
    });
    dataCost.forEach((keluar:DataCost) => {
      pengeluaran += keluar.nominal;
    });
    setPemasukan(pemasukan);
    setPengeluaran(pengeluaran);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [month]);

  return (
    <Spin spinning={loading}>
      <div className="flex gap-2 my-1">
        <DatePicker
          picker="month"
          // value={month}
          onChange={(date, datestring) => setMonth(datestring as string)}
          placeholder={`${new Date().getFullYear()}-${
            new Date().getMonth() + 1
          }`}
        />
      </div>
      <div>
        <div>
          <div className="p-2 text-xs text-white bg-blue-500 italic">
            <p>
              Data Pemsukan bulan{" "}
              {new Date(month ? `${month}-11` : new Date()).toLocaleString(
                "id-ID",
                {
                  month: "long",
                }
              )}{" "}
              {month ? month.split("-")[0] : new Date().getFullYear()}
            </p>
          </div>
          <div>
            <Table columns={columnsPengajuan} dataSource={dataTable} size="small" bordered pagination={false} scroll={{x:1500, y: 320}} />
          </div>
        </div>
        <div className="mt-5">
          <div className="p-2 text-xs text-white bg-blue-500 italic">
            <p>
              Data Pengeluaran bulan{" "}
              {new Date(month ? `${month}-11` : new Date()).toLocaleString(
                "id-ID",
                {
                  month: "long",
                }
              )}{" "}
              {month ? month.split("-")[0] : new Date().getFullYear()}
            </p>
          </div>
          <div>
            <Table
              columns={columns}
              dataSource={dataCost}
              size="small"
              bordered
              pagination={false}
            />
          </div>
        </div>
      </div>
      <div className="mt-5 text-xs font-bold italic">
        <div className="flex gap-2">
          <span style={{width: 150}}>PEMASUKAN</span>
          <span style={{width: 30}}>:</span>
          <div className="flex gap-2">
            <span style={{width: 20}}>Rp.</span>
            <span>{formatNumber(totalPemasukan.toFixed(0))}</span>
          </div>
        </div>
        <div className="flex gap-2 border-b border-black">
          <span style={{width: 150}}>PENGELUARAN</span>
          <span style={{width: 30}}>:</span>
          <div className="flex gap-2">
            <span style={{width: 20}}>Rp.</span>
            <span>{formatNumber(totalPengeluaran.toFixed(0))}</span>
          </div>
        </div>
        <div className="mt-2 flex gap-2">
          <span style={{width: 150}}>TOTAL</span>
          <span style={{width: 30}}>:</span>
          <div className="flex gap-2">
            <span style={{width: 20}}>Rp.</span>
            <span>{formatNumber((totalPemasukan - totalPengeluaran).toFixed(0))}</span>
          </div>
        </div>
      </div>
    </Spin>
  );
}

const columns: TableProps<DataCost>["columns"] = [
  {
    title: "NO",
    key: "no",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    dataIndex: "no",
    width: 50,
    render(value, record, index) {
      return <>{index + 1}</>;
    },
  },
  {
    title: "NAMA",
    key: "name",
    dataIndex: "name",
    width: 150,
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
    title: "KETERANGAN",
    key: "keterangan",
    dataIndex: "keterangan",
    width: 200,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-justify",
  },
  {
    title: "NOMINAL",
    key: "nominal",
    dataIndex: "nominal",
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
      return <>{formatNumber(record.nominal.toFixed(0))}</>;
    },
  },
  {
    title: "PEMBUAT",
    key: "user",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    dataIndex: "user",
    width: 200,
    render(value, record, index) {
      return (
        <>
          {record.User.first_name} {record.User.last_name}
        </>
      );
    },
  },
];

const columnsPengajuan: TableProps<DataDataPengajuan>["columns"] = [
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
      return<>{index+1}</>
    },
  },
  {
    title: "AREA",
    key: "area",
    dataIndex: "area",
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
      return<>{record.User.UnitCabang.UnitPelayanan.name}</>
    },
  },
  {
    title: "UNIT PELAYANAN",
    key: "area",
    dataIndex: "area",
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
      return<>{record.User.UnitCabang.name}</>
    },
  },
  {
    title: "NAMA PEMOHON",
    key: "nama",
    dataIndex: "nama",
    width: 200,
    fixed: "left",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return<>{record.DataPembiayaan.name}</>
    },
  },
  {
    title: "TANGGAL PENCAIRAN",
    key: "cair",
    dataIndex: "cair",
    width: 150,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    render(value, record, index) {
      return<>{moment(record.tanggal_pencairan).format("DD-MM-YYYY")}</>
    },
  },
  {
    title: "PRODUK",
    key: "produk",
    dataIndex: "produk",
    width: 150,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    render(value, record, index) {
      return<>{record.DataPembiayaan.Produk.name}</>
    },
  },
  {
    title: "JENIS",
    key: "jenis",
    dataIndex: "jenis",
    width: 150,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    render(value, record, index) {
      return<>{record.DataPembiayaan.JenisPembiayaan.name}</>
    },
  },
  {
    title: "SUMBER DANA",
    key: "sumdan",
    dataIndex: "sumdan",
    width: 200,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    render(value, record, index) {
      return<>{record.Bank.name}</>
    },
  },
  {
    title: "TENOR",
    key: "tenor",
    dataIndex: "tenor",
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
      return<>{record.DataPembiayaan.tenor}</>
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
      return<>{formatNumberTitik(record.DataPembiayaan.plafond.toFixed(0))}</>
    },
  },
]