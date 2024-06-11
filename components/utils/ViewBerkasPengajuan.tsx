"use client";
import { Role } from "@prisma/client";
import { Modal, Tabs, TabsProps } from "antd";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { DataDataPengajuan } from "./Interfaces";
import Mauk from "../views/dataPdf/Mauk";

const DataPembanding = dynamic(
  () => import("@/components/views/dataPdf/DataPembanding"),
  { loading: () => <LoadingOutlined />, ssr: false }
);
const FormPengajuan = dynamic(
  () => import("@/components/utils/FormPengajuan"),
  {
    loading: () => <LoadingOutlined />,
    ssr: false,
  }
);

export default function BerkasTabsPengajuan({
  data,
  role,
  allowForm,
  isPeriksa,
  pathname,
  getData,
  nextpath,
  open,
  setOpen,
}: {
  data: DataDataPengajuan;
  role: Role;
  allowForm: boolean;
  isPeriksa?: boolean;
  pathname?: string;
  getData?: Function;
  nextpath?: string;
  open: boolean;
  setOpen: Function;
}) {
  // const [open, setOpen] = useState(false);

  const bankItems: TabsProps["items"] = [
    {
      key: "data-pembanding",
      label: "Data Pembanding",
      children: (
        <div style={{ height: "70vh" }}>
          <DataPembanding data={data.DataTaspen} />
        </div>
      ),
    },
    {
      key: "slik",
      label: "Berkas Slik",
      children: (
        <div style={{ height: "70vh" }}>
          {data.BerkasPengajuan.berkas_slik ? (
            <object
              data={data.BerkasPengajuan.berkas_slik}
              className="w-full h-full"
              type="application/pdf"
              width="100%"
              height="100%"
            >
              <div className="h-full w-full flex justify-center items-center flex-col gap-5">
                <div className="text-center text-red-500 font-bold text-lg">
                  Browser yang anda gunakan tidak mendukung untuk pembukaan file
                  yang dimaksud atau file tidak ditemukan
                </div>
                <div>
                  Mobile device belum mendukung pembukaan file dalam bentuk PDF
                </div>
                <div>
                  <a
                    href={data.BerkasPengajuan.berkas_slik}
                    download={data.BerkasPengajuan.berkas_slik}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded shadow"
                  >
                    DOWNLOAD
                  </a>
                </div>
              </div>
            </object>
          ) : (
            <div className="text-center text-red-500">
              <p>Berkas belum di upload!</p>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "pengajuan",
      label: "Data Pengajuan",
      children: (
        <div style={{ height: "70vh" }}>
          {data.BerkasPengajuan.berkas_pengajuan ? (
            <object
              data={data.BerkasPengajuan.berkas_pengajuan}
              className="w-full h-full"
              type="application/pdf"
              width="100%"
              height="100%"
            >
              <div className="h-full w-full flex justify-center items-center flex-col gap-5">
                <div className="text-center text-red-500 font-bold text-lg">
                  Browser yang anda gunakan tidak mendukung untuk pembukaan file
                  yang dimaksud atau file tidak ditemukan
                </div>
                <div>
                  Mobile device belum mendukung pembukaan file dalam bentuk PDF
                </div>
                <div>
                  <a
                    href={data.BerkasPengajuan.berkas_pengajuan}
                    download={data.BerkasPengajuan.berkas_pengajuan}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded shadow"
                  >
                    DOWNLOAD
                  </a>
                </div>
              </div>
            </object>
          ) : (
            <div className="text-center text-red-500">
              <p>Berkas belum di upload!</p>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "geo_location",
      label: "Geo Tangging",
      children: (
        <div className="border" style={{ height: "70vh" }}>
          {data.geo_location && data.geo_location.split(",").length == 2 ? (
            <MapContainer
              center={[
                parseFloat((data.geo_location || "").split(",")[0]),
                parseFloat((data.geo_location || "").split(",")[1]),
              ]}
              zoom={13}
            >
              <TileLayer
                attribution={`&copy; Created ${process.env.NEXT_PUBLIC_APP_FULL_NAME}`}
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[
                  parseFloat((data.geo_location || "").split(",")[0]),
                  parseFloat((data.geo_location || "").split(",")[1]),
                ]}
                icon={icon({
                  iconUrl: "/assets/images/marker-icon.png",
                  iconSize: [20, 25],
                })}
              >
                <Popup>
                  <div>
                    <div style={{ display: "flex", gap: 5 }}>
                      <span style={{ width: 50 }}>Nopen</span>
                      <span>:</span>
                      <span>{data.DataPembiayaan.nopen}</span>
                    </div>
                    <div style={{ display: "flex", gap: 5 }}>
                      <span style={{ width: 50 }}>Nama</span>
                      <span>:</span>
                      <span>{data.DataPembiayaan.name}</span>
                    </div>
                    <div style={{ display: "flex", gap: 5 }}>
                      <span style={{ width: 50 }}>Alamat</span>
                      <span>:</span>
                      <span style={{ width: 200 }}>
                        {data.DataPengajuanAlamat.alamat || ""}{" "}
                        {data.DataPengajuanAlamat.rt + " / "}
                        {data.DataPengajuanAlamat.rw},{" "}
                        {data.DataPengajuanAlamat.kelurahan}{" "}
                        {data.DataPengajuanAlamat.kecamatan},{" "}
                        {data.DataPengajuanAlamat.kota}{" "}
                        {data.DataPengajuanAlamat.provinsi}{" "}
                        {data.DataPengajuanAlamat.kode_pos}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="text-center color-red-500">
              <p>Data Geo Location Tidak Valid!</p>
            </div>
          )}
        </div>
      ),
    },
    {
      label: "MAUK",
      key: "mauk",
      children: (
        <div style={{ height: "70vh" }}>
          <Mauk data={data} />
        </div>
      ),
    },
  ];
  const nonBankITems = [
    {
      key: "data-pembanding",
      label: "Data Pembanding",
      children: (
        <div style={{ height: "70vh" }}>
          <DataPembanding data={data.DataTaspen} />
        </div>
      ),
    },
    {
      key: "slik",
      label: "Berkas Slik",
      children: (
        <div style={{ height: "70vh" }}>
          {data.BerkasPengajuan.berkas_slik ? (
            <object
              data={data.BerkasPengajuan.berkas_slik}
              className="w-full h-full"
              type="application/pdf"
              width="100%"
              height="100%"
            >
              <div className="h-full w-full flex justify-center items-center flex-col gap-5">
                <div className="text-center text-red-500 font-bold text-lg">
                  Browser yang anda gunakan tidak mendukung untuk pembukaan file
                  yang dimaksud atau file tidak ditemukan
                </div>
                <div>
                  Mobile device belum mendukung pembukaan file dalam bentuk PDF
                </div>
                <div>
                  <a
                    href={data.BerkasPengajuan.berkas_slik}
                    download={data.BerkasPengajuan.berkas_slik}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded shadow"
                  >
                    DOWNLOAD
                  </a>
                </div>
              </div>
            </object>
          ) : (
            <div className="text-center text-red-500">
              <p>Berkas belum di upload!</p>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "pengajuan",
      label: "Berkas Pengajuan",
      children: (
        <div style={{ height: "70vh" }}>
          {data.BerkasPengajuan.berkas_pengajuan ? (
            <object
              data={data.BerkasPengajuan.berkas_pengajuan}
              className="w-full h-full"
              type="application/pdf"
              width="100%"
              height="100%"
            >
              <div className="h-full w-full flex justify-center items-center flex-col gap-5">
                <div className="text-center text-red-500 font-bold text-lg">
                  Browser yang anda gunakan tidak mendukung untuk pembukaan file
                  yang dimaksud atau file tidak ditemukan
                </div>
                <div>
                  Mobile device belum mendukung pembukaan file dalam bentuk PDF
                </div>
                <div>
                  <a
                    href={data.BerkasPengajuan.berkas_pengajuan}
                    download={data.BerkasPengajuan.berkas_pengajuan}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded shadow text-xs"
                  >
                    DOWNLOAD
                  </a>
                </div>
              </div>
            </object>
          ) : (
            <div className="text-center text-red-500">
              <p>Berkas belum di upload!</p>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "idpb",
      label: "Berkas IDPB",
      children: (
        <div style={{ height: "70vh" }}>
          {data.BerkasPengajuan.berkas_idpb ? (
            <object
              data={data.BerkasPengajuan.berkas_idpb}
              className="w-full h-full"
              type="application/pdf"
              width="100%"
              height="100%"
            >
              <div className="h-full w-full flex justify-center items-center flex-col gap-5">
                <div className="text-center text-red-500 font-bold text-lg">
                  Browser yang anda gunakan tidak mendukung untuk pembukaan file
                  yang dimaksud atau file tidak ditemukan
                </div>
                <div>
                  Mobile device belum mendukung pembukaan file dalam bentuk PDF
                </div>
                <div>
                  <a
                    href={data.BerkasPengajuan.berkas_idpb}
                    download={data.BerkasPengajuan.berkas_idpb}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded shadow text-xs"
                  >
                    DOWNLOAD
                  </a>
                </div>
              </div>
            </object>
          ) : (
            <div className="text-center text-red-500">
              <p>Berkas belum di upload!</p>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "flagginf",
      label: "Berkas Flagging",
      children: (
        <div style={{ height: "70vh" }}>
          {data.BerkasPengajuan.berkas_flagging ? (
            <object
              data={data.BerkasPengajuan.berkas_flagging}
              className="w-full h-full"
              type="application/pdf"
              width="100%"
              height="100%"
            >
              <div className="h-full w-full flex justify-center items-center flex-col gap-5">
                <div className="text-center text-red-500 font-bold text-lg">
                  Browser yang anda gunakan tidak mendukung untuk pembukaan file
                  yang dimaksud atau file tidak ditemukan
                </div>
                <div>
                  Mobile device belum mendukung pembukaan file dalam bentuk PDF
                </div>
                <div>
                  <a
                    href={data.BerkasPengajuan.berkas_flagging}
                    download={data.BerkasPengajuan.berkas_flagging}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded shadow text-xs"
                  >
                    DOWNLOAD
                  </a>
                </div>
              </div>
            </object>
          ) : (
            <div className="text-center text-red-500">
              <p>Berkas belum di upload!</p>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "wawancara",
      label: "Video Wawancara",
      children: (
        <div style={{ height: "70vh" }}>
          {data.BerkasPengajuan.video_wawancara ? (
            <object
              data={data.BerkasPengajuan.video_wawancara}
              className="w-full h-full"
              type={"video/mp4"}
              width="100%"
              height="100%"
            >
              <div className="h-full w-full flex justify-center items-center flex-col gap-5">
                <div className="text-center text-red-500 font-bold text-lg">
                  Browser yang anda gunakan tidak mendukung untuk pembukaan file
                  yang dimaksud atau file tidak ditemukan
                </div>
                <div className="flex gap-5 justify-center">
                  <div>
                    <a
                      href={data.BerkasPengajuan.video_wawancara}
                      download={data.BerkasPengajuan.video_wawancara}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded shadow"
                    >
                      DOWNLOAD
                    </a>
                  </div>
                </div>
              </div>
            </object>
          ) : (
            <div className="text-center text-red-500">
              <p>Berkas belum di upload!</p>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "asuransi",
      label: "Video Asuransi",
      children: (
        <div style={{ height: "70vh" }}>
          {data.BerkasPengajuan.video_asuransi ? (
            <object
              data={data.BerkasPengajuan.video_asuransi}
              className="w-full h-full"
              type={"video/mp4"}
              width="100%"
              height="100%"
            >
              <div className="h-full w-full flex justify-center items-center flex-col gap-5">
                <div className="text-center text-red-500 font-bold text-lg">
                  Browser yang anda gunakan tidak mendukung untuk pembukaan file
                  yang dimaksud atau file tidak ditemukan
                </div>
                <div className="flex justify-center">
                  <div>
                    <a
                      href={data.BerkasPengajuan.video_asuransi}
                      download={data.BerkasPengajuan.video_asuransi}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded shadow"
                    >
                      DOWNLOAD
                    </a>
                  </div>
                </div>
              </div>
            </object>
          ) : (
            <div className="text-center text-red-500">
              <p>Berkas belum di upload!</p>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "geo_location",
      label: "Lokasi",
      children: (
        <div className="border" style={{ height: "70vh" }}>
          {data.geo_location && data.geo_location.split(",").length === 2 ? (
            <MapContainer
              center={[
                parseFloat((data.geo_location || "").split(",")[0]),
                parseFloat((data.geo_location || "").split(",")[1]),
              ]}
              zoom={13}
            >
              <TileLayer
                attribution={`&copy; Created ${process.env.NEXT_PUBLIC_APP_FULL_NAME}`}
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker
                position={[
                  parseFloat((data.geo_location || "").split(",")[0]),
                  parseFloat((data.geo_location || "").split(",")[1]),
                ]}
                icon={icon({
                  iconUrl: "/assets/images/marker-icon.png",
                  iconSize: [20, 25],
                })}
              >
                <Popup>
                  <div>
                    <div style={{ display: "flex", gap: 5 }}>
                      <span style={{ width: 50 }}>Nopen</span>
                      <span>:</span>
                      <span>{data.DataPembiayaan.nopen}</span>
                    </div>
                    <div style={{ display: "flex", gap: 5 }}>
                      <span style={{ width: 50 }}>Nama</span>
                      <span>:</span>
                      <span>{data.DataPembiayaan.name}</span>
                    </div>
                    <div style={{ display: "flex", gap: 5 }}>
                      <span style={{ width: 50 }}>Alamat</span>
                      <span>:</span>
                      <span style={{ width: 200 }}>
                        {data.DataPengajuanAlamat.alamat || ""}{" "}
                        {data.DataPengajuanAlamat.rt + " / "}
                        {data.DataPengajuanAlamat.rw},{" "}
                        {data.DataPengajuanAlamat.kelurahan}{" "}
                        {data.DataPengajuanAlamat.kecamatan},{" "}
                        {data.DataPengajuanAlamat.kota}{" "}
                        {data.DataPengajuanAlamat.provinsi}{" "}
                        {data.DataPengajuanAlamat.kode_pos}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="text-center color-red-500">
              <p>Data Geo Location Tidak Valid!</p>
            </div>
          )}
        </div>
      ),
    },
  ];
  return (
    <div>
      {/* <div className="flex justify-center">
        <button
          className={`border rounded shadow py-1 px-2 ${
            isPeriksa && "bg-green-500 hover:bg-green-600 text-white"
          }`}
          onClick={() => setOpen(true)}
        >
          {isPeriksa ? <FormOutlined /> : <FileFilled />}
        </button>
      </div> */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title="BERKAS PENGAJUAN"
        width={"95vw"}
        style={{ top: 20 }}
        footer={[]}
      >
        <div
          className="flex flex-wrap md:flex-nowrap gap-5"
          style={{ minHeight: "80vh" }}
        >
          <div
            className={`${allowForm ? "block" : "hidden"}`}
            style={{ width: 500 }}
          >
            <FormPengajuan
              data={data}
              isPeriksa={isPeriksa}
              pathname={pathname}
              setOpen={setOpen}
              getData={getData}
              nextpath={nextpath}
            />
          </div>
          <div
            style={{
              width:
                window.innerWidth > 600
                  ? allowForm
                    ? "55vw"
                    : "100%"
                  : "100%",
            }}
          >
            <Tabs
              size="small"
              items={
                role === Role.BANK ||
                role === Role.CHECKER ||
                role === Role.MAKER ||
                role === Role.APPROVAL
                  ? bankItems
                  : nonBankITems
              }
              defaultActiveKey={"data-pembanding"}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
