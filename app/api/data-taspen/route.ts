import { DataKeluarga } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import prisma from "@/components/prisma";
import { DataDataTaspen } from "@/components/utils/Interfaces";
export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const page = req.nextUrl.searchParams.get("page");
  const nameOrNopen = req.nextUrl.searchParams.get("name");
  let result: DataDataTaspen[] = [];
  if (page || nameOrNopen) {
    const skip = ((page ? parseInt(page) : 1) - 1) * 20;
    if (nameOrNopen) {
      result = <any>await prisma.dataTaspen.findMany({
        where: {
          AND: [
            { is_active: true },
            {
              OR: [
                { nopen: { contains: nameOrNopen } },
                { nama: { contains: nameOrNopen } },
              ],
            },
          ],
        },
        include: {
          DataKeluarga: true,
          Domisili: true,
          DataPasangan: true,
          TunjanganPotongan: true,
        },
        skip,
        take: 20,
      });
    } else {
      result = <any>await prisma.dataTaspen.findMany({
        where: { is_active: true },
        include: {
          DataKeluarga: true,
          Domisili: true,
          DataPasangan: true,
          TunjanganPotongan: true,
        },
        skip,
        take: 20,
      });
    }
  } else {
    result = <any>await prisma.dataTaspen.findMany({
      where: { is_active: true },
      include: {
        DataKeluarga: true,
        Domisili: true,
        DataPasangan: true,
        TunjanganPotongan: true,
      },
    });
  }

  const total = await prisma.dataTaspen.count({ where: { is_active: true } });
  return NextResponse.json(
    { data: result, total: nameOrNopen ? result.length : total },
    { status: 200, statusText: "OK" }
  );
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  try {
    const bufTaspen = Buffer.from(data.url.split(",")[1], "base64");
    const wbTaspen = XLSX.read(bufTaspen, { type: "buffer" });
    const sheetTaspen = wbTaspen.Sheets[wbTaspen.SheetNames[0]];
    const dataTaspen: any[] = XLSX.utils.sheet_to_json(sheetTaspen);
    const result = dataTaspen.map((d) => {
      const temp = d.KELUARGA.replace("[", "").replace("]", "").split("},");
      const tempObj = temp.map((tmp: string) => {
        let resultKerluarga = {};
        const spltObj = tmp.replace("{", "").replace("}", "").split(",");
        const resObj = spltObj.map((obj) => {
          resultKerluarga = {
            ...resultKerluarga,
            [obj.split(":")[0]]: obj.split(":")[1],
          };
        });
        return resultKerluarga;
      });
      d.KELUARGA = tempObj;
      return d;
    });

    return NextResponse.json(
      { result: result, msg: "Success" },
      { status: 200, statusText: "OK" }
    );
  } catch (err) {
    console.log({ err });
    return NextResponse.json(
      { msg: "Data Tidak Valid!" },
      { status: 500, statusText: "INTERNAL SERVER ERROR" }
    );
  }
};

export const PUT = async (req: NextRequest) => {
  const data: any[] = await req.json();
  if (!data)
    return NextResponse.json(
      { msg: "Data tidak boleh Kosong" },
      { status: 400, statusText: "BAD" }
    );
  try {
    await prisma.$transaction(
      async (tx) => {
        for (let i = 0; i < data.length; i++) {
          const find = await tx.dataTaspen.findFirst({
            where: { nopen: data[i].NOTAS.toString() },
          });
          if (find) return;
          const saveDomisili = await tx.dataDomisili.create({
            data: {
              alamat: data[i].ALAMATRUMAH || null,
              rt: null,
              rw: null,
              kelurahan: null,
              kecamatan: null,
              kota: null,
              provinsi: null,
              geo_location: null,
              kode_pos: null,
            },
          });

          const dataPasangan = await tx.dataPasangan.create({
            data: {
              nama_pasangan: null,
              tempat_lahir_pasangan: null,
              tanggal_lahir_pasangan: null,
              nik_pasangan: null,
              masa_ktp_pasangan: null,
              pekerjaan_pasangan: null,
            },
          });

          const dataTunjanganPotongan = await tx.tunjanganPotongan.create({
            data: {
              kpkn: data[i].KPKN ? data[i].KPKN.toString() : null,
              pot_alimentasi: data[i].POTALIMENTASI
                ? data[i].POTALIMENTASI.toString()
                : null,
              pot_askes: data[i].POTASKES ? data[i].POTASKES.toString() : null,
              pot_assos: data[i].POTASSOS ? data[i].POTASSOS.toString() : null,
              pot_ganti_rugi: data[i].POTGANTIRUGI
                ? data[i].POTGANTIRUGI.toString()
                : null,
              pot_kasda: data[i].POTKASDA ? data[i].POTKASDA.toString() : null,
              pot_kpkn: data[i].POTKPKN ? data[i].POTKPKN.toString() : null,
              pot_pph21: data[i].POTPPH21 ? data[i].POTPPH21.toString() : null,
              pot_sewa_rumah: data[i].POTSEWARUMAH
                ? data[i].POTSEWARUMAH.toString()
                : null,
              spn: data[i].SPN ? data[i].SPN.toString() : null,
              t_anak: data[i].TANAK ? data[i].TANAK.toString() : null,
              t_beras: data[i].TBERAS ? data[i].TBERAS.toString() : null,
              t_cacat: data[i].TCACAT ? data[i].TCACAT.toString() : null,
              t_dahor: data[i].TDAHOR ? data[i].TDAHOR.toString() : null,
              t_istri: data[i].TISTRI ? data[i].TISTRI.toString() : null,
            },
          });

          const resultTaspen = await tx.dataTaspen.create({
            data: {
              nopen: data[i].NOTAS.toString(),
              nama: data[i].NAMA_PENERIMA,
              nama_skep: data[i].NAMA_PENERIMA || null,
              no_skep: data[i].NOSKEP.toString() || null,
              kode_jiwa: data[i].KDJIWA.toString() || null,
              no_telepon: null,
              nik: null,
              masa_ktp: null,
              npwp: null,
              pendidikan: null,
              jenis_kelamin: null,
              agama: null,
              masa_kerja: null,
              status_rumah: null,
              menempati_tahun: null,
              nama_ibu_kandung: null,
              pekerjaan_sekarang: null,
              alamat_pekerjaan: null,
              jenis_usaha: null,
              status_kawin: null,
              nomor_sk_pensiun: null,
              tanggal_sk_pensiun: null,
              tanggal_lahir: data[i].TGLLAHIR_PENERIMA.toString() || null,
              tmt_pensiun: data[i].TMTPENS.toString() || null,
              penerbit_sk: null,
              golongan: data[i].PANGKAT || null,
              jenis_pensiun: data[i].JNSPENS || null,
              nipnrp: data[i].NIPNRP.toString() || null,
              status_peserta: data[i].STATUS_PESERTA || null,
              jandadudaypdari: data[i].JANDADUDAYPDARI || null,
              tanggal_lahir_jandadudayp:
                data[i].TGLLAHIR_JANDADUDAYP.toString() || null,
              is_active: true,
              created_at: new Date(),
              updated_at: new Date(),
              awal_flagging: data[i].AWAL_FLAGGING
                ? data[i].AWAL_FLAGGING.toString()
                : null,
              akhir_flagging: data[i].AKHIR_FLAGGING
                ? data[i].AKHIR_FLAGGING.toString()
                : null,
              blth_rincian: data[i].BLTHRINCIAN
                ? data[i].BLTHRINCIAN.toString()
                : null,
              cicilan: data[i].CICILAN ? data[i].CICILAN.toString() : null,
              jenis_hutang: data[i].JENISHUTANG
                ? data[i].JENISHUTANG.toString()
                : null,
              jumlah_kotor: data[i].JMLKOTOR
                ? data[i].JMLKOTOR.toString()
                : null,
              jumlah_potongan: data[i].JMLPOTONGAN
                ? data[i].JMLPOTONGAN.toString()
                : null,
              jumlah_total: data[i].JMLTOTAL
                ? data[i].JMLTOTAL.toString()
                : null,
              jumlah_hutang: data[i].JUMLAH_HUTANG
                ? data[i].JUMLAH_HUTANG.toString()
                : null,
              kantor_cabang: data[i].KANTOR_CABANG
                ? data[i].KANTOR_CABANG.toString()
                : null,
              jenis_dapem: data[i].JNSDAPEM
                ? data[i].JNSDAPEM.toString()
                : null,
              ktr_bay_dapem: data[i].KTRBAYDAPEM
                ? data[i].KTRBAYDAPEM.toString()
                : null,
              mitra_flagging: data[i].MITRA_FLAGGING
                ? data[i].MITRA_FLAGGING.toString()
                : null,
              no_dosir: data[i].NODOSIR ? data[i].NODOSIR.toString() : null,
              no_rek: data[i].NOREK ? data[i].NOREK.toString() : null,
              nu_dapem: data[i].NUDAPEM ? data[i].NUDAPEM.toString() : null,
              pembulatan: data[i].PEMBULATAN
                ? data[i].PEMBULATAN.toString()
                : null,
              penpok: data[i].PENPOK ? data[i].PENPOK.toString() : null,

              status_dapem: data[i].STSDAPEM
                ? data[i].STSDAPEM.toString()
                : null,
              tanggal_sekarang: data[i].TGL_SEKARANG
                ? data[i].TGL_SEKARANG.toString()
                : null,
              tanggal_surat: data[i].TGL_SURAT
                ? data[i].TGL_SURAT.toString()
                : null,
              tkd: data[i].TKD ? data[i].TKD.toString() : null,
              tmt_stop: data[i].TMT_STOP ? data[i].TMT_STOP.toString() : null,
              tpmtp: data[i].TPMTP ? data[i].TPMTP.toString() : null,
              tpp: data[i].TPP ? data[i].TPP.toString() : null,
              tpph21: data[i].TPPH21 ? data[i].TPPH21.toString() : null,
              dataDomisiliId: saveDomisili.id,
              dataPasanganId: dataPasangan.id,
              tunjanganPotonganId: dataTunjanganPotongan.id,
            },
          });
          const keluargas: DataKeluarga[] =
            data[i].KELUARGA &&
            data[i].KELUARGA.map((k: any) => {
              return {
                nama: k.NAMA_KELUARGA || null,
                hubungan: null,
                no_telepon: null,
                alamat: null,
                tanggal_lahir: k.TGL_LAHIR.toString() || null,
                tanggal_wafat: k.TGL_WAFAT.toString() || null,
                no_kk: k.NO_KK.toString() || null,
                no_ktp: k.NO_KTP.toString() || null,
                no_skep: k.NO_SKEP.toString() || null,
                npwp: k.NPWP.toString() || null,
                kode_tunjang: k.KODE_TUNJANG.toString() || null,
                keterangan: k.KETERANGAN || null,
                hak_bagi: parseFloat(k.HAKBAGI_PENSIUN) || null,
                tat_tunjang: k.TAT_TUNJANG.toString() || null,
                tmt_tunjang: k.TMT_TUNJANG.toString() || null,
                gelar_depan: k.GELAR_DEPAN.toString() || null,
                gelar_akhir: k.GELAR_AKHIR.toString() || null,
                dataTaspenId: resultTaspen.id,
              };
            });
          await tx.dataKeluarga.createMany({
            data: keluargas,
          });
        }
      },
      {
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
      }
    );
    return NextResponse.json(
      { msg: "Data Taspen berhasil disimpan" },
      { status: 201, statusText: "OK" }
    );
  } catch (err) {
    console.log({ err });
    return NextResponse.json(
      { msg: "Server Error" },
      { status: 500, statusText: "INTERNAL SERVER ERROR" }
    );
  }
};
