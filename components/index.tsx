"use client";

import dynamic from "next/dynamic";

export const UpsertPermohonan = dynamic(
  () => import("@/components/utils/UpsertPengajuan"),
  { ssr: false, loading: () => <>Loading ...</> }
);
