"use client";

import {
  BankOpt,
  Cabang,
  DataDataPengajuan,
  Options,
} from "@/components/utils/Interfaces";
import { Modal, Tabs, TabsProps } from "antd";
import { useEffect, useState } from "react";
import FormEditPengajuan from "./FormEditPengajuan";
import { FormOutlined } from "@ant-design/icons";
import DataPembanding from "../dataPdf/DataPembanding";
import { User } from "@prisma/client";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { icon } from "leaflet";

export default function EditPengajuan({
  data,
  getData,
  fullCabang,
  fullUser,
  upOpt,
  refferalOpt,
  provinsi,
}: {
  data: DataDataPengajuan;
  getData: Function;
  fullCabang: Cabang[];
  fullUser: User[];
  upOpt: BankOpt[];
  refferalOpt: Options[];
  provinsi: Options[];
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<TabsProps["items"]>();
  const [itemsBerkas, setItemsBerkas] = useState<TabsProps["items"]>();
  const [itemsMobile, setItemsMobile] = useState<TabsProps["items"]>();

  useEffect(() => {
    const tempItems = [
      {
        label: "Data Pembanding",
        key: "data_pembanding",
        children: (
          <div style={{ height: "70vh" }}>
            <DataPembanding data={data.DataTaspen} />
          </div>
        ),
      },
      {
        label: "Slik",
        key: "slik",
        children: (
          <div style={{ height: "70vh" }}>
            <ViewBerkas
              url={data.BerkasPengajuan.berkas_slik || ""}
              type="application/pdf"
            />
          </div>
        ),
      },
      {
        label: "Pengajuan",
        key: "pengajuan",
        children: (
          <div style={{ height: "70vh" }}>
            <ViewBerkas
              url={data.BerkasPengajuan.berkas_pengajuan || ""}
              type="application/pdf"
            />
          </div>
        ),
      },
      {
        label: "Asuransi",
        key: "asuransi",
        children: (
          <div style={{ height: "70vh" }}>
            <ViewBerkas
              url={data.BerkasPengajuan.video_asuransi || ""}
              type="video/mp4"
            />
          </div>
        ),
      },
      {
        label: "Wawancara",
        key: "wawancara",
        children: (
          <div style={{ height: "70vh" }}>
            <ViewBerkas
              url={data.BerkasPengajuan.video_wawancara || ""}
              type="video/mp4"
            />
          </div>
        ),
      },
      {
        key: "geo_location",
        label: "Lokasi",
        children: (
          <div className="border" style={{ height: "70vh" }}>
            {data.geo_location && data.geo_location.length > 10 ? (
              <MapContainer
                center={[
                  parseFloat((data.geo_location || "").split(",")[0]),
                  parseFloat((data.geo_location || "").split(",")[1]),
                ]}
                zoom={12}
              >
                <TileLayer
                  attribution={`&copy; Created ${process.env.NEXT_PUBLIC_APP_FULL_NAME}`}
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
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
                <p>Data Geo Location Tidak Vali!</p>
              </div>
            )}
          </div>
        ),
      },
    ];
    const formItem = {
      label: "Edit Pengajuan",
      key: "edit-pengajuan",
      children: (
        <FormEditPengajuan
          setOpen={setOpen}
          currData={data}
          getData={getData}
          fullCabang={fullCabang}
          fullUser={fullUser}
          upOpt={upOpt}
          refferalOpt={refferalOpt}
          provinsi={provinsi}
        />
      ),
    };
    setItems([formItem]);
    setItemsBerkas(tempItems);
    const mob = [formItem];
    tempItems.forEach((el) => {
      mob.push(el);
    });
    setItemsMobile(mob);
  }, []);

  return (
    <div>
      <div className="flex justify-center">
        <button
          className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded shadow"
          onClick={() => setOpen(true)}
          disabled={data.status_pencairan === "TRANSFER" ? true : false}
          style={{ opacity: data.status_pencairan === "TRANSFER" ? 0.5 : 1 }}
        >
          <FormOutlined />
        </button>
      </div>
      <Modal
        open={open}
        footer={[]}
        onCancel={() => setOpen(false)}
        title={`Edit Pengajuan ${data.DataPembiayaan.name}`}
        width={"95%"}
        style={{ top: 10 }}
      >
        <div className="hidden sm:flex">
          <div style={{ flex: 0.8 }}>
            <Tabs items={items} style={{ height: "80vh" }} />
          </div>
          <div style={{ flex: 1.2 }}>
            <Tabs items={itemsBerkas} style={{ height: "80vh" }} />
          </div>
        </div>
        <div className="block sm:hidden">
          <Tabs items={itemsMobile} style={{ height: "80vh" }} />
        </div>
      </Modal>
    </div>
  );
}

const ViewBerkas = ({ url, type }: { url: string; type: string }) => {
  const split: string[] = url.split("/");
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <object data={url} type={type} height={"100%"} width={"100%"}>
        <div className="text-center">
          Browser anda tidak mendukung pembukaan file pdf
        </div>
        <div className="flex justify-center">
          <a href={url} download={split[split.length]}>
            <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-3 rounded shadow">
              Download
            </button>
          </a>
        </div>
      </object>
    </div>
  );
};
