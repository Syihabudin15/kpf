import { Role } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string | number;
    first_name: string;
    last_name: string;
    name: string;
    username: string;
    email: string;
    no_telepon: string;
    is_active: boolean;
    role: Role;
  }

  interface Session extends DeffaultSeesion {
    user?: User;
  }
}
