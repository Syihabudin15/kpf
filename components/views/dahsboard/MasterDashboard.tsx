"use client";
import {
  LineProps,
  DashboardMaster,
} from "@/app/api/dashboard/master/route";
import { formatNumber } from "@/components/utils/inputUtils";
import { DislikeFilled,  LikeFilled, LoadingOutlined } from "@ant-design/icons";
import { Spin, Table, TableProps, Tooltip } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

export default function MasterDashboard() {
  const [line, setLine] = useState<LineProps>();
  const [pie, setPie] = useState<LineProps>();
  const [data, setData] = useState<DashboardMaster[]>();
  const [loading, setLoading] = useState(false);
  const [dataArea, setDataArea] = useState<any[]>();
  const [dataCabang, setDataCabang] = useState<any[]>();
  const [dataMarketing, setDataMarketing] = useState<any[]>();
  const [dataflash, setDataFlash] = useState<DashboardMaster[]>();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch("/api/dashboard/master");
      const { banks, line, months, pie, dataTable, dataArea, marketingTerbaik,dataflash, cabang } = await res.json();
      setData(dataTable);
      setDataFlash(dataflash);
      setDataCabang(cabang);
      setLine({
        series: line,
        options: {
          chart: {
            height: 350,
            type: "area",
            toolbar: {
              show: false
            }
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
      const { label, data } = pie;
      setPie({
        series: data,
        options: {
          chart: {
            width: 200,
            type: "donut",
          },
          dataLabels: {
            enabled: false,
          },
          labels: label,
          legend: {
            show: true,
            position: "bottom",
            horizontalAlign: "center",
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
              },
            },
          ],
        },
      });
      setDataArea(dataArea);
      setDataMarketing(marketingTerbaik);
      setLoading(false);
    })();
  }, []);

  return (
    <Spin spinning={loading}>
      <div className="px-0">
        <div className="flex flex-col sm:flex-row justify-between gap-5">
          <div className="bg-white p-1 rounded shadow" style={{ flex: 1.2 }}>
            {line ? (
              <ReactApexChart
                options={line.options}
                series={line.series}
                type="area"
                height={350}
                key={"master-line"}
              />
            ) : (
              <LoadingOutlined />
            )}
          </div>
          <div className="bg-white p-1 rounded shadow" style={{ flex: 0.8 }}>
            {pie ? (
              <ReactApexChart
                options={pie.options}
                series={pie.series}
                type="donut"
                key={"master-donut"}
              />
            ) : (
              <LoadingOutlined />
            )}
          </div>
        </div>
        <div className="mt-5 p-0 rounded shadow bg-white">
          <div className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 text-white font-bold italic p-2 text-xs text-center`}>DATA BISNIS BANK (REGULER)</div>
          <Table
            bordered
            size="small"
            pagination={false}
            columns={columnsDashboard}
            dataSource={data}
            loading={loading}
            scroll={{ x: 1000,y:500 }}
          />
        </div>
        <div className="mt-5 p-0 rounded shadow bg-white">
          <div className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 text-white font-bold italic p-2 text-xs text-center`}>DATA BISNIS BANK (FLASH)</div>
          <Table
            bordered
            size="small"
            pagination={false}
            columns={columnsDashboard}
            dataSource={dataflash}
            loading={loading}
            scroll={{ x: 1000, y: 500 }}
          />
        </div>
        <div className="mt-5 p-0 rounded shadow bg-white">
           <div className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 text-white font-bold italic p-2 text-xs text-center`}>DATA BISNIS AREA</div>
          <Table
            bordered
            size="small"
            pagination={false}
            columns={columnsArea}
            dataSource={dataArea}
            loading={loading}
            scroll={{ x: 1000,y:500 }}
          />
        </div>
        <div className="mt-5 p-0 rounded shadow bg-white">
           <div className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 text-white font-bold italic p-2 text-xs text-center`}>DATA BISNIS CABANG</div>
          <Table
            bordered
            size="small"
            pagination={false}
            columns={columnsCabang}
            dataSource={dataCabang}
            loading={loading}
            scroll={{ x: 1000, y: 500 }}
          />
        </div>
        <div className="mt-5 p-0 rounded shadow bg-white">
           <div className={`bg-${process.env.NEXT_PUBLIC_APP_BG_TABLE}-500 text-white font-bold italic p-2 text-xs text-center`}>DATA BISNIS MARKETING</div>
          <Table
            bordered
            size="small"
            pagination={false}
            columns={columnsMarketing}
            dataSource={dataMarketing}
            loading={loading}
            scroll={{ x: 1000, y: 500 }}
          />
        </div>
      </div>
    </Spin>
  );
}

// const columns: TableProps<DataMasterDashboard>["columns"] = [
//   {
//     title: "SUMBER DANA",
//     key: "sumdan",
//     width: 200,
//     onHeaderCell: (text, record) => {
//       return {
//         ["style"]: {
//           textAlign: "center",
//           backgroundColor: "green",
//           color: "white"
//         },
//       };
//     },
//     render(value, record, index) {
//       return <>{record.name.toUpperCase()}</>;
//     },
//   },
//   {
//     title: "ANTRI",
//     key: "antri",
//     dataIndex: "antri",
//     width: 150,
//     className: "text-center",
//     onHeaderCell: (text, record) => {
//       return {
//         ["style"]: {
//           textAlign: "center",
//           backgroundColor: "orange",
//           color: "white"
//         },
//       };
//     },
//     render(value, record, index) {
//       let plafond = 0;
//       let total = 0;
//       record.DataPengajuan.forEach((p) => {
//         if (
//           p.status_pencairan !== "TRANSFER" &&
//           p.status_pencairan !== "BATAL"
//         ) {
//           plafond += p.DataPembiayaan.plafond;
//           total += 1;
//         }
//       });
//       return <div className="flex">
//         <div className="flex-1" style={{borderRight: "1px solid #aaa"}}>{total}</div>
//         <div className="flex-1">{formatNumber(plafond.toFixed(0))}</div>
//       </div>;
//     },
//   },
//   {
//     title: "DITOLAK",
//     key: "tolak",
//     width: 150,
//     dataIndex: "tolak",
//     className: "text-center",
//     onHeaderCell: (text, record) => {
//       return {
//         ["style"]: {
//           textAlign: "center",
//           backgroundColor: "red",
//           color: "white"
//         },
//       };
//     },
//     render(value, record, index) {
//       let plafond = 0;
//       let total = 0;
//       record.DataPengajuan.forEach((p) => {
//         if (p.status_pencairan === "BATAL") {
//           plafond += p.DataPembiayaan.plafond;
//           total += 1;
//         }
//       });
//       return <div className="flex">
//         <div className="flex-1"  style={{borderRight: "1px solid #aaa"}}>{total}</div>
//         <div className="flex-1">{formatNumber(plafond.toFixed(0))}</div>
//       </div>;
//     },
//   },
//   {
//     title: "DROPPING",
//     key: "dropping",
//     width: 150,
//     dataIndex: "dropping",
//     className: "text-center",
//     onHeaderCell: (text, record) => {
//       return {
//         ["style"]: {
//           textAlign: "center",
//           backgroundColor: "green",
//           color: "white"
//         },
//       };
//     },
//     render(value, record, index) {
//       let plafond = 0;
//       let total = 0;
//       record.DataPengajuan.forEach((p) => {
//         if (p.status_pencairan === "TRANSFER") {
//           plafond += p.DataPembiayaan.plafond;
//           total += 1;
//         }
//       });
//       return <div className="flex">
//         <div className="flex-1" style={{borderRight: "1px solid #aaa"}}>{total}</div>
//         <div className="flex-1" >{formatNumber(plafond.toFixed(0))}</div>
//       </div>;
//     },
//   },
//   {
//     title: "OS",
//     key: "os",
//     dataIndex: "os",
//     width: 150,
//     className: "text-center",
//     onHeaderCell: (text, record) => {
//       return {
//         ["style"]: {
//           textAlign: "center",
//           backgroundColor: "blue",
//           color: "white"
//         },
//       };
//     },
//     render(value, record, index) {
//       let plafond = 0;
//       let total = 0;
//       record.DataPengajuan.forEach((p) => {
//         if (p.status_pencairan === "TRANSFER") {
//           plafond +=
//             p.DataPembiayaan.plafond -
//             ((p.DataPembiayaan.plafond * (p.DataPembiayaan.by_admin_bank / 100)) +
//               p.DataPembiayaan.by_buka_rekening);
//               total += 1;
//         }
//       });
//       return <div className="flex">
//         <div className="flex-1"  style={{borderRight: "1px solid #aaa"}}>{total}</div>
//         <div className="flex-1">{formatNumber(plafond.toFixed(0))}</div>
//       </div>;
//     },
//   },
// ];

const columnsDashboard: TableProps<DashboardMaster>['columns'] = [
  {
    title: "ANTRIAN PENGAJUAN BANK",
    key: "sumdan",
      dataIndex: "antrian",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
            backgroundColor: "#ea580c",
            color: "white"
          },
        };
      },
      className: "text-center",
    children: [
      {
        title: "SUMBER DANA",
        key: "sumdan",
        dataIndex: "sumdan",
        onHeaderCell: (text, record) => {
          return {
            ["style"]: {
              textAlign: "center",
              backgroundColor: "#22c55e",
            color: "white"
            },
          };
        },
        className: "text-center",
        render(value, record, index) {
          return<>{record.nama}</>
        },
      },
      {
        title: "SLIK",
        dataIndex: "slik",
        key: "slik",
        onHeaderCell: (text, record) => {
          return {
            ["style"]: {
              textAlign: "center",
              backgroundColor: "#ea580c",
            color: "white"
            },
          };
        },
        className: "text-center",
      },
      {
        title: "APPROVAL",
        dataIndex: "approval",
        key: "approval",
        onHeaderCell: (text, record) => {
          return {
            ["style"]: {
              textAlign: "center",
              backgroundColor: "#ea580c",
            color: "white"
            },
          };
        },
        className: "text-center",
      },
    ]
  },
  {
    title: "PENGAJUAN DROPPING",
    key: "pengajuan_dropping",
    dataIndex: "pengajuan_dropping",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
          backgroundColor: "#ea580c",
            color: "white"
        },
      };
    },
    className: "text-center",
    children: [
      {
        title: "ANTRI",
        dataIndex: "antri",
        key: "antri",
        onHeaderCell: (text, record) => {
          return {
            ["style"]: {
              textAlign: "center",
              backgroundColor: "#991b1b",
            color: "white"
            },
          };
        },
        className: "text-center",
        render(value, record, index) {
          return(<>{formatNumber(record.pengajuan_dropping[0].toFixed(0))}</>)
        },
      },
      {
        title: "PROSES",
        dataIndex: "proses",
        key: "proses",
        onHeaderCell: (text, record) => {
          return {
            ["style"]: {
              textAlign: "center",
              backgroundColor: "#991b1b",
            color: "white"
            },
          };
        },
        className: "text-center",
        render(value, record, index) {
          return(<>{formatNumber(record.pengajuan_dropping[1].toFixed(0))}</>)
        },
      }
    ]
  },
  {
    title: moment().format("DD-MM-YYYY"),
    key: "hari_ini",
    dataIndex: "dropping_hari_ini",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
          backgroundColor: "#fbbf24",
          color: "white"
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return(
        <>{formatNumber(record.dropping_hari_ini.toFixed(0))}</>
      )
    },
  },
  {
    title: "TOTAL",
    key: "total",
    dataIndex: "total",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
          backgroundColor: "#ea580c",
          color: "white"
        },
      };
    },
    className: "text-center",
    children: [
      {
        title: "DROPPING",
        dataIndex: "dropping",
        key: "dropping",
        onHeaderCell: (text, record) => {
          return {
            ["style"]: {
              textAlign: "center",
              backgroundColor: "#9a3412",
              color: "white"
            },
          };
        },
        className: "text-center",
        render(value, record, index) {
          return(<>{formatNumber(record.total[0].toFixed(0))}</>)
        },
      },
      {
        title: "OS",
        dataIndex: "os",
        key: "os",
        onHeaderCell: (text, record) => {
          return {
            ["style"]: {
              textAlign: "center",
              backgroundColor: "#9a3412",
              color: "white"
            },
          };
        },
        className: "text-center",
        render(value, record, index) {
          return(<>{formatNumber(record.total[1].toFixed(0))}</>)
        },
      }
    ]
  },
]

const columnsArea: TableProps<any>['columns'] = [
  {
    title: "NAMA AREA",
    dataIndex: "nama",
    key: "nama",
    onHeaderCell: (text, record) => {
          return {
            ["style"]: {
              textAlign: "center",
              backgroundColor: "#22c55e",
              color: "white"
            },
          };
        },
        className: "text-center",
    render(value, record, index) {
      return (<>{record.nama}</>)
    },
  },
  {
    title: "KODE AREA",
    dataIndex: "kode_area",
    key: "kode_area",
    onHeaderCell: (text, record) => {
          return {
            ["style"]: {
              textAlign: "center",
            },
          };
        },
        className: "text-center",
    render(value, record, index) {
      return (<>{record.kode_area}</>)
    },
  },
  {
    title: "TOTAL CABANG",
    dataIndex: "total_up",
    key: "total_up",
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
      return (<>{record.total_up}</>)
    },
  },
  {
    title: "TOTAL MARKETING",
    dataIndex: "total_marketing",
    key: "total_marketing",
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
      return (<>{record.total_marketing}</>)
    },
  },
  {
    title: "TOTAL ANTRIAN",
    dataIndex: "total_antrian",
    key: "total_antrian",
    onHeaderCell: (text, record) => {
          return {
            ["style"]: {
              textAlign: "center",
              backgroundColor: "#fbbf24",
              color: "white"
            },
          };
        },
        className: "text-center",
    render(value, record, index) {
      return (<div className="flex">
        <span  style={{borderRight: "1px solid #aaa", flex: .5}}>{record.jumlah_antrian}</span>
        <span style={{flex: 1.5}}>{formatNumber(record.total_antrian.toFixed(0))}</span>
      </div>)
    },
  },
  {
    title: "TOTAL PENCAIRAN",
    dataIndex: "total_pencairan",
    key: "total_pencairan",
    onHeaderCell: (text, record) => {
          return {
            ["style"]: {
              textAlign: "center",
              backgroundColor: "#22c55e",
              color: "white"
            },
          };
        },
        className: "text-center",
    render(value, record, index) {
      return (<div className="flex">
        <span  style={{borderRight: "1px solid #aaa", flex: .5}}>{record.jumlah_pencairan}</span>
        <span style={{flex: 1.5}}>{formatNumber(record.total_pencairan.toFixed(0))}</span>
      </div>)
    },
  },
  {
    title: <div className="flex justify-center gap-2 text-center">
      <Tooltip title="MENCAPAI TARGET"><LikeFilled style={{color: "green"}} /></Tooltip>
      <Tooltip title="TIDAK MENCAPAI TARGET"><DislikeFilled style={{color: "red"}}/></Tooltip>
    </div>,
    dataIndex: "like",
    key: "like",
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
        <div>
          {record.total_pencairan >= 100000000 ? <LikeFilled style={{color: "green"}} /> : <DislikeFilled style={{color: "red"}}/>} <span className="ps-2">{index+1}</span>
        </div>
      )
    },
  },
]

const columnsCabang: TableProps<any>['columns'] = [
  {
    title: "NAMA CABANG",
    dataIndex: "nama",
    key: "nama",
    onHeaderCell: (text, record) => {
          return {
            ["style"]: {
              textAlign: "center",
              backgroundColor: "#22c55e",
              color: "white"
            },
          };
        },
        className: "text-center",
    render(value, record, index) {
      return (<>{record.nama}</>)
    },
  },
  {
    title: "AREA PELAYANAN",
    dataIndex: "nama",
    key: "nama",
    onHeaderCell: (text, record) => {
          return {
            ["style"]: {
              textAlign: "center",
            },
          };
        },
        className: "text-center",
    render(value, record, index) {
      return (<>{record.area}</>)
    },
  },
  {
    title: "TOTAL MARKETING",
    dataIndex: "total_up",
    key: "total_up",
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
      return (<>{record.total_marketing}</>)
    },
  },
  {
    title: "TOTAL ANTRIAN",
    dataIndex: "total_antrian",
    key: "total_antrian",
    width: 150,
    onHeaderCell: (text, record) => {
          return {
            ["style"]: {
              textAlign: "center",
              backgroundColor: "#facc15",
              color: "white"
            },
          };
        },
        className: "text-center",
    render(value, record, index) {
      return (<div className="flex">
        <span  style={{borderRight: "1px solid #aaa", flex: .5}}>{record.jumlah_antrian}</span>
        <span style={{flex: 1.5}}>{formatNumber(record.total_antrian.toFixed(0))}</span>
      </div>)
    },
  },
  {
    title: "TOTAL PENCAIRAN",
    dataIndex: "total_pencairan",
    key: "total_pencairan",
    onHeaderCell: (text, record) => {
          return {
            ["style"]: {
              textAlign: "center",
              backgroundColor: "#22c55e",
              color: "white"
            },
          };
        },
        className: "text-center",
    render(value, record, index) {
      return (<div className="flex">
        <span  style={{borderRight: "1px solid #aaa", flex: .5}}>{record.jumlah_pencairan}</span>
        <span style={{flex: 1.5}}>{formatNumber(record.total_pencairan.toFixed(0))}</span>
      </div>)
    },
  },
  {
    title: <div className="flex justify-center gap-2 text-center">
      <Tooltip title="MENCAPAI TARGET"><LikeFilled style={{color: "green"}} /></Tooltip>
      <Tooltip title="TIDAK MENCAPAI TARGET"><DislikeFilled style={{color: "red"}}/></Tooltip>
    </div>,
    dataIndex: "like",
    key: "like",
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
        <div>
          {record.total_pencairan >= 100000000 ? <LikeFilled style={{color: "green"}} /> : <DislikeFilled style={{color: "red"}}/>} <span className="ps-2">{index +1}</span>
        </div>
      )
    },
  },
]



const columnsMarketing: TableProps<any>["columns"] = [
  {
    title: "NAMA MARKETING",
    dataIndex: "nama",
    key: "nama",
     onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
          backgroundColor: "#22c55e",
              color: "white"
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return<>{record.nama}</>
    },
  },
  {
    title: "JABATAN",
    dataIndex: "jabatan",
    key: "jabatan",
     onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return<>{record.jabatan}</>
    },
  },
  {
    title: "UNIT PELAYANAN",
    dataIndex: "unit",
    key: "unit",
     onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return<>{record.unit_pelayanan}</>
    },
  },
  {
    title: "AREA PELAYANAN",
    dataIndex: "area",
    key: "area",
     onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return<>{record.area_pelayanan}</>
    },
  },
  {
    title: "TOTAL NASABAH",
    dataIndex: "nasabah",
    key: "nasabah",
     onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
          backgroundColor: "#facc15",
              color: "white"
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return<>{record.total_nasabah}</>
    },
  },
  {
    title: "TOTAL PLAFOND",
    dataIndex: "plafond",
    key: "plafond",
     onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
           backgroundColor: "#22c55e",
              color: "white"
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      return<>{formatNumber(record.total_plafond.toFixed(0))}</>
    },
  },
  {
    title: <div className="flex justify-center gap-2 text-center">
      <Tooltip title="MENCAPAI TARGET"><LikeFilled style={{color: "green"}} /></Tooltip>
      <Tooltip title="TIDAK MENCAPAI TARGET"><DislikeFilled style={{color: "red"}}/></Tooltip>
    </div>,
    dataIndex: "like",
    key: "like",
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
        <div>
          {record.total_plafond > 100000000 ? <LikeFilled style={{color: "green"}} /> : <DislikeFilled style={{color: "red"}}/>} <span className="ps-2">{index+1}</span>
        </div>
      )
    },
  },
]