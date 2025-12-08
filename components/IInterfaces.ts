import {
  Angsuran,
  Asuransi,
  Dapem,
  Debitur,
  Dropping,
  JePem,
  Pelunasan,
  ProPem,
  Role,
  TTPB,
  TTPJ,
  User,
} from "@prisma/client";

export interface IUser extends User {
  Role: Role;
}

export interface IPageData<T> {
  loading: boolean;
  page: number;
  limit: number;
  total: number;
  data: T[];
  selected: T | undefined;
  upsert: boolean;
  delete: boolean;
  [key: string]: any;
}

export interface IDapem extends Dapem {
  Debitur: Debitur;
  ProPem: ProPem;
  JePem: JePem;
  AO: User;
  CreatedBy: User;
  Angsuran: Angsuran[];
  Dropping: Dropping;
  TTPB: TTPB;
  TTPJ: TTPJ;
  Pelunasan: Pelunasan;
  Asuransi: Asuransi;
}
