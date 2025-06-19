import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import { getServerSession } from "next-auth";
import { daysInMonth } from "@/components/utils/inputUtils";

export const GET = async (req: NextRequest) => {
  const page: number = <any>req.nextUrl.searchParams.get("page") || 1;
  const name = req.nextUrl.searchParams.get("name");
  const year =
    req.nextUrl.searchParams.get("year") || new Date().getFullYear().toString();

  const skip = (page - 1) * 20;
  let result: DataDataPengajuan[] = [];

  const session = await getServerSession();
  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });

  if (!user) return NextResponse.json({ data: [], total: 0 }, { status: 401 });

  if (name) {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        AND: [
          { status_verifikasi: "ANTRI" },
          { is_active: true },
          { DataPembiayaan: { user_id: user.id } },
          {
            DataPembiayaan: {
              OR: [{ name: { contains: name } }, { nopen: { contains: name } }],
            },
          },
        ],
      },
      include: {
        DataPembiayaan: {
          include: {
            Produk: {
              include: {
                Bank: true,
              },
            },
            JenisPembiayaan: true,
            Refferal: true,
            User: {
              include: {
                UnitCabang: {
                  include: {
                    UnitPelayanan: true,
                  },
                },
              },
            },
          },
        },
        User: {
          include: {
            UnitCabang: {
              include: { UnitPelayanan: true },
            },
          },
        },
        BerkasPengajuan: true,
        Bank: true,
        DataPengajuanAlamat: true,
        DataPengajuanPasangan: true,
        DataTaspen: {
          include: {
            DataKeluarga: true,
            Domisili: true,
            DataPasangan: true,
            TunjanganPotongan: true,
          },
        },
      },
    });
  } else {
    result = <any>await prisma.dataPengajuan.findMany({
      where: {
        AND: [
          { status_verifikasi: "ANTRI" },
          { DataPembiayaan: { user_id: user.id } },
          { is_active: true },
          {
            DataPembiayaan: {
              created_at: {
                gte: new Date(`${year}-01-01`),
                lte: new Date(
                  `${year}-12-${daysInMonth(12, parseInt(year.toString()))}`
                ),
              },
            },
          },
        ],
      },
      include: {
        DataPembiayaan: {
          include: {
            Produk: {
              include: {
                Bank: true,
              },
            },
            JenisPembiayaan: true,
            Refferal: true,
            User: {
              include: {
                UnitCabang: {
                  include: {
                    UnitPelayanan: true,
                  },
                },
              },
            },
          },
        },
        User: {
          include: {
            UnitCabang: {
              include: { UnitPelayanan: true },
            },
          },
        },
        BerkasPengajuan: true,
        Bank: true,
        DataPengajuanAlamat: true,
        DataPengajuanPasangan: true,
        DataTaspen: {
          include: {
            DataKeluarga: true,
            Domisili: true,
            DataPasangan: true,
            TunjanganPotongan: true,
          },
        },
      },
      skip: skip,
      take: 20,
    });
  }
  const total = await prisma.dataPengajuan.count({
    where: {
      AND: [
        { status_verifikasi: "ANTRI" },
        { DataPembiayaan: { user_id: user.id } },
        { is_active: true },
        {
          DataPembiayaan: {
            created_at: {
              gte: new Date(`${year}-01-01`),
              lte: new Date(
                `${year}-12-${daysInMonth(12, parseInt(year.toString()))}`
              ),
            },
          },
        },
      ],
    },
  });
  return NextResponse.json(
    { data: result, total: name ? result.length : total },
    { status: 200 }
  );
};

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  const session = await getServerSession();
  const findUser = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });
  if (!findUser) {
    return NextResponse.json(
      { msg: "Gagal membuat pengajuan.. mohon login ulang!" },
      { status: 400, statusText: "BAD REQUEST" }
    );
  }
  data.DataPembiayaan.user_id = findUser.id;
  try {
    if (data.is_flash === true) {
      const findPengajuan = await prisma.dataPengajuan.findFirst({
        where: {
          AND: [
            { DataPembiayaan: { nopen: data.DataPembiayaan.nopen } },
            { is_active: true, status_lunas: false },
          ],
        },
      });
      if (findPengajuan) {
        return NextResponse.json(
          {
            msg: "Nopen ini memiliki pinjaman yang belum lunas atau masih dalam proses!",
          },
          { status: 400, statusText: "BAD REQUEST" }
        );
      }
    }
    data.DataPembiayaan.is_simulasi = false;

    const nopen = await prisma.dataTaspen.findFirst({
      where: { nopen: data.DataPembiayaan.nopen },
    });
    let taspen = null;
    if (nopen) {
      taspen = nopen.id;
      await prisma.dataTaspen.update({
        where: { id: nopen.id },
        data: data,
      });
    } else {
      let result = await prisma.$transaction(async (tx) => {
        const domisiliTaspen = await tx.dataDomisili.create({
          data: {
            alamat: data.alamat,
            rt: data.rt,
            rw: data.rw,
            kelurahan: data.kelurahan,
            kecamatan: data.kecamatan,
            kota: data.kota,
            provinsi: data.provinsi,
            kode_pos: data.kode_pos,
            alamat_domisili: data.alamat_domisili,
            rt_domisili: data.rt_domisili,
            rw_domisili: data.rw_domisili,
            kelurahan_domisili: data.kelurahan_domisili,
            kecamatan_domisili: data.kecamatan_domisili,
            kota_domisili: data.kota_domisili,
            provinsi_domisili: data.provinsi_domisili,
            geo_location: data.geo_location,
            kode_pos_domisili: data.kode_pos_domisili,
          },
        });
        const pasanganTaspen = await tx.dataPasangan.create({
          data: {
            nama_pasangan: data.pengajuanKeluarga.nama_pasangan,
            tempat_lahir_pasangan: data.pengajuanKeluarga.tempat_lahir_pasangan,
            tanggal_lahir_pasangan:
              data.pengajuanKeluarga.tanggal_lahir_pasangan,
            nik_pasangan: data.pengajuanKeluarga.nik_pasangan,
            masa_ktp_pasangan: data.pengajuanKeluarga.masa_ktp_pasangan,
            pekerjaan_pasangan: data.pengajuanKeluarga.pekerjaan_pasangan,
            alamat_pasangan: data.pengajuanKeluarga.alamat_pasangan,
            rt_pasangan: data.pengajuanKeluarga.rt_pasangan,
            rw_pasangan: data.pengajuanKeluarga.rw_pasangan,
            kelurahan_pasangan: data.pengajuanKeluarga.kelurahan_pasangan,
            kecamatan_pasangan: data.pengajuanKeluarga.kecamatan_pasangan,
            kota_pasangan: data.pengajuanKeluarga.kota_pasangan,
            provinsi_pasangan: data.pengajuanKeluarga.provinsi_pasangan,
            kode_pos_pasangan: data.pengajuanKeluarga.kode_pos_pasangan,
          },
        });
        const tunjanganPotongan = await tx.tunjanganPotongan.create({
          data: {
            t_anak: null,
            t_istri: null,
            t_beras: null,
            t_cacat: null,
            t_dahor: null,
            pot_alimentasi: null,
            pot_askes: null,
            pot_assos: null,
            pot_ganti_rugi: null,
            pot_kasda: null,
            pot_kpkn: null,
            pot_pph21: null,
            pot_sewa_rumah: null,
            kpkn: null,
            spn: null,
          },
        });
        const saveTaspen = await tx.dataTaspen.create({
          data: {
            ...data,
            dataDomisiliId: domisiliTaspen.id,
            dataPasanganId: pasanganTaspen.id,
            tunjanganPotonganId: tunjanganPotongan.id,
          },
        });
        let keluargaTaspen = [
          { ...data.DataKeluarga, dataTaspenId: saveTaspen.id },
        ];
        if (data.status_kawin === "KAWIN") {
          keluargaTaspen.push({
            nama: data.pengajuanKeluarga.nama_pasangan,
            hubungan: "SUAMI ISTRI",
            no_telepon: null,
            alamat: data.pengajuanKeluarga.alamat_pasangan,
            tanggal_lahir: data.pengajuanKeluarga.tanggal_lahir_pasangan,
            tanggal_wafat: null,
            tanggal_nikah: null,
            akhir_sks: null,
            no_kk: null,
            no_ktp: data.pengajuanKeluarga.nik_pasangan,
            no_skep: null,
            npwp: null,
            kode_tunjang: null,
            keterangan: null,
            hak_bagi: "1",
            tat_tunjang: null,
            tmt_tunjang: null,
            gelar_depan: null,
            gelar_akhir: null,
            dataTaspenId: saveTaspen.id,
          });
        }
        await tx.dataKeluarga.createMany({
          data: keluargaTaspen,
        });
        return saveTaspen.id;
      });
      taspen = result;
    }

    // Transaction
    const trans = await prisma.$transaction(async (tx) => {
      const berkas = await tx.berkasPengajuan.create({
        data: {
          berkas_slik: data.BerkasPengajuan.berkas_slik || null,
          berkas_pengajuan: data.BerkasPengajuan.berkas_pengajuan || null,
          video_wawancara: data.BerkasPengajuan.video_wawancara || null,
          video_asuransi: data.BerkasPengajuan.video_asuransi || null,
        },
      });
      const biaya = await tx.dataPembiayaan.create({
        data: data.DataPembiayaan,
      });
      const pengajuanKeluarga = await tx.dataPengajuanKeluarga.create({
        data: data.DataKeluarga,
      });
      const domisili = await tx.dataPengajuanAlamat.create({
        data: data.Domisili,
      });
      const result =
        data.is_flash === true
          ? await tx.dataPengajuan.create({
              data: {
                tujuan_penggunaan1: data.tujuan_penggunaan1,
                tujuan_penggunaan2: data.tujuan_penggunaan2,
                golongan: data.golongan,
                jenis_pensiun: data.jenis_pensiun,
                geo_location: data.geo_location || null,
                agent_fronting: data.agent_fronting,
                user_id: data.user_id,
                data_pembiayaan_id: biaya.id,
                berkasPengajuanId: berkas.id,
                status_verifikasi: "SETUJU",
                tanggal_verifikasi: new Date(),
                status_slik: "SETUJU",
                tanggal_slik: new Date(),
                status_checker: "SETUJU",
                tanggal_checker: new Date(),
                status_maker: "SETUJU",
                tanggal_maker: new Date(),
                status_approval: "ANTRI",
                dataTaspenId: taspen,
                bankId: data.bankId,
                dataPengajuanKeluargaId: pengajuanKeluarga.id,
                jenis_margin: data.jenis_margin,
                dataPengajuanAlamatId: domisili.id,
                nopen: data.nopen,
                nama: data.DataPembiayaan.nama,
                nama_skep: data.nama_skep,
                kode_jiwa: data.kode_jiwa,
                nik: data.nik,
                masa_ktp: data.masa_ktp,
                npwp: data.npwp,
                pendidikan: data.pendidikan,
                jenis_kelamin: data.jenis_kelamin,
                agama: data.agama,
                masa_kerja: data.masa_kerja,
                status_rumah: data.status_rumah,
                menempati_tahun: data.menempati_tahun,
                nama_ibu_kandung: data.nama_ibu_kandung,
                pekerjaan_sekarang: data.pekerjaan_sekarang,
                jenis_usaha: data.jenis_usaha,
                status_kawin: data.status_kawin,
                nomor_sk_pensiun: data.nomor_sk_pensiun,
                tmt_pensiun: data.tmt_pensiun,
                penerbit_sk: data.penerbit_sk,
                no_telepon: data.no_telepon,
                tanggal_sk_pensiun: data.tanggal_sk_pensiun,
                alamat_pekerjaan: data.alamat_pekerjaan,
              },
            })
          : await tx.dataPengajuan.create({
              data: {
                tujuan_penggunaan1: data.tujuan_penggunaan1,
                tujuan_penggunaan2: data.tujuan_penggunaan2,
                golongan: data.golongan,
                jenis_pensiun: data.jenis_pensiun,
                geo_location: data.geo_location || null,
                agent_fronting: data.agent_fronting,
                user_id: data.user_id,
                data_pembiayaan_id: biaya.id,
                berkasPengajuanId: berkas.id,
                status_verifikasi: "ANTRI",
                dataTaspenId: taspen,
                bankId: data.bankId,
                dataPengajuanKeluargaId: pengajuanKeluarga.id,
                jenis_margin: data.jenis_margin,
                dataPengajuanAlamatId: domisili.id,
                nopen: data.nopen,
                nama: data.nama,
                nama_skep: data.nama_skep,
                kode_jiwa: data.kode_jiwa,
                nik: data.nik,
                masa_ktp: data.masa_ktp,
                npwp: data.npwp,
                pendidikan: data.pendidikan,
                jenis_kelamin: data.jenis_kelamin,
                agama: data.agama,
                masa_kerja: data.masa_kerja,
                status_rumah: data.status_rumah,
                menempati_tahun: data.menempati_tahun,
                nama_ibu_kandung: data.nama_ibu_kandung,
                pekerjaan_sekarang: data.pekerjaan_sekarang,
                jenis_usaha: data.jenis_usaha,
                status_kawin: data.status_kawin,
                nomor_sk_pensiun: data.nomor_sk_pensiun,
                tmt_pensiun: data.tmt_pensiun,
                penerbit_sk: data.penerbit_sk,
                no_telepon: data.no_telepon,
                tanggal_sk_pensiun: data.tanggal_sk_pensiun,
                alamat_pekerjaan: data.alamat_pekerjaan,
              },
            });
      return result;
    });
    // End Transaction
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Gagal membuat pengajuan. coba lagi nanti!" },
      { status: 500 }
    );
  }
};
