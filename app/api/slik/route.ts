import { NextRequest, NextResponse } from "next/server";
import prisma from "@/components/prisma";
import { daysInMonth } from "@/components/utils/inputUtils";
import { getServerSession } from "next-auth";
import { DataDataPengajuan } from "@/components/utils/Interfaces";
import moment from "moment";
export const dynamic = "force-dynamic";

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
          { status_slik: "ANTRI" },
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
          { status_slik: "ANTRI" },
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
        { status_slik: "ANTRI" },
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
  if (!findUser)
    return NextResponse.json(
      { msg: "Gagal membuat pengajuan.. mohon login ulang" },
      { status: 400, statusText: "BAD REQUEST" }
    );
  data.DataPembiayaan.user_id = findUser.id;
  try {
    const findPengajuan = await prisma.dataPengajuan.findFirst({
      where: {
        AND: [
          { DataPembiayaan: { nopen: data.DataPembiayaan.nopen } },
          { is_active: true, status_lunas: false },
        ],
      },
    });

    if (findPengajuan && data.DataPembiayaan.jenis_pembiayaan_id) {
      return NextResponse.json(
        {
          msg: "Nopen ini masih memiliki pinjaman di KPF!",
        },
        { status: 400, statusText: "BAD REQUEST" }
      );
    }
    data.DataPembiayaan.is_simulasi = false;

    const find = await prisma.dataTaspen.findFirst({
      where: { nopen: data.DataPembiayaan.nopen },
    });

    const findProduk = await prisma.produk.findFirst({
      where: { id: data.DataPembiayaan.produk_id },
    });
    const trans = await prisma.$transaction(async (tx) => {
      const berkas = await tx.berkasPengajuan.create({
        data: {
          berkas_pengajuan:
            data.BerkasPengajuan && data.BerkasPengajuan.berkas_pengajuan
              ? data.BerkasPengajuan.berkas_pengajuan
              : null,
          berkas_slik:
            data.BerkasPengajuan && data.BerkasPengajuan.berkas_slik
              ? data.BerkasPengajuan.berkas_slik
              : null,
          berkas_idpb:
            data.BerkasPengajuan && data.BerkasPengajuan.berkas_idpb
              ? data.BerkasPengajuan.berkas_idpb
              : null,
          berkas_flagging:
            data.BerkasPengajuan && data.BerkasPengajuan.berkas_flagging
              ? data.BerkasPengajuan.berkas_flagging
              : null,
          video_wawancara:
            data.BerkasPengajuan && data.BerkasPengajuan.video_wawancara
              ? data.BerkasPengajuan.video_wawancara
              : null,
          video_asuransi:
            data.BerkasPengajuan && data.BerkasPengajuan.video_asuransi
              ? data.BerkasPengajuan.video_asuransi
              : null,
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

      let dataTaspenId = "";
      if (find) {
        dataTaspenId = find.id;
      } else {
        let saveTaspen = await prisma.$transaction(async (tx) => {
          const domisili = await tx.dataDomisili.create({
            data: data.Domisili,
          });
          const pasangan = await tx.dataPasangan.create({
            data: {
              nama_pasangan: data.DataKeluarga.nama_pasangan || null,
              tempat_lahir_pasangan:
                data.DataKeluarga.tempat_lahir_pasangan || null,
              tanggal_lahir_pasangan:
                data.DataKeluarga.tanggal_lahir_pasangan || null,
              nik_pasangan: data.DataKeluarga.nik_pasangan || null,
              masa_ktp_pasangan: data.DataKeluarga.masa_ktp_pasangan || null,
              pekerjaan_pasangan: data.DataKeluarga.pekerjaan_pasangan || null,
              alamat_pasangan: data.DataKeluarga.alamat_pasangan || null,
              rt_pasangan: data.DataKeluarga.rt_pasangan || null,
              rw_pasangan: data.DataKeluarga.rw_pasangan || null,
              kelurahan_pasangan: data.DataKeluarga.kelurahan_pasangan || null,
              kecamatan_pasangan: data.DataKeluarga.kecamatan_pasangan || null,
              kota_pasangan: data.DataKeluarga.kota_pasangan || null,
              provinsi_pasangan: data.DataKeluarga.provinsi_pasangan || null,
              kode_pos_pasangan: data.DataKeluarga.kode_pos_pasangan || null,
            },
          });
          const potongan = await tx.tunjanganPotongan.create({
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
          let taspen = await tx.dataTaspen.create({
            data: {
              nopen: data.nopen,
              nama: data.nama,
              nama_skep: data.nama_skep,
              no_skep: data.nomor_sk_pensiun,
              kode_jiwa: data.kode_jiwa,
              no_telepon: data.no_telepon,
              nik: data.nik,
              masa_ktp: moment(data.masa_ktp || new Date()).format(
                "YYYY-mm-DD"
              ),
              npwp: data.npwp,
              pendidikan: data.pendidikan,
              jenis_kelamin: data.jenis_kelamin,
              agama: data.agama,
              masa_kerja: data.masa_kerja || null,
              status_rumah: data.status_rumah,
              menempati_tahun: data.menempati_tahun || null,
              nama_ibu_kandung: data.nama_ibu_kandung,
              pekerjaan_sekarang: data.pekerjaan_sekarang,
              alamat_pekerjaan: data.alamat_pekerjaan,
              jenis_usaha: data.jenis_usaha,
              status_kawin: data.status_kawin,
              nomor_sk_pensiun: data.nomor_sk_pensiun,
              tanggal_sk_pensiun: data.tanggal_sk_pensiun,
              tanggal_lahir: data.tanggal_lahir,
              tanggal_wafat: null,
              tanggal_nikah: null,
              akhir_sks: null,
              tmt_pensiun: data.tmt_pensiun,
              penerbit_sk: data.penerbit_sk,
              golongan: data.golongan,
              jenis_pensiun: data.jenis_pensiun,
              nipnrp: null,
              status_peserta: "PENSIUN",
              jandadudaypdari: null,
              tanggal_lahir_jandadudayp: null,
              awal_flagging: null,
              akhir_flagging: null,
              alamat_cabang: null,
              blth_rincian: null,
              cicilan: null,
              jenis_hutang: null,
              jumlah_kotor: null,
              jumlah_potongan: null,
              jumlah_total: null,
              jumlah_hutang: null,
              jenis_dapem: null,
              kantor_cabang: null,
              ktr_bay_dapem: null,
              mitra_flagging: null,
              no_dosir: null,
              no_rek: data.no_rekening,
              nu_dapem: null,
              pembulatan: (1).toFixed(0),
              penpok: data.DataPembiayaan.gaji_bersih.toString(),
              status_dapem: null,

              tanggal_sekarang: null,
              tanggal_surat: null,
              tkd: null,
              tmt_stop: null,
              tpmtp: null,
              tpp: null,
              tpph21: null,
              no_kk: null,
              no_ktp: data.nik,
              data_tidak_baik: false,
              is_active: true,
              created_at: new Date(),
              updated_at: new Date(),

              dataDomisiliId: domisili.id,
              dataPasanganId: pasangan.id,
              tunjanganPotonganId: potongan.id,
            },
          });
          let keluarga = [
            {
              nama: data.DataKeluarga.nama_keluarga_tidak_serumah,
              hubungan: data.DataKeluarga.hubungan,
              no_telepon: data.DataKeluarga.no_telepon,
              alamat: data.DataKeluarga.alamat,
              tanggal_lahir: null,
              tanggal_wafat: null,
              tanggal_nikah: null,
              akhir_sks: null,
              no_kk: null,
              no_ktp: null,
              no_skep: null,
              npwp: null,
              kode_tunjang: null,
              keterangan: null,
              hak_bagi: null,
              tat_tunjang: null,
              tmt_tunjang: null,
              gelar_depan: null,
              gelar_akhir: null,
              dataTaspenId: taspen.id,
            },
          ];
          if (data.status_kawin === "KAWIN") {
            keluarga.push({
              nama: data.DataKeluarga.nama_pasangan,
              hubungan: data.DataKeluarga.tempat_lahir_pasangan,
              no_telepon: null,
              alamat: null,
              tanggal_lahir: data.DataKeluarga.tanggal_lahir_pasangan,
              tanggal_wafat: null,
              tanggal_nikah: null,
              akhir_sks: null,
              no_kk: null,
              no_ktp: null,
              no_skep: null,
              npwp: null,
              kode_tunjang: null,
              keterangan: null,
              hak_bagi: null,
              tat_tunjang: null,
              tmt_tunjang: null,
              gelar_depan: null,
              gelar_akhir: null,
              dataTaspenId: taspen.id,
            });
          }
          await tx.dataKeluarga.createMany({ data: keluarga });
          return taspen.id;
        });
        dataTaspenId = saveTaspen;
      }

      const result =
        findProduk && findProduk.name === "Flash Sisa Gaji"
          ? await tx.dataPengajuan.create({
              data: {
                tujuan_penggunaan1: data.tujuan_penggunaan1,
                tujuan_penggunaan2: data.tujuan_penggunaan2,
                golongan: data.golongan,
                jenis_pensiun: data.jenis_pensiun,
                geo_location: data.geo_location || null,
                agent_fronting: data.agent_fronting || null,
                user_id: data.user_id,
                data_pembiayaan_id: biaya.id,
                berkasPengajuanId: berkas.id,
                status_verifikasi: "ANTRI",
                keterangan_verifikasi: "VERIFIKASI PASS",
                tanggal_verifikasi: new Date(),
                status_slik: "SETUJU",
                keterangan_slik: "SLIK PASS",
                tanggal_slik: new Date(),
                status_checker: "SETUJU",
                tanggal_checker: new Date(),
                status_maker: "SETUJU",
                tanggal_maker: new Date(),
                status_approval: "ANTRI",
                dataTaspenId: dataTaspenId,
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
                agent_fronting: data.agent_fronting || null,
                user_id: data.user_id,
                data_pembiayaan_id: biaya.id,
                berkasPengajuanId: berkas.id,
                status_verifikasi: "ANTRI",
                status_slik: "ANTRI",
                dataTaspenId: dataTaspenId,
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
    return NextResponse.json(
      { trans, msg: "Pengajuan berhasil" },
      { status: 200, statusText: "OK" }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Server Error" },
      { status: 500, statusText: "INTERNAL SERVER ERROR" }
    );
  }
};
export const PUT = async (req: NextRequest) => {
  const data = await req.json();
  const session = await getServerSession();
  const findUser = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });
  if (!findUser)
    return NextResponse.json(
      { msg: "Gagal membuat pengajuan.. mohon login ulang" },
      { status: 400, statusText: "BAD REQUEST" }
    );
  data.DataPembiayaan.user_id = findUser.id;
  try {
    const findPengajuan = await prisma.dataPengajuan.findFirst({
      where: { id: data.id },
      include: {
        BerkasPengajuan: true,
        DataPembiayaan: true,
      },
    });
    data.DataPembiayaan.is_simulasi = false;
    const trans = await prisma.$transaction(async (tx) => {
      await tx.berkasPengajuan.update({
        where: { id: findPengajuan?.berkasPengajuanId as string },
        data: {
          berkas_slik: data.BerkasPengajuan.berkas_slik
            ? data.BerkasPengajuan.berkas_slik
            : findPengajuan?.BerkasPengajuan?.berkas_slik,
          berkas_pengajuan: data.BerkasPengajuan.berkas_pengajuan
            ? data.BerkasPengajuan.berkas_pengajuan
            : findPengajuan?.BerkasPengajuan?.berkas_pengajuan,
          video_wawancara: data.BerkasPengajuan.video_wawancara
            ? data.BerkasPengajuan.video_wawancara
            : findPengajuan?.BerkasPengajuan?.video_wawancara,
          video_asuransi: data.BerkasPengajuan.video_asuransi
            ? data.BerkasPengajuan.video_asuransi
            : findPengajuan?.BerkasPengajuan?.video_asuransi,
        },
      });
      data.DataPembiayaan.user_id = findPengajuan?.DataPembiayaan.user_id;
      const biaya = await tx.dataPembiayaan.update({
        where: { id: findPengajuan?.data_pembiayaan_id },
        data: data.DataPembiayaan,
      });
      const pengajuanKeluarga = await tx.dataPengajuanKeluarga.update({
        where: { id: findPengajuan?.dataPengajuanKeluargaId },
        data: data.DataKeluarga,
      });
      const domisili = await tx.dataPengajuanAlamat.update({
        where: { id: findPengajuan?.dataPengajuanAlamatId as string },
        data: data.Domisili,
      });

      const result = await tx.dataPengajuan.update({
        where: { id: findPengajuan?.id },
        data: {
          tujuan_penggunaan1: data.tujuan_penggunaan1
            ? data.tujuan_penggunaan1
            : findPengajuan?.tujuan_penggunaan1,
          tujuan_penggunaan2: data.tujuan_penggunaan2
            ? data.tujuan_penggunaan2
            : findPengajuan?.tujuan_penggunaan2,
          golongan: data.golongan ? data.golongan : findPengajuan?.golongan,
          jenis_pensiun: data.jenis_pensiun
            ? data.jenis_pensiun
            : findPengajuan?.jenis_pensiun,
          geo_location: data.geo_location
            ? data.geo_location
            : findPengajuan?.geo_location,
          agent_fronting: data.agent_fronting
            ? data.agent_fronting
            : findPengajuan?.agent_fronting,
          user_id: data.user_id ? data.user_id : findPengajuan?.user_id,
          jenis_margin: data.jenis_margin
            ? data.jenis_margin
            : findPengajuan?.jenis_margin,
          nik: data.nik ? data.nik : findPengajuan?.nik,
          masa_ktp: data.masa_ktp ? data.masa_ktp : findPengajuan?.masa_ktp,
          npwp: data.npwp ? data.npwp : findPengajuan?.npwp,
          pendidikan: data.pendidikan
            ? data.pendidikan
            : findPengajuan?.pendidikan,
          jenis_kelamin: data.jenis_kelamin
            ? data.jenis_kelamin
            : findPengajuan?.jenis_kelamin,
          agama: data.agama ? data.agama : findPengajuan?.agama,
          masa_kerja: data.masa_kerja
            ? data.masa_kerja
            : findPengajuan?.masa_kerja,
          status_rumah: data.status_rumah
            ? data.status_rumah
            : findPengajuan?.status_rumah,
          menempati_tahun: data.menempati_tahun
            ? data.menempati_tahun
            : findPengajuan?.menempati_tahun,
          nama_ibu_kandung: data.nama_ibu_kandung
            ? data.nama_ibu_kandung
            : findPengajuan?.nama_ibu_kandung,
          pekerjaan_sekarang: data.pekerjaan_sekarang
            ? data.pekerjaan_sekarang
            : findPengajuan?.pekerjaan_sekarang,
          jenis_usaha: data.jenis_usaha
            ? data.jenis_usaha
            : findPengajuan?.jenis_usaha,
          status_kawin: data.status_kawin
            ? data.status_kawin
            : findPengajuan?.status_kawin,
          nomor_sk_pensiun: data.nomor_sk_pensiun
            ? data.nomor_sk_pensiun
            : findPengajuan?.nomor_sk_pensiun,
          tmt_pensiun: data.tmt_pensiun
            ? data.tmt_pensiun
            : findPengajuan?.tmt_pensiun,
          penerbit_sk: data.penerbit_sk
            ? data.penerbit_sk
            : findPengajuan?.penerbit_sk,
          no_telepon: data.no_telepon
            ? data.no_telepon
            : findPengajuan?.no_telepon,
          tanggal_sk_pensiun: data.tanggal_sk_pensiun
            ? data.tanggal_sk_pensiun
            : findPengajuan?.tanggal_sk_pensiun,
          alamat_pekerjaan: data.alamat_pekerjaan
            ? data.alamat_pekerjaan
            : findPengajuan?.alamat_pekerjaan,
          nama: data.nama ? data.nama : findPengajuan?.nama,
          nama_skep: data.nama ? data.nama_skep : findPengajuan?.nama_skep,
          kode_jiwa: data.kode_jiwa ? data.kode_jiwa : findPengajuan?.kode_jiwa,
        },
      });

      return result;
    });
    return NextResponse.json(
      { trans, msg: "Update Pengajuan berhasil" },
      { status: 200, statusText: "OK" }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Gagal membuat pengajuan. Coba lagi!" },
      { status: 500, statusText: "INTERNAL SERVER ERROR" }
    );
  }
};
