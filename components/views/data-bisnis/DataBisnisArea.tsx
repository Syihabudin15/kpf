"use client";

import {
  DataTableEntryData,
  DataTypePengajuan,
  DataUser,
  Options,
} from "@/components/utils/Interfaces";
import { filterOption, formatNumber } from "@/components/utils/inputUtils";
import { LoadingOutlined } from "@ant-design/icons";
import { UnitPelayanan } from "@prisma/client";
import { Select, Table, TableProps } from "antd";
import { useEffect, useState } from "react";

export default function DataBisnisArea() {
  const [dataOk, setDataOk] = useState<DataTableEntryData[]>();
  const [dataPending, setDataPending] = useState<DataTableEntryData[]>();
  const [area, setArea] = useState<string>();
  const [options, setOptions] = useState<Options[]>();
  const [loading, setLoading] = useState(false);
  const [areaName, setAreaName] = useState<string>();

  const getUP = async () => {
    const res = await fetch("/api/area/up");
    const { data } = await res.json();
    const options: Options[] = data.map((d: UnitPelayanan) => {
      return { label: d.name, value: d.id };
    });
    if (!area && data) {
      setArea(data[0].id);
      setAreaName(data[0].name);
    }
    setOptions(options);
    return data[0].id;
  };
  const getData = async (id?: string) => {
    let res = await fetch("/api/bisnis/area?area=" + (id ? id : area));
    const { dataOK, dataPending } = await res.json();
    const filter = options?.filter((e) => e.value === area);
    setAreaName(filter ? filter[0].label : "");
    setDataOk(dataOK.map((d:any, ind:any) => {
      return {...d, key:ind}
    }));
    setDataPending(dataPending.map((d:any, ind:any) => {
      return {...d, key: ind}
    }));
  };
  useEffect(() => {
    (async () => {
      setLoading(true);
      const id = await getUP();
      await getData(id);
      setLoading(false);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      setLoading(true);
      await getData(area);
      setLoading(false);
    })();
  }, [area]);

  return (
    <div className="p-2">
      <div className="my-1">
        <Select
          options={options}
          showSearch
          filterOption={filterOption}
          placeholder="Pilih Area Pelayanan"
          onChange={(e) => setArea(e)}
        />
      </div>
      <div className="text-center italic bg-orange-500 text-white p-2 mb-1">
        <p>
          DATA BISNIS AREA{" "}
          {loading ? <LoadingOutlined /> : areaName?.toUpperCase()}
        </p>
      </div>
      <div>
        <div className="bg-green-500 text-white text-xs p-2 italic">
          <p>PENGAJUAN TELAH CAIR</p>
        </div>
        <Table
          columns={columns}
          loading={loading}
          bordered
          dataSource={dataOk}
          // scroll={{ x: 1000 }}
          pagination={false}
          size="small"
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
                  // scroll={{ x: 1000 }}
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
                          scroll={{ x: 800 }}
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
      <div>
        <div className="bg-green-500 text-white text-xs p-2 italic">
          <p>PENGAJUAN MASIH PENDING/ANTRI</p>
        </div>
        <Table
          columns={columns}
          loading={loading}
          bordered
          dataSource={dataPending}
          size="small"
          // scroll={{ x: 1000 }}
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
                  // scroll={{ x: 1000 }}
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
                          scroll={{ x: 800 }}
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
  );
}

const columns: TableProps<DataTableEntryData>["columns"] = [
  {
    title: "Nama Area",
    dataIndex: "nama_area",
    key: "nama_area",
    width: 200,
    render(value, record, index) {
      return <>{record.name}</>;
    },
  },
  {
    title: "Kode Area",
    dataIndex: "kode_area",
    key: "kode_area",
    render(value, record, index) {
      return <>{record.kode_area}</>;
    },
  },
  {
    title: "NOA",
    key: "noa",
    width: 100,
    dataIndex: "noa",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    render(value, record, index) {
      let noa = 0;
      record.User.forEach((user) => {
        noa += user.DataPengajuan.length;
      });
      return <>{noa}</>;
    },
  },
  {
    title: "Total Plafond",
    key: "total_plafon",
    dataIndex: "total_plafon",
    fixed: "right",
    width: 200,
    className: "text-center",
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    render(value, record, index) {
      let plafond = 0;
      record.User.forEach((user) => {
        user.DataPengajuan.forEach((pengajuan) => {
          plafond += pengajuan.DataPembiayaan.plafond;
        });
      });
      return <>Rp. {formatNumber(plafond.toFixed(0))}</>;
    },
  },
];

const columnsExpandUser: TableProps<DataUser>["columns"] = [
  {
    title: "Marketing",
    key: "nama_marketing",
    dataIndex: "nama_marketing",
    render(value, record, index) {
      return <>{record.first_name + " " + record.last_name}</>;
    },
  },
  {
    title: "NOA",
    key: "noa",
    width: 100,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    dataIndex: "noa",
    render(value, record, index) {
      return <>{record.DataPengajuan.length}</>;
    },
  },
  {
    title: "Total Plafond",
    key: "total_plafond",
    fixed: "right",
    width: 200,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    dataIndex: "total_plafond",
    render(value, record, index) {
      let plafond = 0;
      record.DataPengajuan.forEach((pengajuan) => {
        plafond += pengajuan.DataPembiayaan.plafond;
      });
      return <>Rp. {formatNumber(plafond.toFixed(0))}</>;
    },
  },
];

const columnsExpandPengajuan: TableProps<DataTypePengajuan>["columns"] = [
  {
    title: "Nama Pemohon",
    key: "nama_pemohon",
    dataIndex: "nama_pemohon",
    render(value, record, index) {
      return <>{record.DataPembiayaan.name}</>;
    },
  },
  {
    title: "Nopen",
    key: "nopen",
    dataIndex: "nopen",
    render(value, record, index) {
      return <>{record.DataPembiayaan.nopen}</>;
    },
  },
  {
    title: "Sumber Dana",
    key: "sumber_dana",
    dataIndex: "sumber_dana",
    width: 200,
    render(value, record, index) {
      return <>{record.DataPembiayaan.Produk.Bank.name}</>;
    },
  },
  {
    title: "Tenor",
    key: "tenor",
    width: 100,
    dataIndex: "tenor",
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
    title: "Plafond",
    key: "plafond",
    fixed: "right",
    width: 200,
    onHeaderCell: (text, record) => {
      return {
        ["style"]: {
          textAlign: "center",
        },
      };
    },
    className: "text-center",
    dataIndex: "plafond",
    render(value, record, index) {
      return <>Rp. {formatNumber(record.DataPembiayaan.plafond.toFixed(0))}</>;
    },
  },
];
