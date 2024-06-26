"use client";

import {
  BankOpt,
  Cabang,
  DataDataPengajuan,
  Options,
} from "@/components/utils/Interfaces";
import { Modal, Tabs, TabsProps } from "antd";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { icon } from "leaflet";
import dynamic from "next/dynamic";
import { LoadingOutlined } from "@ant-design/icons";
import ViewBerkas from "@/components/utils/VewBerkas";

const FormEditPengajuan = dynamic(
  () => import("@/components/views/pengajuan/FormEditPengajuan"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);
const DataPembanding = dynamic(
  () => import("@/components/views/dataPdf/DataPembanding"),
  {
    ssr: false,
    loading: () => <LoadingOutlined />,
  }
);

export default function EditPengajuan({
  data,
  getData,
  fullCabang,
  fullUser,
  upOpt,
  refferalOpt,
  provinsi,
  open,
  setOpen,
}: {
  data: DataDataPengajuan;
  getData: Function;
  fullCabang: Cabang[];
  fullUser: User[];
  upOpt: BankOpt[];
  refferalOpt: Options[];
  provinsi: Options[];
  open: boolean;
  setOpen: Function;
}) {
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
              currUrl={data.BerkasPengajuan.berkas_slik || ""}
              currType="application/pdf"
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
              currUrl={data.BerkasPengajuan.berkas_pengajuan || ""}
              currType="application/pdf"
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
              currUrl={data.BerkasPengajuan.video_asuransi || ""}
              currType="video/mp4"
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
              currUrl={data.BerkasPengajuan.video_wawancara || ""}
              currType="video/mp4"
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
  }, [data]);

  return (
    <div>
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
