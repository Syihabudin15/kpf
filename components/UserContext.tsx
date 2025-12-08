"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { IUser } from "./IInterfaces";

const userContext = createContext<IUser | undefined>(undefined);
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>();
  const pathname = usePathname();

  const getData = () => {
    fetch("/api/auth")
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 200) {
          setUser({ ...res.data, password: "" });
        } else {
          if (pathname !== "/") {
            window && window.location.replace("/");
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <userContext.Provider value={user as IUser}>
      {children}
    </userContext.Provider>
  );
};

export const useUser = () => useContext(userContext);
