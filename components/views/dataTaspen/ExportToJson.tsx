"use client";
import { formatNumber } from "@/components/utils/inputUtils";
import { CloudUploadOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  GetProp,
  Progress,
  Spin,
  Table,
  TableProps,
  Upload,
  UploadProps,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import TableTaspen from "./TableTaspen";
import axios from "axios";
import { DataDataTaspen } from "@/components/utils/Interfaces";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const beforeUploadSheet = (file: FileType) => {
  const isJpgOrPng =
    file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.type === "text/csv";
  if (!isJpgOrPng) {
    message.error("Hanya menerima Sheet file!");
  }
  return isJpgOrPng;
};

const getBase64 = (file: any) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      resolve(reader.result);
    };
    reader.onerror = (info) => {
      console.log(info);
      reject;
    };
  });

export default function ExportToJson() {
  const [currData, setCurrData] = useState<any[]>();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DataDataTaspen[]>();
  const [name, setName] = useState<string>();
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>();
  const [progres, setProgres] = useState<number>();

  const handleChange = async (options: any) => {
    const { onSuccess, onError, file, onProgress } = options;
    try {
      setProgres(1);
      setLoading(true);
      const base64 = await getBase64(file);
      setLoading(false);
      const res = await axios.post(
        "/api/data-taspen",
        {
          url: base64,
        },
        {
          headers: { "Content-Type": "Application/json" },
          onUploadProgress: (event: any) => {
            const percent = Math.floor((event.loaded / event.total) * 100);
            setProgres(percent);
            console.log(percent);
            if (percent === 100) {
              setProgres(100);
            }
            onProgress({ percent: (event.loaded / event.total) * 100 });
            onError(setProgres(0));
          },
        }
      );
      onError(setProgres(0));

      setCurrData(
        res.data.result.map((d: any, ind: number) => {
          return { ...d, key: ind };
        })
      );
      setLoading(false);
      console.log(res.data);
    } catch (err) {
      setLoading(false);
      console.log({ err });
      message.error("Failed!");
      setProgres(0);
    }
  };
  const handleSave = async () => {
    setLoading(true);
    const res = await fetch("/api/data-taspen", {
      method: "PUT",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify(currData),
    });
    const result = await res.json();
    if (res.ok) {
      notification.success({ message: result.msg });
      setCurrData([]);
    } else {
      notification.error({ message: result.msg });
    }
    setLoading(false);
  };
  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/master/data-taspen${page ? "?page=" + page : ""}${
        name ? (page ? "&name=" + name : "?name=" + name) : ""
      }`
    );
    const { data, total } = await res.json();
    setTotal(total);
    setData(
      data.map((d: DataDataTaspen) => {
        return { ...d, key: d.id };
      })
    );
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [currData, page, name]);

  return (
    <Spin spinning={loading}>
      <div>
        {!currData && (
          <div className="flex w-50 justify-between px-5 py-1">
            <p>Upload Berkas: </p>

            <Upload
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .csv"
              beforeUpload={beforeUploadSheet}
              customRequest={handleChange}
              showUploadList={false}
              onRemove={() => setCurrData([])}
              multiple={false}
              disabled={currData ? true : false}
            >
              {progres ? (
                <Progress percent={progres} />
              ) : (
                <Button
                  icon={<CloudUploadOutlined />}
                  loading={loading}
                  disabled={loading}
                >
                  Browse
                </Button>
              )}
            </Upload>
          </div>
        )}
        {currData ? (
          <div className="px-2">
            <Table
              columns={columns}
              dataSource={currData}
              scroll={{ x: 3000, y: 290 }}
              size="small"
              bordered
              loading={loading}
              expandable={{
                expandedRowRender: (record) => {
                  return (
                    <Table
                      columns={columnsExpand}
                      dataSource={record.KELUARGA}
                      bordered
                      pagination={false}
                      size="small"
                    />
                  );
                },
              }}
            />
          </div>
        ) : (
          <div className="px-2">
            <TableTaspen
              data={data ? data : []}
              loading={loading}
              setPage={setPage}
              setName={setName}
              total={total ? total : 0}
              name={name || ""}
            />
          </div>
        )}
        <div className="flex justify-end p-5">
          {currData && (
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded"
              onClick={() => handleSave()}
              disabled={loading}
            >
              {loading ? <LoadingOutlined /> : "Simpan"}
            </button>
          )}
        </div>
      </div>
    </Spin>
  );
}

const columns: TableProps["columns"] = [
  {
    title: "Nama",
    dataIndex: "NAMA_PENERIMA",
    key: "nama",
  },
  {
    title: "Nopen",
    dataIndex: "NOTAS",
    key: "notas",
  },
  { title: "Jenis Dapem", dataIndex: "JNSDAPEM", key: "jns_dapem" },
  { title: "Jenis Pensiun", dataIndex: "JNSPENS", key: "jns_pens" },
  { title: "Pangkat/Golongan", dataIndex: "PANGKAT", key: "pangkat" },
  {
    title: "JANDADUDAYPDARI",
    dataIndex: "JANDADUDAYPDARI",
    key: "jandadudaypdari",
  },
  { title: "Alamat", dataIndex: "ALAMATRUMAH", key: "alamat" },
  { title: "KTRBAY Dapem", dataIndex: "KTRBAYDAPEM", key: "ktr_dapem" },
  { title: "Jenis Dapem", dataIndex: "JNSDAPEM", key: "jenisDapem" },
  { title: "NUDAPEM", dataIndex: "NUDAPEM", key: "nudapem" },
  { title: "Status Dapem", dataIndex: "STSDAPEM", key: "statusdapem" },
  {
    title: "Status Peserta",
    dataIndex: "STATUS_PESERTA",
    key: "status_peserta",
  },
  { title: "NIPNRP", dataIndex: "NIPNRP", key: "NIPNRP" },
  { title: "No SKEP", dataIndex: "NOSKEP", key: "skep" },
  { title: "Jenis Pensiun", dataIndex: "JNSPENS", key: "jenis_pensiun" },
  { title: "Kode Jiwa", dataIndex: "KDJIWA", key: "kode_jiwa" },
  { title: "Kantor Cabang", dataIndex: "KANTOR_CABANG", key: "kantor_cabang" },
  { title: "Alamat Cabang", dataIndex: "ALAMAT_CABANG", key: "alamat_cabang" },
  {
    title: "Jumlah Total",
    dataIndex: "JMLTOTAL",
    key: "total",
    render(value, record, index) {
      return <>{value && formatNumber(value.toString())}</>;
    },
  },
  {
    title: "Jumlah Kotor",
    dataIndex: "JMLKOTOR",
    key: "kotor",
    render(value, record, index) {
      return <>{value && formatNumber(value.toString())}</>;
    },
  },
  {
    title: "Penpok",
    dataIndex: "PENPOK",
    key: "penpok",
    render(value, record, index) {
      return <>{value && formatNumber(value.toString())}</>;
    },
  },
];

const columnsExpand: TableProps["columns"] = [
  { title: "Nama Keluarga", dataIndex: "NAMA_KELUARGA", key: "nama_keluarga" },
  { title: "No KK", dataIndex: "NO_KK", key: "no_kk" },
  { title: "No KTP", dataIndex: "NO_KTP", key: "no_ktp" },
  { title: "No SKEP", dataIndex: "NO_SKEP", key: "no_skep" },
  { title: "NPWP", dataIndex: "NPWP", key: "npwp_keluarga" },
  {
    title: "Tanggal Lahir",
    dataIndex: "TGL_LAHIR",
    key: "tanggal_lahir_keluarga",
  },
  {
    title: "Tanggal Wafat",
    dataIndex: "TGL_WAFAT",
    key: "tanggal_wafat_keluarga",
  },
  {
    title: "Hak Bagi",
    dataIndex: "HAKBAGI_PENSIUN",
    key: "hak_bagi",
    render(value, record, index) {
      return <>{value && value} %</>;
    },
  },
  { title: "Kode Tunjang", dataIndex: "KODE_TUNJANG", key: "kode_tunjang" },
  { title: "Keterangan", dataIndex: "KETERANGAN", key: "keterangan" },
  { title: "Gelar Depan", dataIndex: "GELAR_DEPAN", key: "gelar_depan" },
  { title: "Gelar Akhir", dataIndex: "GELAR_AKHIR", key: "gelar_akhir" },
  { title: "TAT Tunjang", dataIndex: "TAT_TUNJANG", key: "tat_keluarga" },
  { title: "TMT Tunjang", dataIndex: "TMT_TUNJANG", key: "tmt_keluarga" },
];
