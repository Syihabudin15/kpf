"use client";
import { LoadingOutlined } from "@ant-design/icons";
import { Role } from "@prisma/client";
import { DatePicker, Form, Input, Modal, Table, TableProps, message } from "antd";
import { useContext, useEffect, useState } from "react";
import { formatNumber } from "@/components/utils/inputUtils";
import moment from "moment";
import { notifContext } from "@/components/NotifContext";
import {
  BankWithDataPengajuan,
  DataDataPengajuan,
} from "@/components/utils/Interfaces";


export default function CetakPengajuanSI({ role }: { role: Role }) {
  const [data, setData] = useState<BankWithDataPengajuan[]>();
  const [loading, setLoading] = useState(false);
  const [modalCetak, setModalCetak] = useState(false);
  const [selectedRow, setSelectedRow] = useState<React.Key[]>([]);
  const [selectedDatas, setSelectedDatas] = useState<BankWithDataPengajuan[]>(
    []
  );
  const [tanggalSI, setTanggalSI] = useState<string>();
  const [nomorSurat, setNomorSurat] = useState<string>();
  const ntf = useContext(notifContext);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(`/api/ops/si-pencairan`);
    const result = await res.json();
    setData(
      result.map((d: BankWithDataPengajuan) => {
        return { ...d, key: d.id };
      })
    );
    setLoading(false);
  };
  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, []);

  // Handle Cetak Berkas SI
  const handleCetak = async (e: any) => {
    if (selectedDatas && selectedDatas[0].DataPengajuan.length == 0) {
      return;
    }
    let dataPengajuanIds: string[] = [];
    selectedDatas[0].DataPengajuan.forEach((p) => {
      dataPengajuanIds.push(p.id);
    });
    setLoading(true);
    const res = await fetch("/api/ops/si-pencairan", {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({
        nomor_surat: nomorSurat,
        id: selectedDatas[0].id,
        tanggal_cetak: tanggalSI || new Date(),
        pengajuans: dataPengajuanIds,
      }),
    });
    const result = await res.json();
    if (res.ok) {
      message.success(result.msg);
      await ntf.getNotifFunction();
      setModalCetak(false);
      await getData();
    } else {
      message.error(result.msg);
    }
    setLoading(false);
  };

  const columns: TableProps<BankWithDataPengajuan>["columns"] = [
    {
      title: "NO",
      dataIndex: "no",
      key: "no",
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
        return <>{index + 1}</>;
      },
    },
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
      title: "NOPEN",
      dataIndex: "nopen",
      key: "nopen",
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
    // {
    //   title: "CASH COLL TBO JAMINAN",
    //   dataIndex: "cash_coll",
    //   key: "cash_coll",
    //   onHeaderCell: (text, record) => {
    //     return {
    //       ["style"]: {
    //         textAlign: "center",
    //       },
    //     };
    //   },
    //   className: "text-center",
    //   render(value, record, index) {
    //     return <>{formatNumber((0).toFixed(0))}</>;
    //   },
    // },
    // {
    //   title: "DROPPING MITRA BANK",
    //   dataIndex: "dropping_mitra",
    //   key: "dropping_mitra",
    //   onHeaderCell: (text, record) => {
    //     return {
    //       ["style"]: {
    //         textAlign: "center",
    //       },
    //     };
    //   },
    //   className: "text-center",
    //   render(value, record, index) {
    //     return <>{formatNumber((0).toFixed(0))}</>;
    //   },
    // },
    // {
    //   title: "DROPPING NASABAH",
    //   dataIndex: "dropping_nasabah",
    //   key: "dropping_nasabah",
    //   onHeaderCell: (text, record) => {
    //     return {
    //       ["style"]: {
    //         textAlign: "center",
    //       },
    //     };
    //   },
    //   className: "text-center",
    //   render(value, record, index) {
    //     return <>{formatNumber((0).toFixed(0))}</>;
    //   },
    // },
    // {
    //   title: "BERKAS PENGAJUAN",
    //   dataIndex: "berkas_pengajuan",
    //   key: "berkas_pengajuan",
    //   onHeaderCell: (text, record) => {
    //     return {
    //       ["style"]: {
    //         textAlign: "center",
    //       },
    //       className: "example-class-in-td",
    //     };
    //   },
    //   render(value, record, index) {
    //     return (
    //       <ViewBerkasPengajuan data={record} role={role} allowForm={false} />
    //     );
    //   },
    // },
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

      <Table
        columns={columns}
        dataSource={data}
        bordered
        scroll={{ x: 1000, y: 'calc(65vh - 100px)' }}
        loading={loading}
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
                // scroll={{ x: 1000 }}
                pagination={false}
              />
            );
          },
        }}
      />

      <Modal
        open={modalCetak}
        onCancel={() => setModalCetak(false)}
        title="CETAK BERKAS SI"
        footer={[]}
      >
        <div>
          <div className="font-bold bg-orange-500 text-white text-center my-2 py-2">
            {selectedDatas.length > 0 && selectedDatas[0].name}
          </div>
          <Form labelCol={{ span: 6 }} onFinish={handleCetak}>
            <Form.Item label="Tanggal Cetak" required>
              <DatePicker
                // type="date"
                required
                format="DD/MM/YYYY"
                onChange={(date:any, dateString:any) => {
                  let split = dateString ? dateString.split("/") : moment().format("MM/DD/YYYY").split("/");
                  let result = moment([split[2], split[1]-1, split[0]]).format("YYYY-MM-DD");
                  setTanggalSI(result);
                  setNomorSurat(`/SI/KPF-${selectedDatas && selectedDatas[0].kode}/${moment(result).format("DDMMYYYY")}`)
                }}
              />
            </Form.Item>
            <Form.Item label="Nomor Surat" required>
              <Input
                required
                value={nomorSurat}
                onChange={(e) => setNomorSurat(e.target.value)}
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
                // key={1}
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
