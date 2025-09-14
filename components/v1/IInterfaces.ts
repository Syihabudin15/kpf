import { Bank, Produk } from "@prisma/client";

export interface ISumdan extends Bank {
  Produk: Produk[];
}
