"use client";

import * as XLSX from "xlsx";
import { Button } from "antd";
import { useState } from "react";
import { IArea, IBank } from "@/app/api/debitur/route";
import { JenisPembiayaan } from "@prisma/client";
import { ExportData } from "@/components/Utils";

type INewData<T> = T & {
  newId: string;
};

export default function Page() {
  const [load, setLoad] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const starting = async () => {
    setLoad(true);
    const res = await fetch("/api/debitur");
    const { banks, jepems, area } = await res.json();
    const bank: IBank[] = banks;
    const jepem: INewData<JenisPembiayaan>[] = jepems;
    const produk = bank.flatMap((p) => p.ProdukPembiayaan);
    const temp = bank
      .flatMap((d) => d.ProdukPembiayaan.flatMap((p) => p.DataPembiayaan))
      .filter((d) => d.DataPengajuan);

    const deb = temp.map((d) => ({
      ...d,
      agama: d.DataPengajuan.agama,
      pelayanan_berkas: d.DataPengajuan.area_pelayanan_berkas,
      bankId: d.DataPengajuan.bankId,
      geo: d.DataPengajuan.geo_location,
      pangkat: d.DataPengajuan.golongan,
      bayar_asuransi: d.DataPengajuan.jenis_asuransi,
      jk: d.DataPengajuan.jenis_kelamin,
      jenis_margin: d.DataPengajuan.jenis_margin,
      kelompok: d.DataPengajuan.jenis_pensiun,
      usaha: d.DataPengajuan.jenis_usaha,
      kode_jiwa: d.DataPengajuan.kode_jiwa,
      masa_kerja: d.DataPengajuan.masa_kerja,
      masa_ktp: d.DataPengajuan.masa_ktp,
      status_rumah: d.DataPengajuan.status_rumah,
      menempati_tahun: d.DataPengajuan.menempati_tahun,
      moc: d.DataPengajuan.moc,
      newId: (d.DataPengajuan as any).newId,
      nik: d.DataPengajuan.nik,
      no_telepon: d.DataPengajuan.no_telepon,
      no_akad: d.DataPengajuan.nomor_akad,
      no_skep: d.DataPengajuan.nomor_sk_pensiun,
      npwp: d.DataPengajuan.npwp,
      pekerjaan: d.DataPengajuan.pekerjaan_sekarang,
      pendidikan: d.DataPengajuan.pendidikan,
      penerbit: d.DataPengajuan.penerbit_sk,
      marketingId: d.DataPengajuan.user_id,
      tujuan: d.DataPengajuan.tujuan_penggunaan1,
      tmt: d.DataPengajuan.tmt_pensiun,
      tgl_skep: d.DataPengajuan.tanggal_sk_pensiun,
      tgl_cair: d.DataPengajuan.tanggal_pencairan,
      status_lunas: d.DataPengajuan.status_lunas,
      status_takeover: true,
      status_mutasi: true,
      status_flagging: true,
      verif_status: d.DataPengajuan.status_verifikasi,
      verif_tgl: d.DataPengajuan.tanggal_verifikasi,
      verif_desc: d.DataPengajuan.keterangan_verifikasi,
      slik_status: d.DataPengajuan.status_slik,
      slik_tgl: d.DataPengajuan.tanggal_slik,
      slik_desc: d.DataPengajuan.keterangan_slik,
      approv_status: d.DataPengajuan.status_approval,
      approv_tgl: d.DataPengajuan.tanggal_approval,
      approv_desc: d.DataPengajuan.keterangan_approval,
      awal_flagging: d.DataPengajuan.DataTaspen.awal_flagging,
      akhir_flagging: d.DataPengajuan.DataTaspen.akhir_flagging,
      nama_ibu: d.DataPengajuan.DataTaspen.nama_ibu_kandung,
      nama_skep: d.DataPengajuan.DataTaspen.nama_skep,
      norek: d.DataPengajuan.DataTaspen.no_rek,
      ktr_bayar: d.DataPengajuan.DataTaspen.ktr_bay_dapem,
      mitra_flagging: d.DataPengajuan.DataTaspen.mitra_flagging,
      gaji: d.DataPengajuan.DataTaspen.penpok,
      status_kawin: d.DataPengajuan.DataTaspen.status_kawin,
      alm_rumah: `${d.DataPengajuan.DataTaspen.Domisili.alamat} ${d.DataPengajuan.DataTaspen.Domisili.rt} ${d.DataPengajuan.DataTaspen.Domisili.rw}`,
      lurah: d.DataPengajuan.DataTaspen.Domisili.kelurahan,
      camat: d.DataPengajuan.DataTaspen.Domisili.kecamatan,
      kota: d.DataPengajuan.DataTaspen.Domisili.kota,
      provinsi: d.DataPengajuan.DataTaspen.Domisili.provinsi,
      kodepos: d.DataPengajuan.DataTaspen.Domisili.kode_pos,
      d_alm_rumah: `${d.DataPengajuan.DataTaspen.Domisili.alamat_domisili} ${d.DataPengajuan.DataTaspen.Domisili.rt_domisili} ${d.DataPengajuan.DataTaspen.Domisili.rw_domisili}`,
      d_lurah: d.DataPengajuan.DataTaspen.Domisili.kelurahan_domisili,
      d_camat: d.DataPengajuan.DataTaspen.Domisili.kecamatan_domisili,
      d_kota: d.DataPengajuan.DataTaspen.Domisili.kota_domisili,
      d_provinsi: d.DataPengajuan.DataTaspen.Domisili.provinsi_domisili,
      d_kodepos: d.DataPengajuan.DataTaspen.Domisili.kode_pos_domisili,
      p_nama: d.DataPengajuan.DataPengajuanPasangan.nama_pasangan,
      p_nik: d.DataPengajuan.DataPengajuanPasangan.nik_pasangan,
      p_tempat_lahir:
        d.DataPengajuan.DataPengajuanPasangan.tempat_lahir_pasangan,
      p_tgl_lahir: d.DataPengajuan.DataPengajuanPasangan.tanggal_lahir_pasangan,
      p_pekerjaan: d.DataPengajuan.DataPengajuanPasangan.pekerjaan_pasangan,
      p_alamat: d.DataPengajuan.DataPengajuanPasangan.alamat_pasangan,
      f_nama: d.DataPengajuan.DataPengajuanPasangan.nama_keluarga_tidak_serumah,
      f_hubungan: d.DataPengajuan.DataPengajuanPasangan.hubungan,
      f_no_telp: d.DataPengajuan.DataPengajuanPasangan.no_telepon_keluarga,
      b_slik: d.DataPengajuan.BerkasPengajuan.berkas_slik,
      b_pengajuan: d.DataPengajuan.BerkasPengajuan.berkas_pengajuan,
      b_wawancara: d.DataPengajuan.BerkasPengajuan.video_wawancara,
      b_asuransi: d.DataPengajuan.BerkasPengajuan.video_asuransi,
      b_akad: d.DataPengajuan.BerkasPengajuan.berkas_akad,
      bv_akad: d.DataPengajuan.BerkasPengajuan.video_akad,
      b_pelunasan: d.DataPengajuan.BerkasPengajuan.pelunasan,
      b_mutasi: d.DataPengajuan.BerkasPengajuan.mutasi,
      b_flagging: d.DataPengajuan.BerkasPengajuan.berkas_flagging,
      b_cair: d.DataPengajuan.BerkasPengajuan.bukti_cair,
      bv_cair: d.DataPengajuan.BerkasPengajuan.video_cair,
      bv_cair2: d.DataPengajuan.BerkasPengajuan.video_cair2,
      bv_cair3: d.DataPengajuan.BerkasPengajuan.video_cair3,
    }));
    const tempcair = bank
      .flatMap((b) => b.ProdukPembiayaan.flatMap((p) => p.DataPembiayaan))
      .filter((d) => d.DataPengajuan && d.DataPengajuan.DataPencairan);
    const cair = tempcair.flatMap((d) => d.DataPengajuan.DataPencairan);

    const User = (area as IArea[]).flatMap((a) =>
      a.UnitCabang.flatMap((u) => u.User)
    );
    const UnitCabang = (area as IArea[]).flatMap((a) => a.UnitCabang);
    ExportData(
      [
        { sheetname: "jepem", data: jepem },
        { sheetname: "produk", data: produk },
        { sheetname: "sumdan", data: bank },
        { sheetname: "debitur", data: deb },
        { sheetname: "cair", data: cair },
        { sheetname: "area", data: area },
        { sheetname: "cabang", data: UnitCabang },
        { sheetname: "user", data: User },
      ],
      "mirations"
    );
    setLoad(false);
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Button type="primary" loading={load} onClick={() => starting()}>
          Start Export
        </Button>
        <div>
          <p>{msg}</p>
        </div>
      </div>
    </div>
  );
}
