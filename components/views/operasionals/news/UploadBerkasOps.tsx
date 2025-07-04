"use client";
import { notifContext } from "@/components/NotifContext";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { LoadingOutlined } from "@ant-design/icons";
import { Input, Modal, message } from "antd";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";

const UploadBerkas = dynamic(
  () => import("@/components/views/operasionals/news/UploadBerkas"),
  { ssr: false, loading: () => <LoadingOutlined /> }
);

interface URLS {
  berkas_akad?: string;
  tanggal_akad?: string;
  pelunasan?: string;
  tanggal_pelunasan?: string;
  jaminan?: string;
  tanggal_jaminan?: string;
  rekening?: string;
  tanggal_rekening?: string;
  no_rekening?: string;
  nama_bank?: string;
  mutasi?: string;
  tanggal_mutasi?: string;
  flagging?: string;
  tanggal_flagging?: string;
  bukti_cair?: string;
  tanggal_bukti_cair?: string;
  video_akad?: string;
  tanggal_video_akad?: string;
  video_cair?: string;
  tanggal_video_cair?: string;
  berkas_lainnya?: string;
  tanggal_berkas_lainnya?: string;
  video_cair2?: string;
  tanggal_video_cair2?: string;
  video_cair3?: string;
  tanggal_video_cair3?: string;
  epotpen?: string;
  tanggal_epotpen?: string;
}

export default function UploadBerksOps({
  data,
  getData,
  open,
  setOpen,
  setSelected,
}: {
  data: DataDataPengajuan;
  getData: Function;
  open: boolean;
  setOpen: Function;
  setSelected: Function;
}) {
  const [urls, setUrls] = useState<URLS>();
  const [loading, setLoading] = useState(false);
  const notif = useContext(notifContext);

  useEffect(() => {
    setUrls({
      berkas_akad: data.BerkasPengajuan.berkas_akad || undefined,
      tanggal_akad: data.BerkasPengajuan.tanggal_akad || undefined,
      pelunasan: data.BerkasPengajuan.pelunasan || undefined,
      tanggal_pelunasan:
        data.BerkasPengajuan.tanggal_pelunasan?.toString() || undefined,
      jaminan: data.BerkasPengajuan.jaminan || undefined,
      tanggal_jaminan:
        data.BerkasPengajuan.tanggal_jaminan?.toString() || undefined,
      rekening: data.BerkasPengajuan.rekening || undefined,
      tanggal_rekening:
        data.BerkasPengajuan.tanggal_rekening?.toString() || undefined,
      no_rekening: data.BerkasPengajuan.no_rekening || undefined,
      nama_bank: data.BerkasPengajuan.nama_bank || undefined,
      mutasi: data.BerkasPengajuan.mutasi || undefined,
      tanggal_mutasi:
        data.BerkasPengajuan.tanggal_mutasi?.toString() || undefined,
      flagging: data.BerkasPengajuan.flagging || undefined,
      tanggal_flagging:
        data.BerkasPengajuan.tanggal_flagging?.toString() || undefined,
      bukti_cair: data.BerkasPengajuan.bukti_cair || undefined,
      tanggal_bukti_cair:
        data.BerkasPengajuan.tanggal_bukti_cair?.toString() || undefined,
      video_akad: data.BerkasPengajuan.video_akad || undefined,
      tanggal_video_akad:
        data.BerkasPengajuan.tanggal_video_akad?.toString() || undefined,
      video_cair: data.BerkasPengajuan.video_cair || undefined,
      tanggal_video_cair:
        data.BerkasPengajuan.tanggal_video_cair?.toString() || undefined,
      video_cair2: data.BerkasPengajuan.video_cair2 || undefined,
      tanggal_video_cair2:
        data.BerkasPengajuan.tanggal_video_cair2?.toString() || undefined,
      video_cair3: data.BerkasPengajuan.video_cair3 || undefined,
      tanggal_video_cair3:
        data.BerkasPengajuan.tanggal_video_cair3?.toString() || undefined,
      epotpen: data.BerkasPengajuan.epotpen || undefined,
      tanggal_epotpen:
        data.BerkasPengajuan.tanggal_epotpen?.toString() || undefined,
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    const res = await fetch("/api/ops/uploads", {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({
        ...urls,
        id: data.berkasPengajuanId,
        dataPengajuanId: data.id,
      }),
    });
    if (res.ok) {
      message.success("Upload Berkas Berhasil");
      setOpen(false);
      setLoading(false);
      await getData();
      await notif.getNotifFunction();
      setSelected(undefined);
    } else {
      message.error("Upload Failed!");
      setLoading(false);
    }
  };

  return (
    <div key={data.id}>
      <Modal
        open={open}
        onCancel={() => {
          setSelected(undefined);
          setOpen(false);
        }}
        footer={[]}
        title={`UPLOAD DOKUMEN PENGAJUAN ${
          data.nama && data.nama.toUpperCase()
        }`}
        style={{ top: 20 }}
        width={window.innerWidth < 600 ? "90vw" : "50vw"}
      >
        <div className="w-full" style={{ minHeight: "75vh" }}>
          <div>
            <UploadBerkas
              pathName="berkas_akad"
              name="Upload Berkas Akad"
              url="/api/ops/uploads/berkas_akad"
              dir="akad"
              id={data.berkasPengajuanId as string}
              ext="pdf"
              fileType="application/pdf"
              filePath={(urls && urls["berkas_akad"]) || null}
              setUrl={setUrls}
            />
          </div>
          <div>
            <UploadBerkas
              pathName="pelunasan"
              name="Upload Berkas Pelunasan"
              url="/api/ops/uploads/pelunasan"
              dir="pelunasan"
              id={data.berkasPengajuanId as string}
              ext="pdf"
              fileType="application/pdf"
              filePath={(urls && urls["pelunasan"]) || null}
              setUrl={setUrls}
            />
          </div>
          <div>
            <UploadBerkas
              pathName="jaminan"
              name="Upload Berkas Jaminan"
              url="/api/ops/uploads/jaminan"
              dir="jaminan"
              id={data.berkasPengajuanId as string}
              ext="pdf"
              fileType="application/pdf"
              filePath={data.BerkasPengajuan.jaminan}
              setUrl={setUrls}
            />
          </div>
          <div>
            <UploadBerkas
              pathName="rekening"
              name="Upload Berkas Buku Rekening"
              url="/api/ops/uploads/rekening"
              dir="rekening"
              id={data.berkasPengajuanId as string}
              ext="pdf"
              fileType="application/pdf"
              filePath={data.BerkasPengajuan.rekening}
              setUrl={setUrls}
            />
          </div>
          <div className="px-3">
            <div className="flex items-center gap-5 mt-2 pb-1 border-b border-gray-400">
              <span className="w-36">No Rekening</span>
              <Input
                value={urls?.no_rekening}
                onChange={(e) =>
                  setUrls((prev) => {
                    return { ...prev, no_rekening: e.target.value };
                  })
                }
              />
            </div>
            <div className="flex items-center gap-5 mt-1 border-b border-gray-400">
              <span className="w-36">Nama Bank</span>
              <Input
                value={urls?.nama_bank}
                onChange={(e) =>
                  setUrls((prev) => {
                    return { ...prev, nama_bank: e.target.value };
                  })
                }
              />
            </div>
          </div>
          <div>
            <UploadBerkas
              pathName="mutasi"
              name="Upload Berkas Mutasi"
              url="/api/ops/uploads/mutasi"
              dir="mutasi"
              id={data.berkasPengajuanId as string}
              ext="pdf"
              fileType="application/pdf"
              filePath={data.BerkasPengajuan.mutasi}
              setUrl={setUrls}
            />
          </div>
          <div>
            <UploadBerkas
              pathName="flagging"
              name="Upload Berkas Flagging"
              url="/api/ops/uploads/flagging"
              dir="flagging"
              id={data.berkasPengajuanId as string}
              ext="pdf"
              fileType="application/pdf"
              filePath={data.BerkasPengajuan.flagging}
              setUrl={setUrls}
            />
          </div>
          <div>
            <UploadBerkas
              pathName="bukti_cair"
              name="Upload Berkas Bukti Cair"
              url="/api/ops/uploads/bukti_cair"
              dir="cair"
              id={data.berkasPengajuanId as string}
              ext="pdf"
              fileType="application/pdf"
              filePath={data.BerkasPengajuan.bukti_cair}
              setUrl={setUrls}
            />
          </div>
          <div>
            <UploadBerkas
              pathName="video_akad"
              name="Upload Video Akad"
              url="/api/ops/uploads/video_akad"
              dir="video_akad"
              id={data.berkasPengajuanId as string}
              ext="mp4"
              fileType="video/mp4"
              filePath={data.BerkasPengajuan.video_akad}
              setUrl={setUrls}
            />
          </div>
          <div>
            <UploadBerkas
              pathName="video_cair"
              name="Upload Video Cair"
              url="/api/ops/uploads/video_cair"
              dir="video_cair"
              id={data.berkasPengajuanId as string}
              ext="mp4"
              fileType="video/mp4"
              filePath={data.BerkasPengajuan.video_cair}
              setUrl={setUrls}
            />
          </div>
          <div>
            <UploadBerkas
              pathName="video_cair2"
              name="Upload Video Cair 2"
              url="/api/ops/uploads/video_cair2"
              dir="video_cair2"
              id={data.berkasPengajuanId as string}
              ext="mp4"
              fileType="video/mp4"
              filePath={data.BerkasPengajuan.video_cair2}
              setUrl={setUrls}
            />
          </div>
          <div>
            <UploadBerkas
              pathName="video_cair3"
              name="Upload Video Cair 3"
              url="/api/ops/uploads/video_cair3"
              dir="video_cair3"
              id={data.berkasPengajuanId as string}
              ext="mp4"
              fileType="video/mp4"
              filePath={data.BerkasPengajuan.video_cair3}
              setUrl={setUrls}
            />
          </div>
          <div>
            <UploadBerkas
              pathName="epotpen"
              name="Upload Berkas Epotpen"
              url="/api/ops/uploads/epotpen"
              dir="epotpen"
              id={data.berkasPengajuanId || ""}
              ext="pdf"
              fileType="application/pdf"
              filePath={data.BerkasPengajuan.epotpen || urls?.epotpen || ""}
              setUrl={setUrls}
            />
          </div>
          <div className="flex justify-end mt-10">
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded shadow"
              disabled={loading}
              onClick={() => handleSave()}
            >
              {loading ? <LoadingOutlined /> : "Simpan"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
