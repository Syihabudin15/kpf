import { NextResponse } from "next/server";
import { existsSync, promises as fs } from "fs";
import path from "path";
import { getContainerClient } from "@/libs/Azure";
import prisma from "@/components/prisma";
import { fileFromPath } from "formdata-node/file-from-path";

const containerClient = getContainerClient();

export const POST = async () => {
  try {
    const find = await prisma.dataPengajuan.findMany({
      where: {
        is_active: true,
        DataPembiayaan: { is_active: true },
        berkasPengajuanId: { not: null },
      },
      include: {
        DataPencairan: true,
        BerkasPengajuan: true,
      },
    });

    for (const dapeng of find) {
      const filesToMigrate = [
        { path: dapeng.BerkasPengajuan?.berkas_slik, folder: "slik" },
        { path: dapeng.BerkasPengajuan?.berkas_pengajuan, folder: "pengajuan" },
        { path: dapeng.BerkasPengajuan?.video_wawancara, folder: "wawancara" },
        { path: dapeng.BerkasPengajuan?.video_asuransi, folder: "asuransi" },
        { path: dapeng.BerkasPengajuan?.berkas_akad, folder: "akad" },
        { path: dapeng.BerkasPengajuan?.video_akad, folder: "akad" },
        { path: dapeng.BerkasPengajuan?.pelunasan, folder: "takeover" },
        { path: dapeng.BerkasPengajuan?.mutasi, folder: "mutasi" },
        { path: dapeng.BerkasPengajuan?.berkas_flagging, folder: "flagging" },
        { path: dapeng.BerkasPengajuan?.bukti_cair, folder: "cair" },
        { path: dapeng.BerkasPengajuan?.video_cair, folder: "cair" },
        { path: dapeng.BerkasPengajuan?.video_cair2, folder: "cair" },
        { path: dapeng.BerkasPengajuan?.video_cair3, folder: "cair" },
        { path: dapeng.DataPencairan?.berkas_si, folder: "dropping" },
        { path: dapeng.DataPencairan?.bukti_transfer, folder: "dropping" },
      ];

      for (const fileDef of filesToMigrate) {
        // Hanya proses jika path ada (bukan null atau undefined)
        if (fileDef.path) {
          const fullPath = path.join(process.cwd(), "/storage" + fileDef.path);

          if (existsSync(fullPath)) {
            try {
              const file = await fileFromPath(fullPath);
              const blockBlobClient = containerClient.getBlockBlobClient(
                fileDef.folder + "/" + file.name,
              );
              const arrayBuffer = await file.arrayBuffer();
              await blockBlobClient.uploadData(arrayBuffer);

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
    }

    return NextResponse.json(
      { msg: "Migration files success", status: 200 },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { status: 500, msg: err.message },
      { status: 500 },
    );
  }
};
