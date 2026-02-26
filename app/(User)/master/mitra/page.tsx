"use client";

import {
  IActionTable,
  IBankPembiayaan,
  IPageProps,
} from "@/components/IInterfaces";
import { IDRFormat } from "@/components/Utils";
import {
  BankOutlined,
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { Produk } from "@prisma/client";
import { Button, Card, Input, Table, TableProps } from "antd";
import { useEffect, useState } from "react";

export default function Page() {
  const [pageProps, setPageProps] = useState<IPageProps<IBankPembiayaan>>({
    page: 1,
    limit: 50,
    total: 0,
    data: [],
    search: "",
  });
  const [action, setAction] = useState<IActionTable<IBankPembiayaan>>({
    upsert: false,
    delete: false,
    proses: false,
    selected: undefined,
  });
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    params.append("page", pageProps.page.toString());
    params.append("limit", pageProps.limit.toString());
    if (pageProps.search) params.append("search", pageProps.search);

    const res = await fetch(`/api/master/mitra?${params.toString()}`);
    const json = await res.json();
    setPageProps((prev) => ({
      ...prev,
      data: json.data,
      total: json.total,
    }));
    setLoading(false);
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      await getData();
    }, 200);
    return () => clearTimeout(timeout);
  }, [pageProps.page, pageProps.limit, pageProps.search]);

  const columns: TableProps<IBankPembiayaan>["columns"] = [
    {
      title: "NO",
      key: "id",
      dataIndex: "id",
      className: "text-center",
      width: 50,
      render(value, record, index) {
        return <>{(pageProps.page - 1) * pageProps.limit + index + 1}</>;
      },
    },
    {
      title: "MITRA PEMBIAYAAN",
      key: "name",
      dataIndex: "name",
      render(value, record, index) {
        return (
          <div>
            <div>{record.name}</div>
            <div className="text-xs italic opacity-80">@{record.kode}</div>
          </div>
        );
      },
    },
    {
      title: "KONTAK",
      key: "kontak",
      dataIndex: "kontak",
      width: 200,
      render(value, record, index) {
        return (
          <div className="text-xs italic opacity-80">
            <div>
              <PhoneOutlined /> {record.no_telepon}
            </div>
            <div>
              <MailOutlined /> {record.email}
            </div>
            <div>
              <EnvironmentOutlined /> {record.alamat}
            </div>
          </div>
        );
      },
    },
    {
      title: "RINCIAN BIAYA",
      key: "biaya",
      dataIndex: "biaya",
      render(value, record, index) {
        return (
          <div className="text-xs italic opacity-80">
            <div>
              Adm : {record.by_admin_bank?.toFixed(2)}+
              {record.by_admin?.toFixed(2)} (
              {(record.by_admin + (record.by_admin_bank || 0)).toFixed(2)}%)
            </div>
            <div>Tatalaksana: {IDRFormat(record.by_tatalaksana)}</div>
            <div>Buka Rekening: {IDRFormat(record.by_buka_rekening)}</div>
            <div>Materai: {IDRFormat(record.by_materai)}</div>
            <div>Provisi: {IDRFormat(record.by_provisi || 0)}</div>
          </div>
        );
      },
    },
    {
      title: "DSR & PEMBULATAN",
      key: "rounded",
      dataIndex: "rounded",
      render(value, record, index) {
        return (
          <div className="text-xs italic opacity-80">
            <div>DSR :{record.by_angsuran.toFixed(2)}%</div>
            <div>Rounded: {IDRFormat(record.pembulatan || 0)}</div>
          </div>
        );
      },
    },
    {
      title: "AKSI",
      key: "action",
      dataIndex: "action",
      render(value, record, index) {
        return (
          <div className="flex gap-2 items-center justify-center">
            <Button
              icon={<EditOutlined />}
              size="small"
              type="primary"
            ></Button>
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
              type="primary"
            ></Button>
          </div>
        );
      },
    },
  ];
  return (
    <Card
      title={
        <div className="flex gap-2 items-center text-lg">
          <BankOutlined /> <p>Mitra Pembiayaan</p>
        </div>
      }
      styles={{ body: { margin: 0, padding: 2 } }}
    >
      <div className="flex gap-2 justify-between">
        <div className="flex gap-2 items-center">
          <Button icon={<PlusCircleOutlined />} size="small" type="primary">
            Add New
          </Button>
        </div>
        <div>
          <Input.Search
            size="small"
            width={170}
            style={{ width: 170 }}
            placeholder="Cari mitra..."
            onChange={(e) =>
              setPageProps({ ...pageProps, search: e.target.value })
            }
          />
        </div>
      </div>
      <Table
        columns={columns}
        rowKey={"id"}
        dataSource={pageProps.data}
        size="small"
        loading={loading}
        bordered
        scroll={{ x: "max-content", y: "57vh" }}
        pagination={{
          current: pageProps.page,
          pageSize: pageProps.limit,
          total: pageProps.total,
          onChange: (page, pageSize) => {
            setPageProps((prev) => ({
              ...prev,
              page,
              limit: pageSize,
            }));
          },
          pageSizeOptions: [50, 100, 500, 1000],
        }}
        expandable={{
          expandedRowRender: (record) => <ProdukManajemen data={record} />,
          rowExpandable: (record) => record.products.length !== 0,
        }}
      />
    </Card>
  );
}

const ProdukManajemen = ({ data }: { data: IBankPembiayaan }) => {
  const columns: TableProps<Produk>["columns"] = [
    {
      title: "NO",
      key: "id",
      dataIndex: "id",
      className: "text-center",
      width: 50,
      render(value, record, index) {
        return <>{index + 1}</>;
      },
    },
    {
      title: "Produk",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Kriteria",
      key: "kriteria",
      dataIndex: "kriteria",
      render(value, record, index) {
        return (
          <div className="italic text-xs opacity-80">
            <div>
              Pengajuan : {record.min_age} - {record.max_age}
            </div>
            <div>Lunas : {record.max_usia_lunas}</div>
            <div>Tenor : {record.max_tenor}</div>
            <div>Plafond : {IDRFormat(record.max_plafon)}</div>
          </div>
        );
      },
    },
    {
      title: "Rincian",
      key: "rincian",
      dataIndex: "rincian",
      render(value, record, index) {
        return (
          <div className="italic text-xs opacity-80">
            <div>Asuransi : {record.by_asuransi.toFixed(2)}%</div>
            <div>
              Margin : {(record.mg_bunga - (data.margin_bank || 0)).toFixed(2)}+
              {data.margin_bank?.toFixed(2)} ({record.mg_bunga.toFixed(2)}%)
            </div>
            <div>Tenor : {record.max_tenor}</div>
            <div>Plafond : {IDRFormat(record.max_plafon)}</div>
          </div>
        );
      },
    },
    {
      title: "Aksi",
      key: "action",
      dataIndex: "action",
      render(value, record, index) {
        return (
          <div className="flex gap-2 items-center justify-center">
            <Button
              icon={<EditOutlined />}
              size="small"
              type="primary"
            ></Button>
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
              type="primary"
            ></Button>
          </div>
        );
      },
    },
  ];
  return (
    <div className="ml-10">
      <Table
        columns={columns}
        rowKey={"id"}
        dataSource={data.products}
        size="small"
        bordered
      />
    </div>
  );
};
