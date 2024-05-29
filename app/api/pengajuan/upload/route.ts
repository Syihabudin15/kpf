import { SaveImageLocaly } from "@/components/utils/Decode";
import { UploadType } from "@/components/utils/Interfaces";
import { NextRequest, NextResponse } from "next/server";

export interface UploadProps {
  file: string;
  type: UploadType;
  dir?: string;
  ext?: string;
  nopen: string;
  nama: string;
}

export const POST = async (req: NextRequest) => {
  const data: UploadProps = await req.json();
  try {
    // const result = await saveFile(data.file, data.type);
    const result = await SaveImageLocaly(
      data.file,
      data.dir?.toUpperCase() || "SLIK",
      data.ext || "pdf",
      data.nama,
      data.nopen
    );
    return NextResponse.json(
      { url: result, msg: "Upload berkas berhasil" },
      { status: 201, statusText: "OK" }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { msg: "Upload berkas gagal. Mohon ulangi!" },
      { status: 500 }
    );
  }
};
