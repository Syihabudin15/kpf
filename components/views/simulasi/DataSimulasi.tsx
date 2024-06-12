"use client";
import {
  Bank,
  DataPembiayaan,
  JenisPembiayaan,
  Produk,
  User,
} from "@prisma/client";
import { DatePicker, Modal, Spin, Table, TableProps, message } from "antd";
import { useEffect, useState } from "react";
import {
  DateDifUsiaAndTanggalLunas,
  DateDiff,
  DateDiffUsiaMasuk,
  DateDiffUsiaTanggalLunas,
  getAngsuranPerBulan,
} from "./simulasiUtil";
import {
  formatNumber,
  inputTextToDecimal,
} from "@/components/utils/inputUtils";
import { ceiling } from "@/components/utils/pdf/pdfUtil";
import { DeleteOutlined } from "@ant-design/icons";
const moment = require("moment-timezone");

interface ProdukType extends Produk {
  Bank: Bank;
}
interface DataType extends DataPembiayaan {
  key: string;
  User: User;
  Produk: ProdukType;
  JenisPembiayaan: JenisPembiayaan;
}

export default function DataSimulasi() {
  const [data, setData] = useState<DataType[]>();
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selected, setSelected] = useState<DataType>();
  const [usiaMasuk, setUsiaMasuk] = useState<DateDiff>();
  const [lunas, setLunas] = useState<DateDifUsiaAndTanggalLunas>();
  const [angsuranPerBulasn, setAngsuranPerBulan] = useState<number>(0);
  const [tatalaksana, setTatalaksana] = useState<number>(0);
  const [terimaKotor, setTerimaKotor] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [year, setYear] = useState<string>();
  const [modalHapus, setModalHapus] = useState(false);

  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      `/api/simulasi?page=${page}${year ? "&year=" + year : ""}`
    );
    const { data, total } = await res.json();
    const results: DataType[] = data.map((e: DataType) => {
      return {
        ...e,
        key: e.id,
      };
    });
    setData(results);
    setTotal(total);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await getData();
    })();
  }, [page, year]);

  const handleClick = async (record: DataType) => {
    setSelected(record);
    setTatalaksana(record.by_tatalaksana);
    const masuk = DateDiffUsiaMasuk(
      record.tanggal_lahir,
      moment(record.created_at).tz("Asia/Jakarta")
    );
    const lunas = DateDiffUsiaTanggalLunas(
      record.tanggal_lahir,
      record.created_at.toString(),
      record.tenor
    );
    const angsBulan = ceiling(
      parseInt(
        getAngsuranPerBulan(record.mg_bunga, record.tenor, record.plafond)
      ),
      record.pembulatan
    ).toString();

    setUsiaMasuk(masuk);
    setLunas(lunas);
    setAngsuranPerBulan(parseInt(angsBulan));
    setTerimaKotor(
      record.plafond -
        record.plafond * (record.by_admin / 100) -
        record.plafond * (record.by_admin_bank / 100) -
        record.plafond * (record.by_lainnya / 100) -
        record.by_flagging -
        record.by_epotpen -
        record.by_tatalaksana -
        record.plafond * (record.by_asuransi / 100) -
        record.by_provisi -
        record.by_buka_rekening -
        record.by_materai -
        record.by_mutasi -
        record.blokir * parseInt(angsBulan)
    );
    setTimeout(() => {
      setShowDetail(true);
    }, 500);
  };

  const handleDelete = async () => {
    setLoading(true);
    const res = await fetch("/api/simulasi", {
      method: "DELETE",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ id: selected?.id }),
    });
    if (res.ok) {
      message.success("Hapus data simulasi berhasil!");
    } else {
      message.error("Gagal hapus data simulasi.. Coba lagi nanti!");
    }
    setModalHapus(false);
    await getData();
  };

  const columns: TableProps<DataType>["columns"] = [
    { title: "Nopen", dataIndex: "nopen" },
    { title: "Nama", dataIndex: "name" },
    { title: "Keterangan", dataIndex: "keterangan" },
    { title: "Alamat", dataIndex: "alamat" },
    {
      title: "Aksi",
      dataIndex: "id",
      onHeaderCell: (text, record) => {
        return {
          ["style"]: {
            textAlign: "center",
          },
          className: "example-class-in-td bg-green-500 text-white",
        };
      },
      render(value, record, index) {
        return (
          <div className="flex justify-center gap-2">
            <button
              className="bg-orange-500 hover:bg-orange-600 py-1 px-2 text-xs shadow text-gray-100 rounded"
              onClick={() => handleClick(record)}
            >
              Simulasi
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded shadow"
              onClick={() => {
                setSelected(record);
                setModalHapus(true);
              }}
            >
              <DeleteOutlined />
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <div className="flex gap-5 my-1 mx-1">
        <DatePicker
          picker="year"
          onChange={(date, dateString) => setYear(dateString as string)}
        />
      </div>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        scroll={{ x: "max-content", y: "calc(65vh - 100px)" }}
        size="small"
        pagination={{
          pageSize: 20,
          total: total,
          onChange(page, pageSize) {
            setPage(page);
          },
        }}
        loading={loading}
      />

      <Modal
        title={
          <>
            <div className="flex gap-5 items-center">
              <div>
                <img src={process.env.NEXT_PUBLIC_APP_LOGO} width={40} />
              </div>
              <span>Analisa Perhitungan</span>
            </div>
          </>
        }
        open={showDetail}
        footer={[]}
        onCancel={() => setShowDetail(!showDetail)}
        wrapClassName="analisa-simulasi"
        width={"auto"}
        style={{ top: 40 }}
      >
        <Spin spinning={loading}>
          <div className="my-2 block sm:flex sm:justify-between">
            <div className="flex-1 sm:px-2">
              <div
                className={`bg-${process.env.NEXT_PUBLIC_APP_JUDUL_ANALISA}-500 p-2 text-gray-100 font-semibold text-center`}
              >
                Data Pembiayaan
              </div>
              <div className="flex justify-between sm:py-0 border-b border-gray-200">
                <div>Tanggal Hari Ini</div>
                <div className="text-right">
                  {new Date()
                    .toJSON()
                    .slice(0, 10)
                    .split("-")
                    .reverse()
                    .join("-")}
                </div>
              </div>
              <div className="flex justify-between sm:py-0 border-b border-gray-200">
                <div>Tanggal Simulasi</div>
                <div className="text-right">
                  {moment(selected?.created_at).format("DD-MM-YYYY")}
                </div>
              </div>
              <div className="flex justify-between sm:py-0 border-b border-gray-200">
                <div>Nama</div>
                <div className="text-right">{selected?.name}</div>
              </div>
              <div className="flex justify-between sm:py-0 border-b border-gray-200">
                <div>Nopen</div>
                <div className="text-right">{selected?.nopen}</div>
              </div>
              <div className="flex justify-between sm:py-0 border-b border-gray-200">
                <div>Tanggal Lahir</div>
                <div className="text-right">
                  {selected?.tanggal_lahir || "00-00-0000"}
                </div>
              </div>
              <div className="flex justify-between sm:py-0 border-b border-gray-200">
                <div>Usia Masuk</div>
                <div className="text-right">
                  {usiaMasuk?.tahun} Tahun {usiaMasuk?.bulan} Bulan{" "}
                  {usiaMasuk?.hari} Hari
                </div>
              </div>
              <div className="flex justify-between sm:py-0 border-b border-gray-200 font-bold">
                <div>Usia Lunas</div>
                <div className="text-right">
                  {lunas?.tahun} Tahun {lunas?.bulan} Bulan {lunas?.hari}
                </div>
              </div>
              <div className="flex justify-between sm:py-0 border-b border-gray-200 font-bold">
                <div>Tanggal Lunas</div>
                <div className="text-right">{lunas?.tanggalLunas}</div>
              </div>
              <div className="flex justify-between sm:py-0 border-b border-gray-200 text-green-500 font-bold">
                <div>Gaji Bersih</div>
                <div className="text-right">
                  {formatNumber((selected?.gaji_bersih || 0).toFixed(0))}
                </div>
              </div>
              <div className="flex justify-between sm:py-0 border-b border-gray-200">
                <div>Produk Pembiayaan</div>
                <div className="text-right">{selected?.Produk.name}</div>
              </div>
              <div className="flex justify-between sm:py-0 border-b border-gray-200">
                <div>Jenis Pembiayaan</div>
                <div className="text-right">
                  {selected?.jenis_pembiayaan_id
                    ? selected.JenisPembiayaan.name
                    : "-"}
                </div>
              </div>
              <div className="flex justify-between sm:py-0 border-b border-gray-200">
                <div>Tenor</div>
                <div className="text-right">{selected?.tenor}</div>
              </div>
              <div className="flex justify-between sm:py-0 border-b border-gray-200">
                <div>Plafond</div>
                <div className="text-right">
                  {formatNumber((selected?.plafond || 0).toFixed(0))}
                </div>
              </div>
              <div className="flex justify-between sm:py-0 border-b border-gray-200">
                <div>Angsuran</div>
                <div className="text-right">
                  {formatNumber(angsuranPerBulasn.toFixed(0))}
                </div>
              </div>
            </div>
            <div className="flex-1 sm:px-2">
              <div
                className={`bg-${process.env.NEXT_PUBLIC_APP_JUDUL_ANALISA}-500 p-2 text-gray-100 font-semibold text-center`}
              >
                Rincian Pembiayaan
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div>Biaya Administrasi</div>
                <div className="text-right">
                  {selected
                    ? formatNumber(
                        (
                          selected.plafond *
                          ((selected.by_admin +
                            selected.by_admin_bank +
                            selected.by_lainnya) /
                            100)
                        ).toString()
                      )
                    : "0"}
                </div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div>Biaya Tatalaksana</div>
                <div className="text-right">
                  {tatalaksana ? formatNumber(tatalaksana.toString()) : "0"}
                </div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div>Biaya Asuransi</div>
                <div className="text-right">
                  {selected
                    ? formatNumber(
                        (
                          selected.plafond *
                          (selected.by_asuransi / 100)
                        ).toFixed(0)
                      )
                    : "0"}
                </div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div>Biaya Buka Rekening</div>
                <div className="text-right">
                  {formatNumber((selected?.by_buka_rekening || 0).toFixed(0))}
                </div>
              </div>
              <div
                className={`flex justify-between py-0 border-b border-gray-200`}
              >
                <div>Biaya Mutasi</div>
                <div className="text-right">
                  {selected
                    ? formatNumber(
                        selected.jenis_pembiayaan_id
                          ? selected.by_mutasi.toString()
                          : "0"
                      )
                    : "0"}
                </div>
              </div>
              <div
                className={`flex justify-between py-0 border-b border-gray-200`}
              >
                <div>Biaya Provisi</div>
                <div className="text-right">
                  {selected
                    ? formatNumber(selected.by_provisi.toString())
                    : "0"}
                </div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div>Biaya Materai</div>
                <div className="text-right">
                  {selected
                    ? formatNumber(selected.by_materai.toString())
                    : "0"}
                </div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div>Biaya Data Informasi</div>
                <div className="text-right">
                  {selected
                    ? formatNumber(
                        (selected.by_flagging + selected.by_epotpen).toFixed(0)
                      )
                    : "0"}
                </div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div>Retensi Angsuran</div>
                <div className="text-right">0</div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div>Blokir Angsuran</div>
                {selected && selected.blokir !== 0 && (
                  <div>
                    {selected?.blokir && selected.blokir}x{" "}
                    {formatNumber(angsuranPerBulasn.toString())}
                  </div>
                )}
                <div className="text-right">
                  {selected?.blokir &&
                    formatNumber(
                      (
                        selected.blokir *
                        inputTextToDecimal(angsuranPerBulasn.toString())
                      ).toString()
                    )}
                </div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200 font-bold">
                <div>Terima Kotor</div>
                <div className="text-right">
                  {formatNumber(terimaKotor.toFixed(0))}
                </div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div className="text-red-500">BPP</div>
                <div className="text-right">
                  {selected ? formatNumber(selected.bpp.toString()) : "0"}
                </div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div>Nominal Pelunasan</div>
                <div className="text-right">
                  {selected ? formatNumber(selected.pelunasan.toString()) : "0"}
                </div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200 font-bold">
                <div>Terima Bersih</div>
                <div className="text-right">
                  {selected
                    ? formatNumber(
                        (
                          terimaKotor -
                          (selected.bpp + selected.pelunasan)
                        ).toString()
                      )
                    : "0"}
                </div>
              </div>
              <div className="flex justify-between py-0 border-b border-gray-200">
                <div>Sisa Gaji</div>
                <div className="text-right">
                  {selected &&
                    formatNumber(
                      (selected.gaji_bersih - angsuranPerBulasn).toString()
                    )}
                </div>
              </div>
            </div>
          </div>
        </Spin>

        <div className="flex justify-end">
          <button
            className="bg-orange-500 text-gray-300 px-3 py-1 rounded shadow hover:bg-orange-600"
            onClick={() => setShowDetail(false)}
          >
            Tutup
          </button>
        </div>
      </Modal>

      {/* Modal Hapus */}
      <Modal
        open={modalHapus}
        onCancel={() => setModalHapus(false)}
        title="Konfirmasi Hapus Data Simulasi"
        footer={[]}
      >
        <p>Lanjutkan hapus data simulasi {selected?.name} ?</p>
        <div className="mt-3 flex justify-end">
          <button
            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded shadow"
            onClick={() => handleDelete()}
          >
            YES <DeleteOutlined />
          </button>
        </div>
      </Modal>
    </div>
  );
}
