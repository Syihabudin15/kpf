import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Backup",
};

export default async function page() {
  return (
    <div>
      <a href="/backup/tarball.tar.gz" download>
        berkas
      </a>
    </div>
  );
}
