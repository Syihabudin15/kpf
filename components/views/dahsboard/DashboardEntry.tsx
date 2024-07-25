"use client";
import { Spin, Table, TableProps } from "antd";
import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { formatNumber } from "@/components/utils/inputUtils";
import { LineProps } from "@/app/api/dashboard/master/route";
import {
  DataTableEntryData,
  DataTypePengajuan,
  DataUser,
} from "@/components/utils/Interfaces";
import ReactApexChart from "react-apexcharts";
export const dynamic = "force-dynamic";

export default function DashboardEntry() {
  const [loading, setLoading] = useState(false);
  const [dataTable, setDataTable] = useState<DataTableEntryData[]>([]);
  const [namaArea, setNamaArea] = useState<string>();
  const [line, setLine] = useState<LineProps>();

  const getData = async () => {
    setLoading(true);
    const res = await fetch("/api/dashboard/entry-data");
    const { dataTable, namaArea, data, months } = await res.json();
    setNamaArea(namaArea);
    setDataTable(
      dataTable.map((d: DataTableEntryData) => {
        return { ...d, key: d.id };
      })
    );
    console.log({ data, months });
    setLine({
      series: data,
      options: {
        chart: {
          height: 350,
          type: "area",
          toolbar: {
            show: false,
          },
        },
        stroke: {
          curve: "smooth",
        },
        xaxis: {
          categories: months,
        },
        yaxis: {
          labels: {
            show: true,
            formatter: function (val: number) {
              return formatNumber(val.toFixed(0));
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val: number) {
            return formatNumber(val.toFixed(0));
          },
          style: {
            fontSize: "10px",
          },
        },
      },
    });
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, []);

  return (
    <div className="p-0">
      <Spin spinning={loading}>
        <div>
          <div className="bg-white p-3 rounded shadow">
            <div className="flex justify-between items-center my-1">
              <div className="flex-1">
                <p className="font-bold">
                  Report Statistic {new Date().getFullYear()}
                </p>
              </div>
            </div>
            <div className="bg-white p-1 rounded shadow" style={{ flex: 1.2 }}>
              {line ? (
                <ReactApexChart
                  options={line.options}
                  series={line.series}
                  type="area"
                  height={350}
                  key={"entry-line"}
                />
              ) : (
                <LoadingOutlined />
              )}
            </div>
          </div>
        </div>
        {/* Table */}
        <div>
          <div className="bg-orange-500 text-white p-3 text-center rounded">
            <p>DATA AREA {namaArea}</p>
          </div>
          <div className="bg-white p-2">
            <Table
              columns={columns}
              dataSource={dataTable}
              bordered
              loading={loading}
              size="small"
              pagination={false}
              scroll={{ x: "max-content", y: "calc(65vh - 100px)" }}
              expandable={{
                expandedRowRender: (record) => {
                  return (
                    <Table
                      columns={columnsExpandUser}
                      dataSource={record.User.map((e) => {
                        return { ...e, key: e.id };
                      })}
                      bordered
                      size="small"
                      scroll={{ x: 1000 }}
                      pagination={false}
                      expandable={{
                        expandedRowRender: (record) => {
                          return (
                            <Table
                              columns={columnsExpandPengajuan}
                              dataSource={record.DataPengajuan.map((e: any) => {
                                return { ...e, key: e.id };
                              })}
                              bordered
                              size="small"
                              scroll={{ x: 1000 }}
                              pagination={false}
                            />
                          );
                        },
                      }}
                    />
                  );
                },
              }}
            />
          </div>
        </div>
        {/* End Table */}
      </Spin>
    </div>
  );
}

const columns: TableProps<DataTableEntryData>["columns"] = [
  {
    title: "Kode Cabang",
    dataIndex: "kode_cabang",
    key: "kode_cabang",
    width: 130,
    render(value, record, index) {
      return <>{record.kode_area}</>;
    },
  },
  {
    title: "Nama Cabang",
    dataIndex: "nama_cabang",
    key: "nama_cabang",
    width: 150,
    render(value, record, index) {
      return <>{record.name}</>;
    },
  },
  {
    title: "NOA",
    key: "noa",
    width: 100,
    dataIndex: "noa",
    render(value, record, index) {
      let noa = 0;
      record.User.forEach((user) => {
        noa += user.DataPengajuan.length;
      });
      return <>{noa}</>;
    },
  },
  {
    title: "Total Plafon",
    key: "total_plafon",
    width: 150,
    dataIndex: "total_plafon",
    render(value, record, index) {
      let plafond = 0;
      record.User.forEach((user) => {
        user.DataPengajuan.forEach((pengajuan) => {
          plafond += pengajuan.DataPembiayaan.plafond;
        });
      });
      return <>{formatNumber(plafond.toFixed(0))}</>;
    },
  },
];

const columnsExpandUser: TableProps<DataUser>["columns"] = [
  {
    title: "Nama Marketing",
    key: "nama_marketing",
    width: 150,
    dataIndex: "nama_marketing",
    render(value, record, index) {
      return <>{record.first_name + " " + record.last_name}</>;
    },
  },
  {
    title: "NOA",
    key: "noa",
    dataIndex: "noa",
    width: 100,
    render(value, record, index) {
      return <>{record.DataPengajuan.length}</>;
    },
  },
  {
    title: "Total Plafond",
    key: "total_plafond",
    dataIndex: "total_plafond",
    width: 150,
    render(value, record, index) {
      let plafond = 0;
      record.DataPengajuan.forEach((pengajuan) => {
        plafond += pengajuan.DataPembiayaan.plafond;
      });
      return <>{formatNumber(plafond.toFixed(0))}</>;
    },
  },
];

const columnsExpandPengajuan: TableProps<DataTypePengajuan>["columns"] = [
  {
    title: "Nama Pemohon",
    key: "nama_pemohon",
    dataIndex: "nama_pemohon",
    width: 150,
    render(value, record, index) {
      return <>{record.DataPembiayaan.name}</>;
    },
  },
  {
    title: "Nopen",
    key: "nopen",
    dataIndex: "nopen",
    width: 150,
    render(value, record, index) {
      return <>{record.DataPembiayaan.nopen}</>;
    },
  },
  {
    title: "Produk Pembiayaan",
    key: "produk",
    dataIndex: "produk",
    width: 150,
    render(value, record, index) {
      return <>{record.DataPembiayaan.Produk.name}</>;
    },
  },
  {
    title: "Jenis Pembiayaan",
    key: "jenis",
    dataIndex: "jenis",
    width: 150,
    render(value, record, index) {
      return (
        <>
          {record.DataPembiayaan.jenis_pembiayaan_id
            ? record.DataPembiayaan.JenisPembiayaan.name
            : "-"}
        </>
      );
    },
  },
  {
    title: "Sumber Dana",
    key: "sumber_dana",
    dataIndex: "sumber_dana",
    width: 150,
    render(value, record, index) {
      return <>{record.DataPembiayaan.Produk.Bank.name}</>;
    },
  },
  {
    title: "Tenor",
    key: "tenor",
    dataIndex: "tenor",
    width: 100,
    render(value, record, index) {
      return <>{record.DataPembiayaan.tenor}</>;
    },
  },
  {
    title: "Plafond",
    key: "plafond",
    dataIndex: "plafond",
    width: 150,
    render(value, record, index) {
      return <>{formatNumber(record.DataPembiayaan.plafond.toFixed(0))}</>;
    },
  },
];
