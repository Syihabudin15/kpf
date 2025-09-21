"use client";
import { Role } from "@prisma/client";
import { Modal, Tabs } from "antd";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { icon } from "leaflet";
import dynamic from "next/dynamic";
import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { DataDataPengajuan } from "./Interfaces";
import Mauk from "../views/dataPdf/Mauk";
import MaukDassa from "../views/dataPdf/MaukDassa";
import ViewBerkas from "./VewBerkas";

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
  return (
    <div>
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
                  ? [
                      {
                        key: data.id + "data-pembanding",
                        label: "Data Pembanding",
                        children: (
                          <div style={{ height: "70vh" }}>
                            <DataPembanding data={data.DataTaspen} />
                          </div>
                        ),
                      },
                      {
                        key: data.id + "slik",
                        label: "Slik",
                        children: (
                          <ViewBerkas
                            currType="application/pdf"
                            currUrl={data.BerkasPengajuan.berkas_slik}
                          />
                        ),
                      },
                      {
                        key: data.id + "pengajuan",
                        label: "Pengajuan",
                        children: (
                          <ViewBerkas
                            currType="application/pdf"
                            currUrl={data.BerkasPengajuan.berkas_pengajuan}
                          />
                        ),
                      },
                      {
                        key: data.id + "video_wawancara",
                        label: "Wawancara",
                        children: (
                          <ViewBerkas
                            currType="video/mp4"
                            currUrl={data.BerkasPengajuan.video_wawancara}
                          />
                        ),
                      },
                      {
                        key: data.id + "video_asuransi",
                        label: "Asuransi",
                        children: (
                          <ViewBerkas
                            currType="video/mp4"
                            currUrl={data.BerkasPengajuan.video_asuransi}
                          />
                        ),
                      },
                      {
                        key: data.id + "geo_location",
                        label: "Maps",
                        children: (
                          <div className="border" style={{ height: "70vh" }}>
                            {data.geo_location &&
                            data.geo_location.split(",").length == 2 ? (
                              <MapContainer
                                center={[
                                  parseFloat(
                                    (data.geo_location || "").split(",")[0]
                                  ),
                                  parseFloat(
                                    (data.geo_location || "").split(",")[1]
                                  ),
                                ]}
                                zoom={13}
                              >
                                <TileLayer
                                  attribution={`&copy; Created `}
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker
                                  position={[
                                    parseFloat(
                                      (data.geo_location || "").split(",")[0]
                                    ),
                                    parseFloat(
                                      (data.geo_location || "").split(",")[1]
                                    ),
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
                                        <span style={{ width: 50 }}>
                                          Alamat
                                        </span>
                                        <span>:</span>
                                        <span style={{ width: 200 }}>
                                          {data.DataPengajuanAlamat.alamat ||
                                            ""}{" "}
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
                        key: data.id + "mauk",
                        children: (
                          <div style={{ height: "70vh" }}>
                            {data.Bank.kode === "BPR DASSA" ? (
                              <MaukDassa data={data} />
                            ) : (
                              <Mauk data={data} />
                            )}
                          </div>
                        ),
                      },
                    ]
                  : [
                      {
                        key: "data-pembanding",
                        label: "Pembanding",
                        children: (
                          <div style={{ height: "70vh" }}>
                            <DataPembanding data={data.DataTaspen} />
                          </div>
                        ),
                      },
                      {
                        key: data.id + "slik",
                        label: "Slik",
                        children: (
                          <ViewBerkas
                            currType="application/pdf"
                            currUrl={data.BerkasPengajuan.berkas_slik}
                          />
                        ),
                      },
                      {
                        key: data.id + "pengajuan",
                        label: "Pengajuan",
                        children: (
                          <ViewBerkas
                            currType="application/pdf"
                            currUrl={data.BerkasPengajuan.berkas_pengajuan}
                          />
                        ),
                      },
                      {
                        key: data.id + "wawancara",
                        label: "Wawancara",
                        children: (
                          <ViewBerkas
                            currType="video/mp4"
                            currUrl={data.BerkasPengajuan.video_wawancara}
                          />
                        ),
                      },
                      {
                        key: data.id + "asuransi",
                        label: "Asuransi",
                        children: (
                          <ViewBerkas
                            currType="video/mp4"
                            currUrl={data.BerkasPengajuan.video_asuransi}
                          />
                        ),
                      },
                      {
                        key: data.id + "geo_location",
                        label: "Maps",
                        children: (
                          <div className="border" style={{ height: "70vh" }}>
                            {data.geo_location &&
                            data.geo_location.split(",").length === 2 ? (
                              <MapContainer
                                center={[
                                  parseFloat(
                                    (data.geo_location || "").split(",")[0]
                                  ),
                                  parseFloat(
                                    (data.geo_location || "").split(",")[1]
                                  ),
                                ]}
                                zoom={13}
                              >
                                <TileLayer
                                  attribution={`&copy; Created ${process.env.NEXT_PUBLIC_APP_FULL_NAME}`}
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker
                                  position={[
                                    parseFloat(
                                      (data.geo_location || "").split(",")[0]
                                    ),
                                    parseFloat(
                                      (data.geo_location || "").split(",")[1]
                                    ),
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
                                        <span style={{ width: 50 }}>
                                          Alamat
                                        </span>
                                        <span>:</span>
                                        <span style={{ width: 200 }}>
                                          {data.DataPengajuanAlamat.alamat ||
                                            ""}{" "}
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
                    ]
              }
              defaultActiveKey={"data-pembanding"}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
