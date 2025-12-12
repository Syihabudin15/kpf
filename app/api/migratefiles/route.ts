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
                fileDef.folder + "/" + file.name
              );
              const arrayBuffer = await file.arrayBuffer();
              await blockBlobClient.uploadData(arrayBuffer);

              // Optional: Hapus file lokal setelah berhasil diupload
              // await fs.unlink(fullPath);
            } catch (uploadError) {
              console.error(
                `Gagal memproses file ${fileDef.path}:`,
                uploadError
              );
              // Lanjutkan ke file berikutnya
            }
          }
        }
      }
      // const slik = path.join(
      //   process.cwd(),
      //   "/storage" + dapeng.BerkasPengajuan?.berkas_slik
      // );
      // const pengajuan = path.join(
      //   process.cwd(),
      //   "/storage" + dapeng.BerkasPengajuan?.berkas_pengajuan
      // );
      // const asuransi = path.join(
      //   process.cwd(),
      //   "/storage" + dapeng.BerkasPengajuan?.video_asuransi
      // );
      // const wawancara = path.join(
      //   process.cwd(),
      //   "/storage" + dapeng.BerkasPengajuan?.video_wawancara
      // );
      // const akad = path.join(
      //   process.cwd(),
      //   "/storage" + dapeng.BerkasPengajuan?.berkas_akad
      // );
      // const akadvideo = path.join(
      //   process.cwd(),
      //   "/storage" + dapeng.BerkasPengajuan?.video_akad
      // );
      // const pelunasan = path.join(
      //   process.cwd(),
      //   "/storage" + dapeng.BerkasPengajuan?.pelunasan
      // );
      // const cair = path.join(
      //   process.cwd(),
      //   "/storage" + dapeng.BerkasPengajuan?.bukti_cair
      // );
      // const cairvideo = path.join(
      //   process.cwd(),
      //   "/storage" + dapeng.BerkasPengajuan?.video_cair
      // );
      // const cairvideo2 = path.join(
      //   process.cwd(),
      //   "/storage" + dapeng.BerkasPengajuan?.video_cair2
      // );
      // const cairvideo3 = path.join(
      //   process.cwd(),
      //   "/storage" + dapeng.BerkasPengajuan?.video_cair3
      // );
      // const si = path.join(
      //   process.cwd(),
      //   "/storage" + dapeng.DataPencairan?.berkas_si
      // );
      // const tf = path.join(
      //   process.cwd(),
      //   "/storage" + dapeng.DataPencairan?.bukti_transfer
      // );

      // if (existsSync(slik)) {
      //   const file = await fileFromPath(slik);
      //   const blockBlobClient = containerClient.getBlockBlobClient(
      //     "slik/" + file.name
      //   );
      //   const arrayBuffer = await file.arrayBuffer();
      //   await blockBlobClient.uploadData(arrayBuffer);
      // }
      // if (existsSync(pengajuan)) {
      //   const file = await fileFromPath(pengajuan);
      //   const blockBlobClient = containerClient.getBlockBlobClient(
      //     "pengajuan/" + file.name
      //   );
      //   const arrayBuffer = await file.arrayBuffer();
      //   await blockBlobClient.uploadData(arrayBuffer);
      // }
      // if (existsSync(wawancara)) {
      //   const file = await fileFromPath(wawancara);
      //   const blockBlobClient = containerClient.getBlockBlobClient(
      //     "wawancara/" + file.name
      //   );
      //   const arrayBuffer = await file.arrayBuffer();
      //   await blockBlobClient.uploadData(arrayBuffer);
      // }
      // if (existsSync(asuransi)) {
      //   const file = await fileFromPath(asuransi);
      //   const blockBlobClient = containerClient.getBlockBlobClient(
      //     "asuransi/" + file.name
      //   );
      //   const arrayBuffer = await file.arrayBuffer();
      //   await blockBlobClient.uploadData(arrayBuffer);
      // }
      // if (existsSync(akad)) {
      //   const file = await fileFromPath(akad);
      //   const blockBlobClient = containerClient.getBlockBlobClient(
      //     "akad/" + file.name
      //   );
      //   const arrayBuffer = await file.arrayBuffer();
      //   await blockBlobClient.uploadData(arrayBuffer);
      // }
      // if (existsSync(akadvideo)) {
      //   const file = await fileFromPath(akadvideo);
      //   const blockBlobClient = containerClient.getBlockBlobClient(
      //     "akad/" + file.name
      //   );
      //   const arrayBuffer = await file.arrayBuffer();
      //   await blockBlobClient.uploadData(arrayBuffer);
      // }
      // if (existsSync(pelunasan)) {
      //   const file = await fileFromPath(pelunasan);
      //   const blockBlobClient = containerClient.getBlockBlobClient(
      //     "takeover/" + file.name
      //   );
      //   const arrayBuffer = await file.arrayBuffer();
      //   await blockBlobClient.uploadData(arrayBuffer);
      // }
      // if (existsSync(cair)) {
      //   const file = await fileFromPath(cair);
      //   const blockBlobClient = containerClient.getBlockBlobClient(
      //     "cair/" + file.name
      //   );
      //   const arrayBuffer = await file.arrayBuffer();
      //   await blockBlobClient.uploadData(arrayBuffer);
      // }
      // if (existsSync(cairvideo)) {
      //   const file = await fileFromPath(cairvideo);
      //   const blockBlobClient = containerClient.getBlockBlobClient(
      //     "cair/" + file.name
      //   );
      //   const arrayBuffer = await file.arrayBuffer();
      //   await blockBlobClient.uploadData(arrayBuffer);
      // }
      // if (existsSync(cairvideo2)) {
      //   const file = await fileFromPath(cairvideo2);
      //   const blockBlobClient = containerClient.getBlockBlobClient(
      //     "cair/" + file.name
      //   );
      //   const arrayBuffer = await file.arrayBuffer();
      //   await blockBlobClient.uploadData(arrayBuffer);
      // }
      // if (existsSync(cairvideo3)) {
      //   const file = await fileFromPath(cairvideo3);
      //   const blockBlobClient = containerClient.getBlockBlobClient(
      //     "cair/" + file.name
      //   );
      //   const arrayBuffer = await file.arrayBuffer();
      //   await blockBlobClient.uploadData(arrayBuffer);
      // }
      // if (existsSync(si)) {
      //   const file = await fileFromPath(si);
      //   const blockBlobClient = containerClient.getBlockBlobClient(
      //     "dropping/" + file.name
      //   );
      //   const arrayBuffer = await file.arrayBuffer();
      //   await blockBlobClient.uploadData(arrayBuffer);
      // }
      // if (existsSync(tf)) {
      //   const file = await fileFromPath(tf);
      //   const blockBlobClient = containerClient.getBlockBlobClient(
      //     "dropping/" + file.name
      //   );
      //   const arrayBuffer = await file.arrayBuffer();
      //   await blockBlobClient.uploadData(arrayBuffer);
      // }
    }

    return NextResponse.json(
      { msg: "Migration files success", status: 200 },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { status: 500, msg: err.message },
      { status: 500 }
    );
  }
};
