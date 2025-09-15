import { useEffect, useState } from "react";
import { FormInput } from ".";
import { IKreditKaryawan } from "./IInterfaces";
import { formatNumber, inputTextToDecimal } from "../utils/inputUtils";
import { ceiling } from "./appUtils";
import moment from "moment";
import { Table, TableProps } from "antd";

export default function KreditKaryawan() {
  const [data, setData] = useState(defaultData);
  const [tables, setTables] = useState<ITable[]>([]);

  useEffect(() => {
    setTables([]);
    const temps: ITable[] = [];
    for (let i = 1; i <= data.tenor; i++) {
      const angsuran = getAngsuran(data.plafon, data.tenor, data.bunga);
      temps.push({
        no: i,
        date: moment().add(i, "month").format("DD/MM/YYYY"),
        intallment: formatNumber(String(angsuran.angsuran)),
        principal: formatNumber(String(angsuran.pokok)),
        margin: formatNumber(String(angsuran.margin)),
        remaining:
          i === data.tenor
            ? "0"
            : formatNumber(String(data.plafon - angsuran.pokok * i)),
      });
    }
    setTables(temps);
  }, [data]);
  return (
    <div className="flex gap-5 flex-col sm:flex-row text-sm">
      <div className="flex-1">
        <div className="bg-green-500 text-gray-50 p-2 rounded text-center font-bold">
          <p>RINCIAN PEMBIAYAAN</p>
        </div>
        <div className="flex gap-2 my-2">
          <FormInput
            label="NIP/No Anggota"
            value={data.nip}
            mode="col"
            onChange={(e: any) => setData({ ...data, nip: e })}
          />
          <FormInput
            label="Nama Lengkap"
            value={data.name}
            mode="col"
            onChange={(e: any) => setData({ ...data, name: e })}
          />
        </div>
        <div className="flex gap-2 my-2">
          <FormInput
            label="Plafond"
            value={formatNumber(String(data.plafon))}
            mode="col"
            onChange={(e: any) =>
              setData({ ...data, plafon: inputTextToDecimal(e) })
            }
          />
          <FormInput
            label="Tenor"
            value={data.tenor}
            mode="col"
            type="number"
            onChange={(e: any) => setData({ ...data, tenor: Number(e) })}
          />
        </div>
        <div className="flex gap-2 my-2">
          <FormInput
            label="Margin Bunga"
            value={data.bunga}
            mode="col"
            type="number"
            onChange={(e: any) => setData({ ...data, bunga: Number(e) })}
          />
          <FormInput
            label="Biaya Admin"
            value={data.cAdmin}
            mode="col"
            type="number"
            onChange={(e: any) => setData({ ...data, cAdmin: Number(e) })}
          />
        </div>
      </div>
      <div className="flex-1">
        <div className="bg-red-500 text-gray-50 p-2 rounded text-center font-bold">
          <p>RINCIAN PEMBIAYAAN</p>
        </div>
        <div className="flex flex-col gap-3 my-3">
          <FormInput
            label="Angsuran"
            value={formatNumber(
              String(
                getAngsuran(data.plafon, data.tenor, data.bunga).angsuran || 0
              )
            )}
            mode="row"
            disabled
          />
          <FormInput
            label="Biaya Admin"
            value={formatNumber(String(data.plafon * (data.cAdmin / 100)))}
            mode="row"
            disabled
            className="text-red-500"
          />
          <FormInput
            label="Terima Bersih"
            value={formatNumber(
              String(data.plafon - data.plafon * (data.cAdmin / 100))
            )}
            mode="row"
            disabled
            className="text-green-500 font-bold"
          />
        </div>
        <div>
          <Table
            size="small"
            rowKey={"no"}
            columns={columns}
            dataSource={tables}
            bordered
            pagination={false}
          />
        </div>
      </div>
    </div>
  );
}

const defaultData: IKreditKaryawan = {
  nip: "",
  name: "",
  position: "",
  plafon: 0,
  tenor: 0,
  bunga: 18,
  installment: 0,
  cAdmin: 5,

  createdAt: new Date(),
};

const getAngsuran = (plafond: number, tenor: number, bunga: number) => {
  const pokok = parseInt(String(plafond / tenor));
  const margin = parseInt(String(plafond * (bunga / 12 / 100)));
  return { angsuran: ceiling(pokok + margin, 1000), pokok, margin };
};

interface ITable {
  no: number;
  date: string;
  intallment: string;
  principal: string;
  margin: string;
  remaining: string;
}

const columns: TableProps<ITable>["columns"] = [
  {
    title: "NO",
    key: "no",
    dataIndex: "no",
    className: "text-center text-xs",
    onHeaderCell: () => {
      return {
        ["style"]: {
          textAlign: "center",
          fontSize: 12,
        },
      };
    },
  },
  {
    title: "TANGGAL",
    key: "tanggal",
    dataIndex: "date",
    className: "text-center text-xs",
    onHeaderCell: () => {
      return {
        ["style"]: {
          textAlign: "center",
          fontSize: 12,
        },
      };
    },
  },
  {
    title: "ANGSURAN",
    key: "installment",
    dataIndex: "intallment",
    className: "text-center text-xs",
    onHeaderCell: () => {
      return {
        ["style"]: {
          textAlign: "center",
          fontSize: 12,
        },
      };
    },
  },
  {
    title: "MARGIN",
    key: "margin",
    dataIndex: "margin",
    className: "text-center text-xs",
    onHeaderCell: () => {
      return {
        ["style"]: {
          textAlign: "center",
          fontSize: 12,
        },
      };
    },
  },
  {
    title: "POKOK",
    key: "pokok",
    dataIndex: "principal",
    className: "text-center text-xs",
    onHeaderCell: () => {
      return {
        ["style"]: {
          textAlign: "center",
          fontSize: 12,
        },
      };
    },
  },
  {
    title: "SISA POKOK",
    key: "remaining",
    dataIndex: "remaining",
    className: "text-center text-xs",
    onHeaderCell: () => {
      return {
        ["style"]: {
          textAlign: "center",
          fontSize: 12,
        },
      };
    },
  },
];
