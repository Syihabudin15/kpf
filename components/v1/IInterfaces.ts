import { Bank, Produk } from "@prisma/client";

export interface ISumdan extends Bank {
  Produk: Produk[];
}

export interface IKreditKaryawan {
  name: string;
  nip: string;
  position: string;
  plafon: number;
  tenor: number;
  bunga: number;
  installment: number;
  cAdmin: number;

  createdAt: Date;
}
