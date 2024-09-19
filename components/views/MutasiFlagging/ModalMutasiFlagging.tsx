import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { FormOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select } from "antd";
import { useState } from "react";
import UploadBerkas from "../operasionals/news/UploadBerkas";
import moment from "moment";

export default function ModalMutasiFlagging({
  data,
  getData,
}: {
  data: DataDataPengajuan;
  getData: Function;
}) {
  const [openModal, setOpenModal] = useState(false);
  const [url, setUrl] = useState({ berkas_mutasi: "", flagging: "" });
  const [loading, setLoading] = useState(false);

  const handleFinish = async (e: any) => {
    setLoading(true);
    console.log({ e });
    const res = await fetch("/api/mutasi-flagging", {
      method: "PUT",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({
        ...url,
        tanggal_flagging: new Date(e.tanggal_flagging).toISOString(),
        tanggal_mutasi: new Date(e.tanggal_mutasi).toISOString(),
        status_flagging: e.status_flagging,
        status_mutasi: e.status_mutasi,
        id: data.berkasPengajuanId,
      }),
    });
    if (!res.ok) {
      const result = await res.json();
      Modal.error({
        title: <span className="text-red-500">Internal server error</span>,
        closable: true,
        footer: [],
        content: (
          <div>
            <p>{result.msg}</p>
          </div>
        ),
      });
      return;
    }
    Modal.success({
      title: <span className="text-green-500">Update Berhasil</span>,
      closable: true,
      footer: [],
      content: (
        <div>
          <p>Data berhasil diupdate..!</p>
        </div>
      ),
    });
    setOpenModal(false);
    await getData();
    setLoading(false);
  };

  return (
    <div>
      <Button
        type="primary"
        icon={<FormOutlined />}
        onClick={() => setOpenModal(true)}
      ></Button>
      <Modal
        title={`EDIT STATUS ${data.nama}`}
        open={openModal}
        onClose={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}
        footer={[]}
      >
        <Form labelCol={{ span: 6 }} className="my-3" onFinish={handleFinish}>
          <Form.Item label="Tanggal Mutasi" name={"tanggal_mutasi"}>
            <Input
              type="date"
              defaultValue={moment(data.BerkasPengajuan.tanggal_mutasi).format(
                "YYYY-MM-DD"
              )}
            />
          </Form.Item>
          <Form.Item label="Status Mutasi" name={"status_mutasi"}>
            <Select
              options={[
                { label: "PROSES", value: "PROSESS" },
                { label: "BELUM PROSES", value: "BELUM_PROSESS" },
                { label: "SELESAI", value: "SELESAI" },
                { label: "GAGAL", value: "GAGAL" },
              ]}
              defaultValue={data.BerkasPengajuan.status_mutasi}
            />
          </Form.Item>
          <Form.Item label="Berkas Mutasi" name={"berkas_mutasi"}>
            <UploadBerkas
              url="/api/ops/uploads/mutasi"
              dir="mutasi"
              name=""
              id={data.berkasPengajuanId || ""}
              ext="pdf"
              fileType={"application/pdf"}
              filePath={data.BerkasPengajuan.mutasi}
              pathName="berkas_mutasi"
              setUrl={setUrl}
            />
          </Form.Item>
          <Form.Item label="Tanggal Flagging" name={"tanggal_flagging"}>
            <Input
              type="date"
              defaultValue={moment(
                data.BerkasPengajuan.tanggal_flagging
              ).format("YYYY-MM-DD")}
            />
          </Form.Item>
          <Form.Item label="Status Flagging" name={"status_flagging"}>
            <Select
              options={[
                { label: "PROSES", value: "PROSESS" },
                { label: "BELUM PROSES", value: "BELUM_PROSESS" },
                { label: "SELESAI", value: "SELESAI" },
                { label: "GAGAL", value: "GAGAL" },
              ]}
              defaultValue={data.BerkasPengajuan.status_flagging}
            />
          </Form.Item>
          <Form.Item label="Berkas Flagging" name={"berkas_flagging"}>
            <UploadBerkas
              url="/api/ops/uploads/flagging"
              dir="flagging"
              name=""
              id={data.berkasPengajuanId || ""}
              ext="pdf"
              fileType={"application/pdf"}
              filePath={data.BerkasPengajuan.flagging}
              pathName="berkas_flagging"
              setUrl={setUrl}
            />
          </Form.Item>
          <div>
            <Button
              block
              type="primary"
              htmlType="submit"
              loading={loading}
              className="font-bold text-xs"
            >
              SUBMIT
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
