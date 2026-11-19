import moment from "moment";
import { DataDataPengajuan } from "../utils/Interfaces";
import { getFullAge, IDRFormat } from "../Utils";
import { getUsiaTanggalLunas } from "../utils/inputUtils";
import { getAngsuranPerBulan } from "../views/simulasi/simulasiUtil";
import { ceiling } from "../v1/appUtils";

moment.locale("id");

const generateMAUK = (record: DataDataPengajuan) => {
  const { year, month, day } = getFullAge(
    moment(record.DataPembiayaan.tanggal_lahir, "DD-MM-YYYY").format(
      "YYYY-MM-DD",
    ),
    moment().format("YYYY-MM-DD"),
  );
  const lunas = getUsiaTanggalLunas(
    moment().format("YYYY-MM-DD"),
    moment(record.DataPembiayaan.tanggal_lahir, "DD-MM-YYYY").format(
      "YYYY-MM-DD",
    ),
    record.DataPembiayaan.tenor,
  );

  const angsuran = getAngsuranPerBulan(
    record.DataPembiayaan.mg_bunga,
    record.DataPembiayaan.tenor,
    record.DataPembiayaan.plafond,
  );
  const angsuran_sumdan = getAngsuranPerBulan(
    record.DataPembiayaan.margin_bank,
    record.DataPembiayaan.tenor,
    record.DataPembiayaan.plafond,
  );
  const angsuranBulanan = ceiling(parseFloat(angsuran), record.Bank.pembulatan);
  const angsuranMaksimal =
    record.DataPembiayaan.gaji_bersih * (record.Bank.by_angsuran / 100);
  const rasio =
    record.DataPembiayaan.gaji_bersih > 0
      ? (angsuranBulanan / record.DataPembiayaan.gaji_bersih) * 100
      : 0;

  const html = `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }

        html, body {
          height: 100%;
          font-family: Cambria, Georgia, 'Times New Roman', Times, serif;
          font-size: 14px;
          text-align: justify;
        }

        /* Pemisah halaman */
        .page-break {
          page-break-before: always;
          break-before: page;
          display: block;
          height: 0;
          border: none;
        }
          @media print {
            .page {
              position: relative;
              min-height: 95vh;    /* atau height A4 jika untuk print */
              padding-top: 80px;    /* ruang untuk header */
              page-break-after: always;
            }
    
            .page .page-header {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              padding: 10px;
              text-align: center;
              background: white;
              border-bottom: 1px solid #ccc;
            }
          }
      </style>
    </head>
    <body class="bg-white text-gray-800 leading-relaxed p-4 max-w-200">
        <p class="text-lg font-bold text-center border-b border-gray-600 pb-4">MEMO CREDIT COMMITTEE</p>

        <div class="page" style="font-size: 11px;">
            <div class="flex gap-8">
                <div class="flex-1">
                    <div class="flex gap-4 font-bold text-sm">
                        <p>I. </p>
                        <p>Informasi</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Kantor Cabang</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPembiayaan.User.UnitCabang.name || ""}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Nama</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.nama || record.DataPembiayaan.name || ""}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Nomor Pensiun</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.nopen || record.DataPembiayaan.nopen}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Tanggal Lahir</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPembiayaan.tanggal_lahir}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Status Pembiayaan</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPembiayaan.JenisPembiayaan?.name}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Kantor Bayar Lama</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPembiayaan.juru_bayar_asal}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Kantor Bayar Baru</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPembiayaan.juru_bayar_tujuan}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Take Over ke</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPembiayaan.pembiayaan_sebelumnya}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Tanggal Take Over</p>
                        <p class="w-4">:</p>
                        <p class="flex-1"></p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Sumber Dana</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.Bank.name}</p>
                    </div>

                    <div class="flex gap-4 font-bold mt-4 text-sm">
                        <p>II. </p>
                        <p>Pemohon Calon Debitur</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">1.</p>
                        <p class="w-40">Nama Calon Debitur</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.nama || record.DataPembiayaan.name}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">2.</p>
                        <p class="w-40">Plafond Kredit Yang dimohon</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${IDRFormat(record.DataPembiayaan.plafond)}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">3.</p>
                        <p class="w-40">Jangka Waktu</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPembiayaan.tenor} Bulan</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">4.</p>
                        <p class="w-40">Status Pembiayaan</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPembiayaan.JenisPembiayaan?.name} Bulan</p>
                    </div>

                    <div class="flex gap-4 font-bold mt-4 text-sm">
                        <p>III. </p>
                        <p>Informasi Calon Debitur</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">1.</p>
                        <p class="w-40">Nama</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.nama || record.DataPembiayaan.name}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">2.</p>
                        <p class="w-40">Jenis Kelamin</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.jenis_kelamin}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">3.</p>
                        <p class="w-40">No. KTP</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.nik}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">4.</p>
                        <p class="w-40">No. NPWP</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.npwp}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">5.</p>
                        <p class="w-40">Tempat/Tgl Lahir</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPembiayaan.tempat_lahir}, ${record.DataPembiayaan.tanggal_lahir}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">6.</p>
                        <p class="w-40">Usia</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${year} Tahun ${month} Bulan ${day} Hari</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">7.</p>
                        <p class="w-40">Status Kawin</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.status_kawin}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">8.</p>
                        <p class="w-40">Alamat</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPengajuanAlamat.alamat} RT ${record.DataPengajuanAlamat.rt} RW ${record.DataPengajuanAlamat.rw}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">9.</p>
                        <p class="w-40">Kelurahan</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPengajuanAlamat.kelurahan}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">10.</p>
                        <p class="w-40">Kecamatan</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPengajuanAlamat.kecamatan}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">11.</p>
                        <p class="w-40">Kabupaten/Kota</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPengajuanAlamat.kota}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">12.</p>
                        <p class="w-40">Provinsi</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPengajuanAlamat.provinsi}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">13.</p>
                        <p class="w-40">Kode Pos</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPengajuanAlamat.kode_pos}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">14.</p>
                        <p class="w-40">No Telepon</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.no_telepon}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">15.</p>
                        <p class="w-40">Status Tempat Tinggal</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.status_rumah}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">16.</p>
                        <p class="w-40">Lama Menetap/Tinggal</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.menempati_tahun}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">17.</p>
                        <p class="w-40">Nama Ibu Kandung</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.nama_ibu_kandung}</p>
                    </div>

                    <div class="flex gap-4 mt-4 text-sm">
                        <p></p>
                        <p>DATA HUBUNGAN KELUARGA SEBAGAI AHLI WARIS</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">18.</p>
                        <p class="w-40">Nama</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPengajuanPasangan.nama_pasangan}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">19.</p>
                        <p class="w-40">No. KTP</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPengajuanPasangan.nik_pasangan}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">20.</p>
                        <p class="w-40">Tempat, Tanggal Lahir</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPengajuanPasangan.tempat_lahir_pasangan}, ${record.DataPengajuanPasangan.tanggal_lahir_pasangan}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">21.</p>
                        <p class="w-40">No Akta Nikah</p>
                        <p class="w-4">:</p>
                        <p class="flex-1"></p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">22.</p>
                        <p class="w-40">Dikeluarkan di</p>
                        <p class="w-4">:</p>
                        <p class="flex-1"></p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">23.</p>
                        <p class="w-40">Tgl Keluar Akta Nikah</p>
                        <p class="w-4">:</p>
                        <p class="flex-1"></p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">24.</p>
                        <p class="w-40">No. Kartu Keluarga</p>
                        <p class="w-4">:</p>
                        <p class="flex-1"></p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">25.</p>
                        <p class="w-40">Tangal Kartu Keluarga</p>
                        <p class="w-4">:</p>
                        <p class="flex-1"></p>
                    </div>

                </div>

                <div class="flex-1">
                    <div class="flex gap-4 font-bold text-sm">
                        <p>IV.</p>
                        <p>Informasi Surat Keputusan Pensiun (SKEP)</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Nama</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.nama_skep || ""}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">No. SK</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.nomor_sk_pensiun || ""}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Tanggal SK</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.tanggal_sk_pensiun}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Instansi</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.jenis_pensiun}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">No Pensiun</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.nopen}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Gaji Pensiun</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">Rp. ${IDRFormat(record.DataPembiayaan.gaji_bersih)}</p>
                    </div>
                    
                    <div class="flex gap-4 font-bold text-sm">
                        <p>V.</p>
                        <p>Perhitungan dan Usulan Plafond Kredit</p>
                    </div>
                    <p class="font-bold">Permohonan Calon Debitur</p>
                    <div class="flex gap-2">
                        <p class="w-40">Plafond</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">Rp. ${IDRFormat(record.DataPembiayaan.plafond)}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Jangka Waktu</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPembiayaan.tenor} Bulan</p>
                    </div>
                    <p class="font-bold">Informasi Keuangan</p>
                    <div class="flex gap-2">
                        <p class="w-40">Gaji Pensiun</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">Rp. ${IDRFormat(record.DataPembiayaan.gaji_bersih)}</p>
                    </div>
                    <p class="font-bold">Perhitungan Limit Kredit</p>
                    <div class="flex gap-2">
                        <p class="w-40">DSR Maksimal</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.Bank.by_angsuran}%</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Angsuran Maksimal</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">Rp. ${IDRFormat(angsuranMaksimal)}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Suku Bunga</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPembiayaan.mg_bunga}%</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">J. Waktu Maksimal</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPembiayaan.Produk.max_tenor} Bulan</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Limit Maksimal</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">Rp. ${IDRFormat(record.DataPembiayaan.Produk.max_plafon)}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Limit Kredit Diusulkan</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">Rp. ${IDRFormat(record.DataPembiayaan.plafond)}</p>
                    </div>

                    <div class="flex gap-4 font-bold text-sm">
                        <p>VI.</p>
                        <p>Keputusan Kredit</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Plafond</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">Rp. ${IDRFormat(record.DataPembiayaan.plafond)}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Jangka Waktu</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPembiayaan.Produk.max_tenor} Bulan</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Usia Masuk</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${year} Tahun ${month} Bulan ${day} Tahun</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Usia Lunas</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${year} Tahun ${month} Bulan ${day} Tahun</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Angsuran</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">Rp. ${IDRFormat(angsuranBulanan)}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Rate Koperasi</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${record.DataPembiayaan.mg_bunga}%</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-40">Rasio</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">${rasio.toFixed(2)}%</p>
                    </div>

                    <p class="font-bold mt-4">Biaya-Biaya</p>
                    <div class="flex gap-2">
                        <p class="w-4">a.</p>
                        <p class="w-40">Administrasi</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">Rp. ${IDRFormat(record.DataPembiayaan.plafond * (record.DataPembiayaan.by_admin / 100))}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">b.</p>
                        <p class="w-40">Provisi</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">Rp. ${IDRFormat(record.DataPembiayaan.plafond * (record.DataPembiayaan.by_provisi / 100))}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">c.</p>
                        <p class="w-40">Premi asuransi</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">Rp. ${IDRFormat(record.DataPembiayaan.plafond * (record.DataPembiayaan.by_asuransi / 100))}</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">d.</p>
                        <p class="w-40">Koperasi</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">Rp. 0</p>
                    </div>
                    <div class="flex gap-2">
                        <p class="w-4">e.</p>
                        <p class="w-40">Buka Tabungan</p>
                        <p class="w-4">:</p>
                        <p class="flex-1">Rp. ${IDRFormat(record.DataPembiayaan.by_buka_rekening)}</p>
                    </div>

                </div>
            </div>
        </div>

    </body>
  </html>
  `;

  return html;
};

export const printMAUKStandar = (record: DataDataPengajuan) => {
  const htmlContent = generateMAUK(record);

  const w = window.open("", "_blank");
  if (!w) {
    alert("Popup diblokir. Mohon izinkan popup dari situs ini.");
    return;
  }

  w.document.open();
  w.document.write(htmlContent);
  w.document.close();
  w.onload = function () {
    setTimeout(() => {
      w.print();
    }, 200);
  };
};
