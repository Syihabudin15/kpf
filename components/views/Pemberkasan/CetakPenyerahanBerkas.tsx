"use client";
import { LoadingOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  Modal,
  Table,
  TableProps,
  message,
  notification,
} from "antd";
import { useContext, useEffect, useState } from "react";
import { formatNumber } from "@/components/utils/inputUtils";
import moment from "moment";
import { notifContext } from "@/components/NotifContext";
import {
  BankWithDataPengajuan,
  DataDataPengajuan,
} from "@/components/utils/Interfaces";

export default function CetakPenyerahanBerkas() {
  const [data, setData] = useState<BankWithDataPengajuan[]>();
  const [loading, setLoading] = useState(false);
  const [modalCetak, setModalCetak] = useState(false);
  const [selectedRow, setSelectedRow] = useState<React.Key[]>([]);
  const [selectedDatas, setSelectedDatas] = useState<BankWithDataPengajuan[]>(
    []
  );
  const [tanggalSI, setTanggalSI] = useState<string>();
  const ntf = useContext(notifContext);
  const [total, setTotal] = useState(0);
  const [page, setpage] = useState(1);
  const [nomor, setNomor] = useState<string>();

  const getData = async () => {
    setLoading(true);
    const res = await fetch(`/api/pemberkasan/cetak-berkas?page=${page}`);
    const { data, total } = await res.json();
    setData(
      data.map((d: BankWithDataPengajuan) => {
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
  }, [page]);

  // Handle Cetak Berkas SI
  const handleCetak = async () => {
    if (selectedDatas && selectedDatas[0].DataPengajuan.length == 0) {
      return;
    }
    let dataPengajuanIds: string[] = [];
    selectedDatas[0].DataPengajuan.forEach((p) => {
      dataPengajuanIds.push(p.id);
    });
    setLoading(true);
    const res = await fetch("/api/pemberkasan/cetak-berkas", {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({
        id: selectedDatas[0].id,
        tanggal_cetak: new Date(tanggalSI || ""),
        nomor_surat: nomor,
        pengajuans: dataPengajuanIds,
      }),
    });
    const result = await res.json();
    if (res.ok) {
      notification.success({ message: result.msg });
      ntf.getNotifFunction();
      setModalCetak(false);
      await getData();
    } else {
      notification.error({ message: result.msg });
    }
    setLoading(false);
  };

  const columns: TableProps<BankWithDataPengajuan>["columns"] = [
    {
      title: "NAMA BANK",
      dataIndex: "name",
      key: "name",
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
      title: "JUMLAH END USER",
      dataIndex: "jumlah",
      key: "jumlah",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      render(value, record, index) {
        return <>{record.DataPengajuan.length}</>;
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
      render(value, record, index) {
        let totalPlafond = 0;
        record.DataPengajuan.forEach((plaf) => {
          totalPlafond += plaf.DataPembiayaan.plafond;
        });
        return <>Rp. {formatNumber(totalPlafond.toFixed(0))}</>;
      },
    },
  ];
  const columnsExpanded: TableProps<DataDataPengajuan>["columns"] = [
    {
      title: "UNIT PELAYANAN",
      dataIndex: "up",
      key: "up",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      render(value, record, index) {
        return <>{record.User.UnitCabang.name}</>;
      },
    },
    {
      title: "NOPEN",
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
      title: "TANGGAL AKAD",
      dataIndex: "tanggal_akad",
      key: "tanggal_akad",
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
            {record.tanggal_cetak_akad &&
              moment(record.tanggal_cetak_akad).format("DD-MM-YYYY")}
          </>
        );
      },
    },
    {
      title: "NO AKAD",
      dataIndex: "no_akad",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
        };
      },
      className: "text-center",
      key: "no_akad",
      render(value, record, index) {
        return <>{record.nomor_akad}</>;
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
        return <>{record.DataPembiayaan.tenor} Bulan</>;
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
  ];
  return (
    <section className="px-2">
      <div className="flex gap-5 my-2 mx-1">
        <button
          className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-2 rounded shadow"
          onClick={() => {
            if (selectedDatas.length == 0) {
              return message.error("Mohon pilih satu data!");
            }
            setModalCetak(true);
          }}
        >
          Cetak Surat
        </button>
      </div>

      <div className="p-2">
        <Table
          columns={columns}
          dataSource={data}
          bordered
          scroll={{ x: 500, y: "calc(62vh - 100px)" }}
          loading={loading}
          pagination={{
            pageSize: 20,
            total,
            onChange(page, pageSize) {
              setpage(page);
            },
          }}
          rowSelection={{
            selectedRowKeys: selectedRow,
            onChange(selectedRowKeys, selectedRows, info) {
              if (selectedRows.length > 1) {
                message.error("Hanya dapat memilih satu data!");
                return;
              }
              setSelectedRow(selectedRowKeys);
              setSelectedDatas(selectedRows);
            },
          }}
          expandable={{
            expandedRowRender: (record) => {
              return (
                <Table
                  columns={columnsExpanded}
                  dataSource={record.DataPengajuan.map((e) => {
                    return { ...e, key: e.id };
                  })}
                  bordered
                  size="small"
                  scroll={{ x: 1500 }}
                  pagination={false}
                />
              );
            },
          }}
        />
      </div>

      <Modal
        open={modalCetak}
        onCancel={() => setModalCetak(false)}
        title="CETAK PENYERAHAN BERKAS"
        footer={[]}
      >
        <div>
          <div className="font-bold bg-orange-500 text-white text-center my-2 py-2">
            {selectedDatas.length > 0 && selectedDatas[0].name}
          </div>
          <Form labelCol={{ span: 6 }} onFinish={handleCetak}>
            <Form.Item label="Tanggal Cetak" required>
              <Input
                type="date"
                required
                onChange={(e) => {
                  setTanggalSI(e.target.value);
                  setNomor(
                    `/SURAT_BERKAS/KPF-${
                      selectedDatas && selectedDatas[0].kode
                    }/${moment(e.target.value).format("DDMMYYYY")}`
                  );
                }}
              />
            </Form.Item>
            <Form.Item label="Nomor Surat" required>
              <Input
                required
                value={nomor}
                onChange={(e) => setNomor(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="End User" required>
              <Input
                value={
                  selectedDatas.length > 0
                    ? selectedDatas[0].DataPengajuan.length
                    : 0
                }
                required
                disabled
                style={{ backgroundColor: "white", color: "black" }}
              />
            </Form.Item>
            <Form.Item className="flex justify-end mt-3">
              <button
                type="submit"
                key={1}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded shadow py-1 px-4"
                disabled={loading}
              >
                {loading ? <LoadingOutlined /> : "Submit"}
              </button>
              ,
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </section>
  );
}
