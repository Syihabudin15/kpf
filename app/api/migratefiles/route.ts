import { NextResponse } from "next/server";
import { existsSync, promises as fs } from "fs";
import path from "path";
import { getContainerClient } from "@/libs/Azure";
import prisma from "@/components/prisma";
import { fileFromPath } from "formdata-node/file-from-path";
import ExcelJS from "exceljs";

const containerClient = getContainerClient();

export const GET = async () => {
  try {
    const find = await prisma.dataPengajuan.findMany({
      where: {
        is_active: true,
        // DataPembiayaan: { is_active: true },
        berkasPengajuanId: { not: null },
      },
      include: {
        DataPencairan: true,
        BerkasPengajuan: true,
        DataPembiayaan: true,
        DataTaspen: {
          include: { DataKeluarga: true, DataPasangan: true, Domisili: true },
        },
      },
      take: 10,
    });

    const data: any = [];
    for (const dapeng of find) {
      let dapem: any = {
        fullname: dapeng.DataPembiayaan.name,
        nopen: dapeng.DataPembiayaan.nopen,
        gaji: dapeng.DataPembiayaan.gaji_bersih,
      };
      // const keluarga = dapeng.DataTaspen?.DataKeluarga;
      // const pasangan = dapeng.DataTaspen?.DataPasangan;
      // const domisili = dapeng.DataTaspen?.Domisili;

      const filesToMigrate = [
        { path: dapeng.BerkasPengajuan?.berkas_slik, folder: "file_slik" },
        { path: dapeng.BerkasPengajuan?.berkas_pengajuan, folder: "file_sub" },
        {
          path: dapeng.BerkasPengajuan?.video_wawancara,
          folder: "file_interview",
        },
        {
          path: dapeng.BerkasPengajuan?.video_asuransi,
          folder: "file_insurance",
        },
        { path: dapeng.BerkasPengajuan?.berkas_akad, folder: "file_akad" },
        { path: dapeng.BerkasPengajuan?.video_akad, folder: "video_akad" },
        { path: dapeng.BerkasPengajuan?.pelunasan, folder: "file_takeover" },
        { path: dapeng.BerkasPengajuan?.mutasi, folder: "file_mutasi" },
        {
          path: dapeng.BerkasPengajuan?.berkas_flagging,
          folder: "file_flagging",
        },
        { path: dapeng.BerkasPengajuan?.bukti_cair, folder: "file_cash" },
        { path: dapeng.BerkasPengajuan?.video_cair, folder: "video_cash" },
        { path: dapeng.BerkasPengajuan?.video_cair2, folder: "video_cash" },
        { path: dapeng.BerkasPengajuan?.video_cair3, folder: "video_cash" },
        { path: dapeng.DataPencairan?.berkas_si, folder: "file_si" },
        { path: dapeng.DataPencairan?.bukti_transfer, folder: "file_dropping" },
      ];

      for (const fileDef of filesToMigrate) {
        // Hanya proses jika path ada (bukan null atau undefined)
        if (fileDef.path) {
          const fullPath = path.join(process.cwd(), "/storage" + fileDef.path);

          if (existsSync(fullPath)) {
            try {
              const file = await fileFromPath(fullPath);
              const blockBlobClient = containerClient.getBlockBlobClient(
                "kopjasfas/pensiunan/" + file.name,
              );
              const arrayBuffer = await file.arrayBuffer();
              await blockBlobClient.uploadData(arrayBuffer);

              if (fileDef.folder === "file_cash") {
                dapem[fileDef.folder] = dapem[fileDef.folder]
                  ? [...dapem[fileDef.folder], blockBlobClient.url]
                  : [blockBlobClient.url];
              } else {
                dapem[fileDef.folder] = blockBlobClient.url;
              }
              // Optional: Hapus file lokal setelah berhasil diupload
              // await fs.unlink(fullPath);
            } catch (uploadError) {
              console.error(
                `Gagal memproses file ${fileDef.path}:`,
                uploadError,
              );
              // Lanjutkan ke file berikutnya
            }
          }
        }
      }
      data.push(dapem);
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data Pengajuan");
    // 2. Tentukan Header Kolom
    worksheet.columns = [
      { header: "Nama", key: "nama", width: 30 },
      { header: "NOPEN", key: "nopen", width: 20 },
      { header: "Gaji Bersih", key: "gaji", width: 15 },
      { header: "Status Berkas", key: "status", width: 20 },
    ];
    worksheet.addRows(data);
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
    return NextResponse.json(
      { status: 500, msg: err.message },
      { status: 500 },
    );
  }
};
