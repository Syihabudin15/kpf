"use client";

import dynamic from "next/dynamic";

export const FormCetak = dynamic(() => import("./FormCetak"), { ssr: false });
