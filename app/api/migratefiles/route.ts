import { NextResponse } from "next/server";
import prisma from "@/components/prisma";
import ExcelJS from "exceljs";
import moment from "moment";

export const GET = async () => {
  try {
    const find = await prisma.dataPengajuan.findMany({
      where: {
        is_active: true,
      },
      include: {
        DataPencairan: true,
        BerkasPengajuan: true,
        DataPembiayaan: {
          include: {
            Produk: true,
            JenisPembiayaan: true,
            User: {
              include: { UnitCabang: { include: { UnitPelayanan: true } } },
            },
          },
        },
        Bank: { include: { products: true } },
        DataTaspen: {
          include: { DataKeluarga: true, DataPasangan: true, Domisili: true },
        },
        DataPengajuanAlamat: true,
        DataPengajuanPasangan: true,
        User: {
          include: {
            UnitCabang: {
              include: { UnitPelayanan: true },
            },
          },
        },
        JadwalAngsuran: true,
      },
    });

    const data: any[] = [];
    const sumdan: any[] = [];
    const produk: any[] = [];
    const jenis: any[] = [];
    const insurance: any[] = [];
    const banpot: any[] = [
      {
        id: "PAY0001",
        name: "PT POS INDONESIA",
        code: "KANTOR POS",
        relate: [
          "POS",
          "KPP",
          "KPRK",
          "KANTOR POS",
          "KP",
          "KPC",
          "POSINDO",
          "KCP",
        ],
        status_mitra: true,
        status: true,
        created_at: new Date(),
      },
      {
        id: "PAY0002",
        name: "BANK RAKYAT INDONESIA",
        code: "BRI",
        relate: ["BRI", "BANK BRI"],
        status_mitra: true,
        status: true,
        created_at: new Date(),
      },
      {
        id: "PAY0003",
        name: "BANK BTPN",
        code: "BTPN",
        relate: ["BTPN", "SMBC", "BANK BTP CATU GARUT"],
        status_mitra: true,
        status: true,
        created_at: new Date(),
      },
      {
        id: "PAY0004",
        name: "BANK MANDIRI TASPEN",
        code: "MANDIRI TASPEN",
        relate: ["MANDIRI TASPEN", "MANTAP"],
        status_mitra: true,
        status: true,
        created_at: new Date(),
      },
      {
        id: "PAY0005",
        name: "BANK DP TASPEN",
        code: "DP TASPEN",
        relate: ["DP TASPEN"],
        status_mitra: true,
        status: true,
        created_at: new Date(),
      },
      {
        id: "PAY0006",
        name: "BANK WOORI SAUDARA",
        code: "BWS",
        relate: ["BWS", "BANK BWS", "BANK WOORI SAUDARA", "BAK BOORI SAUDARA"],
        status_mitra: true,
        status: true,
        created_at: new Date(),
      },
      {
        id: "PAY0007",
        name: "BANK JABAR",
        code: "BJB",
        relate: ["BJB", "BANK BJB", "BANK JABAR"],
        status_mitra: true,
        status: true,
        created_at: new Date(),
      },
      {
        id: "PAY0008",
        name: "BANK SYARIAH INDONESIA",
        code: "BSI",
        relate: ["BSI", "BANK BSI"],
        status_mitra: true,
        status: true,
        created_at: new Date(),
      },
      {
        id: "PAY0009",
        name: "BANK TABUNGAN NEGARA",
        code: "BTN",
        relate: ["BTN", "BANK BTN"],
        status_mitra: true,
        status: true,
        created_at: new Date(),
      },
      {
        id: "PAY0010",
        name: "BANK KB BUKOPIN",
        code: "BUKOPIN",
        relate: ["BUKOPIN", "KB", "BANK KB", "BUKOOPIN"],
        status_mitra: true,
        status: true,
        created_at: new Date(),
      },
      {
        id: "PAY0011",
        name: "BANK JAWA TENGAH",
        code: "JATENG",
        relate: ["JATENG"],
        status_mitra: true,
        status: true,
        created_at: new Date(),
      },
      {
        id: "PAY0012",
        name: "BANK BUMI ARTHA",
        code: "BBA",
        relate: ["BUMI ARTHA", "BANK BBA", "BANK BUMI ARTA"],
        status_mitra: true,
        status: true,
        created_at: new Date(),
      },
      {
        id: "PAY0013",
        name: "BANK BANTEN",
        code: "BANTEN",
        relate: ["BANTEN", "BANK BANTEN"],
        status_mitra: true,
        status: true,
        created_at: new Date(),
      },
      {
        id: "PAY0014",
        name: "BANK NEGARA INDONESIA",
        code: "BNI",
        relate: ["BNI"],
        status_mitra: true,
        status: true,
        created_at: new Date(),
      },
      {
        id: "PAY0015",
        name: "BANK JATIM JEMBER",
        code: "BANK JATIM JEMBER",
        relate: ["JATIM JEMBER"],
        status_mitra: true,
        status: true,
        created_at: new Date(),
      },
      {
        id: "PAY0016",
        code: "BANK DKI",
        name: "BANK DKI",
        relate: ["BANK DKI", "BANK DKI CABANG WALIKOTA JAKSEL"],
        status_mitra: true,
        status: true,
        created_at: new Date(),
      },
      {
        id: "PAY0017",
        code: "BANK LAMPUNG",
        name: "BANK LAMPUNG",
        relate: ["BANK LAMPUNG"],
        status_mitra: true,
        status: true,
        created_at: new Date(),
      },
      {
        id: "PAY0018",
        code: "BANK BPB",
        name: "BANK BPB",
        relate: ["BPB CAPEM SUDIRMAN"],
        status_mitra: true,
        status: true,
        created_at: new Date(),
      },
      {
        id: "PAY0019",
        code: "BANK BWC",
        name: "BANK BWC",
        relate: ["BWC KC SEMARANG"],
        status_mitra: true,
        status: true,
        created_at: new Date(),
      },
      {
        id: "PAY0020",
        code: "BPD KAS",
        name: "BPD KAS",
        relate: ["BPD KAS", "BPD KAS WIROBRAJAN"],
        status_mitra: true,
        status: true,
        created_at: new Date(),
      },
      {
        id: "PAY0021",
        code: "BANK JATIM",
        name: "BANK JATIM",
        relate: ["BANK JATIM"],
        status_mitra: true,
        status: true,
        created_at: new Date(),
      },
    ];
    const debitur: any[] = [];
    const agent: any[] = [];
    const area: any[] = [];
    const cabang: any[] = [];
    const user: any[] = [];
    const dropping: any[] = [];
    const angsurans: any[] = [];

    for (const dapem of find) {
      let findSumdan = sumdan.find((s) => s.id === dapem.bankId);
      let findProduk = produk.find(
        (p) => p.id === dapem.DataPembiayaan?.produk_id,
      );
      let findJenis = jenis.find(
        (j) => j.id === dapem.DataPembiayaan?.jenis_pembiayaan_id,
      );
      let findInsurance = insurance.find(
        (j) => j.name === dapem.jenis_asuransi,
      );
      const juruBayarTujuan = (dapem.DataPembiayaan?.juru_bayar_tujuan ?? "")
        .toUpperCase()
        .trim();
      const juruBayarAsal = (dapem.DataPembiayaan?.juru_bayar_asal ?? "")
        .toUpperCase()
        .trim();

      let findBanpot = juruBayarTujuan
        ? banpot.find((j) => {
            const nameMatch = juruBayarTujuan.includes(j.name.toUpperCase());
            const codeMatch = juruBayarTujuan.includes(j.code.toUpperCase());
            const relateMatch =
              Array.isArray(j.relate) &&
              j.relate.some((keyword: string) =>
                juruBayarTujuan.includes(keyword.toUpperCase()),
              );

            return nameMatch || codeMatch || relateMatch;
          })
        : undefined;

      let findPrevBanpot = juruBayarAsal
        ? banpot.find((j) => {
            const nameMatch = juruBayarAsal.includes(j.name.toUpperCase());
            const codeMatch = juruBayarAsal.includes(j.code.toUpperCase());
            const relateMatch =
              Array.isArray(j.relate) &&
              j.relate.some((keyword: string) =>
                juruBayarAsal.includes(keyword.toUpperCase()),
              );

            return nameMatch || codeMatch || relateMatch;
          })
        : undefined;
      let findDeb = debitur.find((d) => d.nopen === dapem.nopen);
      let findAgent = agent.find((d) => d.name === dapem.agent_fronting);
      let findArea = area.find(
        (d) => d.id === dapem.User?.UnitCabang?.unit_pelayanan_id,
      );
      let findCabang = cabang.find((d) => d.id === dapem.User?.unit_cabang_id);
      let findAO = user.find((d) => d.id === dapem.user_id);
      let findAdmin = user.find((d) => d.id === dapem.DataPembiayaan?.user_id);
      let findDropping = dropping.find((d) => d.id === dapem.dataPencairanId);

      // 1. Sumdan & Produk
      if (!findSumdan && dapem.bankId) {
        const tempSumdan = {
          id: dapem.bankId,
          name: dapem.Bank?.name || "-",
          code: dapem.Bank?.kode || "-",
          phone: dapem.Bank?.no_telepon || "",
          email: dapem.Bank?.email || "",
          address: dapem.Bank?.alamat || "",
          description: null,
          contract_no: "",
          contract_no2: "",
          contract_date: new Date(),
          contract_date2: new Date(),
          limit: 0,
          tbo: 4,
          pic: "",
          status: dapem.Bank?.is_active ?? true,
          created_at: dapem.Bank?.created_at || new Date(),
          new_id: generateID("MITRA", 4, sumdan.length + 1),
        };
        findSumdan = tempSumdan;
        sumdan.push(tempSumdan);

        if (dapem.Bank && Array.isArray(dapem.Bank.products)) {
          const tempProduk = dapem.Bank.products
            .filter((p) => !produk.some((pp) => pp.id === p.id))
            .map((p, i) => ({
              id: p.id,
              name: p.name,
              c_adm_sumdan: dapem.Bank?.by_admin_bank || 0,
              c_margin_bank: dapem.Bank?.margin_bank || 0,
              c_account: dapem.Bank?.by_buka_rekening || 0,
              c_provisi: dapem.Bank?.by_provisi || 0,
              c_adm: dapem.Bank?.by_admin || 0,
              c_margin: (p.mg_bunga || 0) - (dapem.Bank?.margin_bank || 0),
              c_insurance: p.by_asuransi || 0,
              c_gov: dapem.Bank?.by_tatalaksana || 0,
              c_stamp: dapem.Bank?.by_materai || 0,
              c_information:
                (dapem.Bank?.by_flagging || 0) + (dapem.Bank?.by_epotpen || 0),
              c_rounded: dapem.Bank?.pembulatan || 0,
              c_banpot: 0,
              c_ned: 0,
              c_max_bpp: 0,
              status: p.is_active,
              margin_type: dapem.jenis_margin || "-",
              min_age: p.min_age || 0,
              max_age: p.max_age || 0,
              max_paid_age: p.max_usia_lunas || 0,
              min_tenor: 0,
              max_tenor: p.max_tenor || 0,
              min_plafond: 0,
              max_plafond: p.max_plafon || 0,
              min_salary: 0,
              min_rem_salary: 100000,
              sumdanId: tempSumdan.new_id,
              newId: generateID(
                (dapem.Bank?.kode || "P")
                  .replace("BPR", "")
                  .replace("BANK", ""),
                2,
                i + 1,
              ),
            }));
          produk.push(...tempProduk);
          if (!findProduk) {
            findProduk = tempProduk.find(
              (pp) => pp.id === dapem.DataPembiayaan?.produk_id,
            );
          }
        }
      }

      // 2. Jenis Pembiayaan
      if (!findJenis && dapem.DataPembiayaan?.jenis_pembiayaan_id) {
        const tempJenis = {
          id: dapem.DataPembiayaan.jenis_pembiayaan_id,
          name: dapem.DataPembiayaan.JenisPembiayaan?.name || "-",
          blokir: 2,
          c_mutasi: dapem.DataPembiayaan.JenisPembiayaan?.by_mutasi || 0,
          description: "",
          status_mutasi: dapem.DataPembiayaan.JenisPembiayaan?.name
            ?.toLowerCase()
            .includes("mutasi")
            ? true
            : false,
          status_takeover: dapem.DataPembiayaan.JenisPembiayaan?.name
            ?.toLowerCase()
            .includes("takeover")
            ? true
            : false,
          status: dapem.DataPembiayaan.JenisPembiayaan?.is_active ?? true,
          created_at: new Date(),
          newId: generateID("J", 3, jenis.length + 1),
        };
        findJenis = tempJenis;
        jenis.push(tempJenis);
      }

      // 3. Juru Bayar Tujuan (Banpot)
      if (!findBanpot && dapem.DataPembiayaan?.juru_bayar_tujuan) {
        const tempBanpot = {
          id: generateID("PAY", 3, banpot.length + 1),
          name: dapem.DataPembiayaan.juru_bayar_tujuan,
          code: dapem.DataPembiayaan.juru_bayar_tujuan,
          status_mitra: true,
          status: true,
          created_at: new Date(),
        };
        findBanpot = tempBanpot;
        banpot.push(tempBanpot);
      }

      // 4. Juru Bayar Asal (Prev Banpot)
      if (!findPrevBanpot && dapem.DataPembiayaan?.juru_bayar_asal) {
        const tempPrevBanpot = {
          id: generateID("PAY", 3, banpot.length + 1),
          name: dapem.DataPembiayaan.juru_bayar_asal,
          code: dapem.DataPembiayaan.juru_bayar_asal,
          status_mitra: false,
          status: true,
          created_at: new Date(),
        };
        findPrevBanpot = tempPrevBanpot;
        banpot.push(tempPrevBanpot);
      }

      // 5. Asuransi
      if (!findInsurance && dapem.jenis_asuransi) {
        const tempInsurance = {
          id: generateID("INSC", 3, insurance.length + 1),
          name: dapem.jenis_asuransi,
          code: dapem.jenis_asuransi,
          status: true,
          created_at: new Date(),
        };
        findInsurance = tempInsurance;
        insurance.push(tempInsurance);
      }

      // 6. Debitur
      if (!findDeb) {
        const tempDeb = {
          nopen: dapem.nopen,
          fullname: dapem.nama || dapem.DataPembiayaan?.name || "-",
          birthdate: dapem.DataPembiayaan?.tanggal_lahir
            ? moment(dapem.DataPembiayaan.tanggal_lahir, "DD-MM-YYYY").toDate()
            : null,
          birthplace: dapem.DataPembiayaan?.tempat_lahir || "",
          gender: dapem.jenis_kelamin || "",
          nik: dapem.nik || "",
          mother_name: dapem.nama_ibu_kandung || "",
          salary: dapem.DataPembiayaan?.gaji_bersih || 0,
          cost_month: 0,
          education: dapem.pendidikan || "",
          religion: dapem.agama || "",
          npwp: dapem.npwp || "",
          id_publisher: "",
          id_publisher_date: null,
          address: `${dapem.DataPengajuanAlamat?.alamat || ""} RT ${
            dapem.DataPengajuanAlamat?.rt || ""
          } RW ${dapem.DataPengajuanAlamat?.rw || ""}`,
          ward: dapem.DataPengajuanAlamat?.kelurahan || "",
          district: dapem.DataPengajuanAlamat?.kecamatan || "",
          city: dapem.DataPengajuanAlamat?.kota || "",
          province: dapem.DataPengajuanAlamat?.provinsi || "",
          pos_code: dapem.DataPengajuanAlamat?.kode_pos || "",
          name_skep: dapem.nama_skep || "",
          date_skep: dapem.tanggal_sk_pensiun || null,
          no_skep: dapem.nomor_sk_pensiun || "",
          soul_code: dapem.kode_jiwa || "",
          tmt_skep: dapem.tmt_pensiun || null,
          job_year: dapem.masa_kerja || 0,
          group_skep: dapem.jenis_pensiun || "",
          rank_skep: dapem.golongan || "",
          publisher_skep: dapem.penerbit_sk || "",
          payOfficeId: findBanpot?.id || "",
        };
        debitur.push(tempDeb);
        findDeb = tempDeb;
      }

      // 7. Agent
      if (!findAgent && dapem.agent_fronting) {
        const tempAgent = {
          id: generateID("A", 3, agent.length + 1),
          name: dapem.agent_fronting,
          code: dapem.agent_fronting,
          status: true,
          created_at: new Date(),
        };
        agent.push(tempAgent);
        findAgent = tempAgent;
      }

      // 8. Area (Unit Pelayanan)
      if (!findArea) {
        const tempArea = {
          id:
            dapem.User?.UnitCabang?.unit_pelayanan_id ||
            generateID("REG", 3, area.length + 1),
          name: dapem.User?.UnitCabang?.UnitPelayanan?.name || "N/A",
          status: true,
          created_at: new Date(),
          newId: generateID("REG", 3, area.length + 1),
        };
        findArea = tempArea;
        area.push(tempArea);
      }

      // 9. Cabang
      if (!findCabang) {
        const tempCabang = {
          id:
            dapem.User?.unit_cabang_id ||
            generateID("UNIT", 4, cabang.length + 1),
          name: dapem.User?.UnitCabang?.name || "N/A",
          address: "",
          phone: "",
          status: true,
          created_at: new Date(),
          areaId: findArea.newId,
          newId: generateID("UNIT", 4, cabang.length + 1),
        };
        findCabang = tempCabang;
        cabang.push(tempCabang);
      }

      // 10. User AO
      if (!findAO && dapem.user_id) {
        const tempAO = {
          id: dapem.user_id,
          fullname:
            `${dapem.User?.first_name || ""} ${dapem.User?.last_name || ""}`.trim(),
          nik: dapem.User?.nik || dapem.User?.nip || "",
          username: dapem.User?.username || "",
          password: dapem.User?.password || "",
          email: dapem.User?.email || "",
          phone: dapem.User?.no_telepon || "",
          position: dapem.User?.posisi || "",
          target: dapem.User?.target || 0,
          pkwt_status: dapem.User?.status_pkwt || "",
          awal_pkwt: null,
          akhir_pkwt: null,
          roleId: "RL005",
          cabangId: findCabang.newId,
          status: true,
          created_at: new Date(),
          newId: generateID("U", 5, user.length + 1),
        };
        findAO = tempAO;
        user.push(tempAO);
      }

      // 11. User Admin
      if (!findAdmin && dapem.DataPembiayaan?.user_id) {
        const tempAdmin = {
          id: dapem.DataPembiayaan.user_id,
          fullname: `${dapem.DataPembiayaan.User?.first_name || ""} ${
            dapem.DataPembiayaan.User?.last_name || ""
          }`.trim(),
          nik:
            dapem.DataPembiayaan.User?.nik ||
            dapem.DataPembiayaan.User?.nip ||
            "",
          username: dapem.DataPembiayaan.User?.username || "",
          password: dapem.DataPembiayaan.User?.password || "",
          email: dapem.DataPembiayaan.User?.email || "",
          phone: dapem.DataPembiayaan.User?.no_telepon || "",
          position: dapem.DataPembiayaan.User?.posisi || "",
          target: dapem.DataPembiayaan.User?.target || 0,
          pkwt_status: dapem.DataPembiayaan.User?.status_pkwt || "",
          awal_pkwt: null,
          akhir_pkwt: null,
          roleId: "RL005",
          cabangId: findCabang.newId,
          status: true,
          created_at: new Date(),
          newId: generateID("U", 5, user.length + 1),
        };
        findAdmin = tempAdmin;
        user.push(tempAdmin);
      }

      // 12. Dropping
      if (!findDropping && dapem.status_pencairan === "TRANSFER") {
        const tempDropping = {
          id:
            dapem.DataPencairan?.nomor_surat ||
            generateID("DRP", 5, dropping.length + 1),
          created_at: dapem.DataPencairan?.tanggal_cetak || null,
          process_at: dapem.DataPencairan?.tanggal_proses || null,
          file_sub: dapem.DataPencairan?.berkas_si || "",
          file_proof: dapem.DataPencairan?.bukti_transfer || "",
          newId: generateID("DRP", 5, dropping.length + 1),
        };
        findDropping = tempDropping;
        dropping.push(tempDropping);
      }

      // Array Data Utama
      const dId = generateID("P", 6, data.length + 1);
      data.push({
        id: dId,
        nopen: dapem.nopen || "",
        salary: dapem.DataPembiayaan?.gaji_bersih || 0,
        address: `${dapem.DataPengajuanAlamat?.alamat_domisili || ""} RT ${
          dapem.DataPengajuanAlamat?.rt_domisili || ""
        } RW ${dapem.DataPengajuanAlamat?.rw_domisili || ""}`,
        ward: dapem.DataPengajuanAlamat?.kelurahan_domisili || "",
        district: dapem.DataPengajuanAlamat?.kecamatan_domisili || "",
        city: dapem.DataPengajuanAlamat?.kota_domisili || "",
        province: dapem.DataPengajuanAlamat?.provinsi_domisili || "",
        pos_code: dapem.DataPengajuanAlamat?.kode_pos_domisili || "",
        house_status: dapem.status_rumah || "",
        house_year: dapem.menempati_tahun || "",
        job: dapem.pekerjaan_sekarang || "",
        job_address: dapem.alamat_pekerjaan || "",
        businness: dapem.jenis_usaha || "",
        marriage_status: dapem.status_kawin || "",
        aw_name: dapem.DataTaspen?.DataPasangan?.nama_pasangan || "",
        aw_nik: dapem.DataTaspen?.DataPasangan?.nik_pasangan || "",
        aw_birthplace:
          dapem.DataTaspen?.DataPasangan?.tempat_lahir_pasangan || "",
        aw_birthdate:
          dapem.DataTaspen?.DataPasangan?.tanggal_lahir_pasangan || null,
        aw_job: dapem.DataTaspen?.DataPasangan?.pekerjaan_pasangan || "",
        aw_phone: "",
        aw_relate: "",
        aw_address: dapem.DataTaspen?.DataPasangan?.alamat_pasangan || "",
        aw_rt: dapem.DataTaspen?.DataPasangan?.rt_pasangan || "",
        aw_rw: dapem.DataTaspen?.DataPasangan?.rw_pasangan || "",
        aw_ward: dapem.DataTaspen?.DataPasangan?.kelurahan_pasangan || "",
        aw_district: dapem.DataTaspen?.DataPasangan?.kecamatan_pasangan || "",
        aw_city: dapem.DataTaspen?.DataPasangan?.kota_pasangan || "",
        aw_province: dapem.DataTaspen?.DataPasangan?.provinsi_pasangan || "",
        aw_pos_code: dapem.DataTaspen?.DataPasangan?.kode_pos_pasangan || "",
        f_name: dapem.DataPengajuanPasangan?.nama_keluarga_tidak_serumah || "",
        f_phone: dapem.DataPengajuanPasangan?.no_telepon_keluarga || "",
        f_relate: dapem.DataPengajuanPasangan?.hubungan || "",
        f_address: dapem.DataPengajuanPasangan?.alamat_keluarga || "",
        f_ward: "",
        f_district: "",
        f_city: "",
        f_province: "",
        f_pos_code: "",
        used_for: dapem.tujuan_penggunaan1 || "",
        produkId: findProduk?.newId || "",
        jenisId: findJenis?.newId || "",
        prevPayOfficeId: findPrevBanpot?.id || "",
        payOfficeId: findBanpot?.id || "",
        insuranceId: findInsurance?.id || "",
        account_number: dapem.DataPembiayaan?.no_rekening || "",
        account_name: dapem.DataPembiayaan?.nama_bank || "",
        takeover_from: dapem.DataPembiayaan?.pembiayaan_sebelumnya || "",
        est_takeover_date: null,
        tenor: dapem.DataPembiayaan?.tenor || 0,
        plafond: dapem.DataPembiayaan?.plafond || 0,
        c_rounded: dapem.DataPembiayaan?.pembulatan || 0,
        margin_type: dapem.jenis_margin || "",
        c_margin_bank: dapem.DataPembiayaan?.margin_bank || 0,
        c_margin:
          (dapem.DataPembiayaan?.mg_bunga || 0) -
          (dapem.DataPembiayaan?.margin_bank || 0),
        c_adm: dapem.DataPembiayaan?.by_admin || 0,
        c_adm_sumdan: dapem.DataPembiayaan?.by_admin_bank || 0,
        c_account: dapem.DataPembiayaan?.by_buka_rekening || 0,
        c_provisi: dapem.DataPembiayaan?.by_provisi || 0,
        c_insurance: dapem.DataPembiayaan?.by_asuransi || 0,
        c_gov: dapem.DataPembiayaan?.by_tatalaksana || 0,
        c_stamp: dapem.DataPembiayaan?.by_materai || 0,
        c_information:
          (dapem.DataPembiayaan?.by_epotpen || 0) +
          (dapem.DataPembiayaan?.by_flagging || 0),
        c_mutasi: dapem.DataPembiayaan?.by_mutasi || 0,
        blokir: dapem.DataPembiayaan?.blokir || 0,
        c_takeover: dapem.DataPembiayaan?.pelunasan || 0,
        c_bpp: dapem.DataPembiayaan?.bpp || 0,
        c_ned: 0,
        c_banpot: 0,
        agentFrontingId: findAgent?.id || "",
        userId: findAdmin?.newId || "",
        aoId: findAO?.newId || "",
        contract_no: dapem.nomor_akad || "",
        contract_date: dapem.tanggal_cetak_akad || null,
        tbo: 0,
        tbo_date: null,
        slik_status: dapem.status_slik || "",
        slik_desc: JSON.stringify({
          date: dapem.tanggal_slik,
          name: dapem.nama_pemeriksa_slik,
          desc: dapem.keterangan_slik,
        }),
        verif_status: dapem.status_verifikasi || "",
        verif_desc: JSON.stringify({
          date: dapem.tanggal_verifikasi,
          name: dapem.nama_pemeriksa_verifikasi,
          desc: dapem.keterangan_verifikasi,
        }),
        approv_status: dapem.status_approval || "",
        approv_desc: JSON.stringify({
          date: dapem.tanggal_approval,
          name: dapem.nama_pemeriksa_approval,
          desc: dapem.keterangan_approval,
        }),
        dropping_status: dapem.status_pencairan || "",
        droppingId: dapem.DataPencairan?.nomor_surat || "",
        takeover_status: dapem.BerkasPengajuan?.pelunasan
          ? "DISETUJUI"
          : "DRAFT",
        mutasi_status: dapem.BerkasPengajuan?.mutasi ? "DISETUJUI" : "DRAFT",
        flagging_status: dapem.BerkasPengajuan?.mutasi ? "DISETUJUI" : "DRAFT",
        cash_status: "DRAFT",
        file_slik: dapem.BerkasPengajuan?.berkas_slik
          ? `https://sipboss.kpfi.co.id${dapem.BerkasPengajuan.berkas_slik}`
          : "",
        file_sub: dapem.BerkasPengajuan?.berkas_pengajuan
          ? `https://sipboss.kpfi.co.id${dapem.BerkasPengajuan.berkas_pengajuan}`
          : "",
        file_interview: dapem.BerkasPengajuan?.video_wawancara
          ? `https://sipboss.kpfi.co.id${dapem.BerkasPengajuan.video_wawancara}`
          : "",
        file_insurance: dapem.BerkasPengajuan?.video_asuransi
          ? `https://sipboss.kpfi.co.id${dapem.BerkasPengajuan.video_asuransi}`
          : "",
        file_takeover: dapem.BerkasPengajuan?.pelunasan
          ? `https://sipboss.kpfi.co.id${dapem.BerkasPengajuan.pelunasan}`
          : "",
        file_mutasi: dapem.BerkasPengajuan?.mutasi
          ? `https://sipboss.kpfi.co.id${dapem.BerkasPengajuan.mutasi}`
          : "",
        file_flagging: dapem.BerkasPengajuan?.flagging
          ? `https://sipboss.kpfi.co.id${dapem.BerkasPengajuan.flagging}`
          : "",
        status: dapem.is_active,
        created_at: dapem.DataPembiayaan?.tanggal_input || new Date(),
      });
      dapem.JadwalAngsuran.forEach((a, i) =>
        angsurans.push({
          id: generateID(`${dId}INST`, 3, i + 1),
          counter: a.angsuran_ke,
          principal: a.pokok,
          margin: a.margin,
          date_pay: a.tanggal_bayar,
          date_paid: a.tanggal_pelunasan,
          remaining: a.sisa,
          inst_sumdan: a.margin_bank,
          fee_bapot: 0,
          c_ned: 0,
          note: null,
          dapemId: dId,
        }),
      );
    }

    // Export Excel Sheet dengan Header Otomatis dari Key Object
    const workbook = new ExcelJS.Workbook();

    const writeSheet = (sheetName: string, rows: any[]) => {
      if (rows.length === 0) return;
      const worksheet = workbook.addWorksheet(sheetName);

      // Ambil kunci object sebagai Header Kolom Excel
      const headers = Object.keys(rows[0]).map((key) => ({
        header: key,
        key: key,
      }));
      worksheet.columns = headers;
      worksheet.addRows(rows);
    };

    writeSheet("sumdan", sumdan);
    writeSheet("produk", produk);
    writeSheet("jenis", jenis);
    writeSheet("area", area);
    writeSheet("cabang", cabang);
    writeSheet("user", user);
    writeSheet("asuransi", insurance);
    writeSheet("banpot", banpot);
    writeSheet("debitur", debitur);
    writeSheet("dapem", data);
    writeSheet("angsurans", angsurans);
    writeSheet("dropping", dropping);

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=data_pengajuan.xlsx",
      },
    });
  } catch (err: any) {
    console.error("Export Excel Error:", err);
    return NextResponse.json(
      { status: 500, msg: err?.message || "Internal Server Error", info: err },
      { status: 500 },
    );
  }
};

function generateID(
  prefix: string,
  padLength: number = 4,
  lastCount: number = 0,
) {
  return `${prefix}${String(lastCount).padStart(padLength, "0")}`;
}
