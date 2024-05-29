import prisma from "@/components/prisma";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
    signOut: "/",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const cred = await prisma.user.findFirst({
          where: { username: credentials?.username },
        });

        if (!cred) throw new Error("Username tidak ditemukan!");
        if (!credentials?.password)
          throw new Error("Mohon masukan password dengan benar!");
        const verify = await bcrypt.compare(
          credentials?.password,
          cred.password
        );
        if (!verify) throw new Error("Username atau password salah!");
        if (cred && cred.status_active == false)
          throw new Error("Akun non-aktif tidak bisa login!");

        return {
          id: cred.id,
          name: cred.first_name + " " + cred.last_name,
          first_name: cred.first_name,
          last_name: cred.last_name,
          username: cred.username,
          email: cred.email as string,
          no_telepon: cred.no_telepon as string,
          role: cred.role,
          is_active: cred.status_active,
        };
      },
    }),
  ],
});

export { handler as GET, handler as POST };
