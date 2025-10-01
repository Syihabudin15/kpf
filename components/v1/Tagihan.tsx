"use client";

import {
  Button,
  DatePicker,
  Input,
  Select,
  Table,
  TableProps,
  Upload,
} from "antd";
import { IJadwalAngsuran } from "./IInterfaces";
import { useEffect, useState } from "react";
import { getBase64, IDRFormat } from "./appUtils";
import moment from "moment";
import { Bank } from "@prisma/client";
import { CloudUploadOutlined, PrinterFilled } from "@ant-design/icons";

export default function Tagihan() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [search, setSearch] = useState<string>();
  const [data, setData] = useState<IJadwalAngsuran[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [backdate, setBackdate] = useState<string>();
  const [sumdanId, setSumdanId] = useState<string>();
  const [sumdans, setSumdans] = useState<Bank[]>([]);
  const [status, setStatus] = useState<string>();

  const getData = async () => {
    setLoading(true);
    await fetch(
      `/api/v1/tagihan?page=${page}&pageSize=${pageSize}${
        search ? "&search=" + search : ""
      }${backdate ? "&backdate=" + backdate : ""}${
        sumdanId ? "&sumdanId=" + sumdanId : ""
      }${status ? "&status=" + status : ""}`
    )
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setTotal(res.total);
      });
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
      await fetch("/api/v1/sumdan?pageSize=100")
        .then((res) => res.json())
        .then((res) => setSumdans(res.data));
    })();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getData();
    }, 100);
    return () => clearTimeout(timeout);
  }, [page, pageSize, search, backdate, sumdanId, status]);

  const handleUpload = async (options: any) => {
    setLoading(true);
    const base = await getBase64(options.file);
    await fetch("/api/v1/tagihan", {
      method: "POST",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify({ url: base }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log({ res });
      })
      .catch((err) => {
        console.log(err);
      });
    setLoading(false);
  };

  const columns: TableProps<IJadwalAngsuran>["columns"] = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
      className: "text-xs text-center",
      width: 50,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      render(value, record, index) {
        return <>{(page - 1) * pageSize + (index + 1)}</>;
      },
    },
    {
      title: "PERIODE",
      dataIndex: "periode",
      key: "periode",
      className: "text-xs text-center",
      width: 100,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      render(value, record, index) {
        return <>{moment(record.tanggal_bayar).format("MMYYYY")}</>;
      },
    },
    {
      title: "PEMOHON",
      dataIndex: ["DataPengajuan", "nama"],
      key: "pemohon",
      className: "text-xs",
      width: 200,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
    },
    {
      title: "NOPEN",
      dataIndex: ["DataPengajuan", "nopen"],
      key: "nopen",
      className: "text-xs",
      width: 150,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
    },
    {
      title: "ANGSURAN",
      dataIndex: "angsuran",
      key: "angsuran",
      className: "text-xs text-right",
      width: 100,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
      render(value, record, index) {
        return IDRFormat(value);
      },
    },
    {
      title: "ANGSURAN KE",
      dataIndex: "angsuran_ke",
      key: "ke",
      className: "text-xs text-center",
      width: 100,
      onHeaderCell: () => {
        return {
          ["style"]: {
            textAlign: "center",
            fontSize: 13,
          },
        };
      },
    },
  ];
  return (
    <div>
      <div className="bg-orange-500 text-gray-50 font-bold px-1 py-2">
        <p>MANAGEMENT TAGIHAN</p>
      </div>
      <div className="flex justify-between gap-2 my-1 overflow-auto">
        <div className="flex-1 flex gap-2 items-center">
          <DatePicker
            size="small"
            picker="month"
            onChange={(_, dateStr) => dateStr && setBackdate(dateStr + "-10")}
          />
          <Select
            placeholder="SUMDAN"
            size="small"
            style={{ width: 170 }}
            options={sumdans.map((s) => ({ label: s.kode, value: s.id }))}
            onChange={(e) => setSumdanId(e)}
            allowClear
            value={sumdanId}
          />
          <Select
            placeholder="BLOKIR"
            size="small"
            style={{ width: 170 }}
            options={[
              { label: "INCLUDE BLOKIR", value: "INCLUDE BLOKIR" },
              { label: "EXCLUDE BLOKIR", value: "EXCLUDE BLOKIR" },
            ]}
            onChange={(e) => setStatus(e)}
            allowClear
            value={status}
          />
          <Upload
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .csv"
            customRequest={handleUpload}
            showUploadList={false}
            multiple={false}
          >
            <Button
              icon={<CloudUploadOutlined />}
              type="primary"
              loading={loading}
              size="small"
            >
              Cek Tagihan
            </Button>
          </Upload>
          <Button
            icon={<PrinterFilled />}
            type="primary"
            loading={loading}
            size="small"
          >
            Cetak
          </Button>
        </div>
        <Input.Search
          style={{ width: 170 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
        />
      </div>
      <Table
        size="small"
        bordered
        rowKey={"id"}
        columns={columns}
        dataSource={data}
        scroll={{ x: "max-content", y: 350 }}
        pagination={{
          size: "small",
          total: total,
          pageSizeOptions: [50, 100, 500, 1000, 10000],
          defaultPageSize: pageSize,
          onChange(page: any, pageSize: any) {
            setPage(page);
            setPageSize(pageSize);
          },
          showTotal(total: any, range: any) {
            return (
              <div className="flex gap-2 text-xs italic mt-1">
                <span>show</span>
                <span>{range[0]}</span>
                <span>-</span>
                <span>{range[1]}</span>
                <span>dari : {total}</span>
              </div>
            );
          },
        }}
        loading={loading}
      />
    </div>
  );
}
