"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";
import NotifContext from "./NotifContext";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <NotifContext>{children}</NotifContext>
    </SessionProvider>
  );
}
