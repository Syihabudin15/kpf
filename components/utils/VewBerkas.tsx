"use client";

import { useEffect, useState } from "react";

export default function ViewBerkas({
  currUrl,
  currType,
}: {
  currUrl: string | null | undefined;
  currType: string;
}) {
  const [url, setUrl] = useState<string | null | undefined>();
  const [type, setType] = useState<string>();
  useEffect(() => {
    setUrl(currUrl);
    setType(currType);
  }, [currType, currUrl]);
  return (
    <div style={{ height: "70vh" }}>
      {url ? (
        <object
          data={url}
          className="w-full h-full"
          type={type}
          width="100%"
          height="100%"
        >
          <div className="h-full w-full flex justify-center items-center flex-col gap-5">
            <div className="text-center text-red-500 font-bold text-lg">
              Browser yang anda gunakan tidak mendukung untuk pembukaan file
              yang dimaksud atau file tidak ditemukan
            </div>
            <div>
              Mobile device belum mendukung pembukaan file dalam bentuk PDF
            </div>
            <div>
              <a
                href={url}
                download={url}
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded shadow"
              >
                DOWNLOAD
              </a>
            </div>
          </div>
        </object>
      ) : (
        <div className="text-center text-red-500">
          <p>Berkas belum di upload!</p>
        </div>
      )}
    </div>
  );
}
