"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Users,
  Wallet,
  Receipt,
  ChevronRight,
  ChevronDown,
  Building2,
  UserCheck,
  Download,
  PieChart as PieChartIcon,
  BarChart3,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// --- Dummy Data ---

const monthlyTrendData = [
  { month: "Jan", pencairan: 450000000, outstanding: 420000000 },
  { month: "Feb", pencairan: 520000000, outstanding: 490000000 },
  { month: "Mar", pencairan: 610000000, outstanding: 580000000 },
  { month: "Apr", pencairan: 580000000, outstanding: 550000000 },
  { month: "Mei", pencairan: 720000000, outstanding: 690000000 },
  { month: "Jun", pencairan: 850000000, outstanding: 810000000 },
];

const schemeData = [
  { name: "Anuitas Pensiun", value: 55, color: "#3B82F6" },
  { name: "Flat Pensiun", value: 30, color: "#10B981" },
  { name: "Grace Period", value: 15, color: "#F59E0B" },
];

const statusPipeline = [
  {
    status: "Dalam Antrean / Verifikasi",
    count: 18,
    amount: "Rp 340.000.000",
    color: "bg-amber-500",
    text: "text-amber-700",
    bgLight: "bg-amber-50",
  },
  {
    status: "Disetujui (Siap Cair)",
    count: 42,
    amount: "Rp 890.000.000",
    color: "bg-emerald-500",
    text: "text-emerald-700",
    bgLight: "bg-emerald-50",
  },
  {
    status: "Ditolak / Dibatalkan",
    count: 7,
    amount: "Rp 120.000.000",
    color: "bg-rose-500",
    text: "text-rose-700",
    bgLight: "bg-rose-50",
  },
];

const partnerData = [
  {
    name: "PT Pos Indonesia",
    noa: 145,
    total: "Rp 2.450.000.000",
    share: "45%",
  },
  {
    name: "Bank Mantap (Taspen)",
    noa: 98,
    total: "Rp 1.820.000.000",
    share: "33%",
  },
  { name: "BTPN Purna", noa: 62, total: "Rp 1.100.000.000", share: "22%" },
];

const hierarchyData = [
  {
    id: "reg-1",
    area: "Jawa Barat 1 (Bandung Raya)",
    totalPencairan: "Rp 2.100.000.000",
    noa: 120,
    cabang: [
      {
        id: "cab-1",
        name: "KC Bandung Main",
        totalPencairan: "Rp 1.300.000.000",
        noa: 75,
        ao: [
          {
            id: "ao-1",
            name: "Ahmad Subagja",
            totalPencairan: "Rp 700.000.000",
            noa: 40,
            nasabah: [
              {
                id: "n-1",
                name: "Drs. H. Mulyana",
                plafon: "Rp 150.000.000",
                status: "Aktif",
                tenor: "36 Bln",
              },
              {
                id: "n-2",
                name: "Siti Aminah, S.Pd",
                plafon: "Rp 85.000.000",
                status: "Aktif",
                tenor: "24 Bln",
              },
            ],
          },
          {
            id: "ao-2",
            name: "Rina Kartika",
            totalPencairan: "Rp 600.000.000",
            noa: 35,
            nasabah: [
              {
                id: "n-3",
                name: "Bambang Sutrisno",
                plafon: "Rp 120.000.000",
                status: "Aktif",
                tenor: "48 Bln",
              },
            ],
          },
        ],
      },
    ],
  },
];

export default function DashboardMaster() {
  const [currMonth, setCurrMonth] = useState<boolean>(false);
  const [expandedArea, setExpandedArea] = useState<string | null>("reg-1");
  const [expandedCabang, setExpandedCabang] = useState<string | null>("cab-1");
  const [expandedAO, setExpandedAO] = useState<string | null>("ao-1");

  return (
    <div className=" bg-slate-50/50 space-y-6 text-slate-800">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Dashboard KOPJAS FAS
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Rekapan & Analitik Pembiayaan Pensiun Koperasi Jasa Fadillah Aqila
            Sejahtra
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-medium border border-slate-200">
            <button
              onClick={() => setCurrMonth(true)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                currMonth
                  ? "bg-white text-blue-600 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Bulan Ini
            </button>
            <button
              onClick={() => setCurrMonth(false)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                !currMonth
                  ? "bg-white text-blue-600 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Semua Data
            </button>
          </div>
        </div>
      </div>

      {/* --- STAT CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pencairan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Pencairan
            </p>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">Rp 3,74 M</p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-medium flex items-center gap-1">
              + Rp 450 Jt
            </span>
            <span className="text-slate-400">Bulan ini</span>
          </div>
        </div>

        {/* Total NOA */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total NOA
            </p>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">
            305{" "}
            <span className="text-sm font-normal text-slate-500">Debitur</span>
          </p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Aktif: <strong className="text-slate-800">280</strong>
            </span>
            <span>
              Lunas: <strong className="text-slate-800">25</strong>
            </span>
            <span className="text-blue-600 font-medium">+18 Bln Ini</span>
          </div>
        </div>

        {/* Outstanding */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Outstanding
            </p>
            <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">Rp 3,12 M</p>
          {/* <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              NPF Ratio: <strong className="text-emerald-600">0.8%</strong>
            </span>
            <span className="text-emerald-600 font-medium">+ Rp 210 Jt</span>
          </div> */}
        </div>

        {/* Tagihan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tagihan & Angsuran
            </p>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-3">Rp 185 Jt</p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Total All: <strong className="text-slate-800">Rp 4.2 M</strong>
            </span>
            {/* <span className="text-amber-600 font-medium">Bulan Berjalan</span> */}
          </div>
        </div>
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Bar/Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Tren Pembiayaan Bulanan
              </h3>
              <p className="text-xs text-slate-500">
                Perbandingan Pencairan vs Outstanding (6 Bulan Terakhir)
              </p>
            </div>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlyTrendData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorPencairan"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />
                <XAxis
                  dataKey="month"
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(v) => `${v / 1000000}JT`}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `Rp ${value.toLocaleString("id-ID")}`,
                    "",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="pencairan"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorPencairan)"
                  name="Pencairan"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart Skema */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Skema Pembiayaan
                </h3>
                <p className="text-xs text-slate-500">
                  Distribusikan berdasarkan skema akad
                </p>
              </div>
              <PieChartIcon className="w-5 h-5 text-slate-400" />
            </div>
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={schemeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {schemeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`${val}%`, "Porsi"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {schemeData.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-600 font-medium">
                    {item.name}
                  </span>
                </div>
                <span className="font-bold text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- STATUS PIPELINE PEMBIAYAAN --- */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <h3 className="font-bold text-slate-900 text-base mb-1">
          Status Pengajuan Pembiayaan
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Ringkasan berkas pengajuan yang sedang diproses
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statusPipeline.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border border-slate-100 ${item.bgLight} flex items-center justify-between`}
            >
              <div>
                <span
                  className={`inline-block w-2.5 h-2.5 rounded-full ${item.color} mb-2`}
                />
                <p className="text-xs font-medium text-slate-600">
                  {item.status}
                </p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">
                  {item.amount}
                </p>
              </div>
              <div className="text-right">
                <span className={`text-xl font-extrabold ${item.text}`}>
                  {item.count}
                </span>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">
                  Pengajuan
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- PENYALURAN BY MITRA --- */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Penyaluran Berdasarkan Mitra / Juru Bayar
            </h3>
            <p className="text-xs text-slate-500">
              Performa penyaluran portofolio pensiun per mitra instansi
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Nama Mitra</th>
                <th className="py-3 px-4">Total NOA</th>
                <th className="py-3 px-4">Nominal Penyaluran</th>
                <th className="py-3 px-4">Pangsa Portofolio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {partnerData.map((partner, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {partner.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {partner.noa} Debitur
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {partner.total}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: partner.share }}
                        />
                      </div>
                      <span className="font-semibold text-slate-700">
                        {partner.share}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- DRILLDOWN AREA > CABANG > AO > NASABAH --- */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="mb-4">
          <h3 className="font-bold text-slate-900 text-base">
            Hierarki Penyaluran Wilayah
          </h3>
          <p className="text-xs text-slate-500">
            Drilldown data dari Area Wilayah hingga ke tingkat Nasabah
          </p>
        </div>

        <div className="space-y-3">
          {hierarchyData.map((area) => {
            const isAreaOpen = expandedArea === area.id;
            return (
              <div
                key={area.id}
                className="border border-slate-200 rounded-xl overflow-hidden"
              >
                {/* Level 1: Area */}
                <div
                  onClick={() => setExpandedArea(isAreaOpen ? null : area.id)}
                  className="bg-slate-100/80 p-4 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {isAreaOpen ? (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    )}
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-800 text-sm">
                      {area.area}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-xs font-semibold">
                    <span>{area.noa} NOA</span>
                    <span className="text-blue-700">{area.totalPencairan}</span>
                  </div>
                </div>

                {/* Level 2: Cabang */}
                {isAreaOpen && (
                  <div className="p-3 bg-white space-y-2 border-t border-slate-200">
                    {area.cabang.map((cab) => {
                      const isCabOpen = expandedCabang === cab.id;
                      return (
                        <div
                          key={cab.id}
                          className="border border-slate-100 rounded-lg overflow-hidden ml-4"
                        >
                          <div
                            onClick={() =>
                              setExpandedCabang(isCabOpen ? null : cab.id)
                            }
                            className="bg-slate-50 p-3 flex items-center justify-between cursor-pointer hover:bg-slate-100/70 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              {isCabOpen ? (
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                              )}
                              <span className="font-semibold text-slate-700 text-xs">
                                {cab.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                              <span className="text-slate-500">
                                {cab.noa} NOA
                              </span>
                              <span className="font-bold text-slate-800">
                                {cab.totalPencairan}
                              </span>
                            </div>
                          </div>

                          {/* Level 3: AO */}
                          {isCabOpen && (
                            <div className="p-3 bg-white space-y-2 border-t border-slate-100 ml-4">
                              {cab.ao.map((ao) => {
                                const isAoOpen = expandedAO === ao.id;
                                return (
                                  <div
                                    key={ao.id}
                                    className="border border-dashed border-slate-200 rounded-lg overflow-hidden"
                                  >
                                    <div
                                      onClick={() =>
                                        setExpandedAO(isAoOpen ? null : ao.id)
                                      }
                                      className="p-2.5 bg-blue-50/40 flex items-center justify-between cursor-pointer hover:bg-blue-50/80 transition-colors"
                                    >
                                      <div className="flex items-center gap-2">
                                        {isAoOpen ? (
                                          <ChevronDown className="w-3 h-3 text-blue-500" />
                                        ) : (
                                          <ChevronRight className="w-3 h-3 text-blue-500" />
                                        )}
                                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                                        <span className="font-medium text-slate-800 text-xs">
                                          AO: {ao.name}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-3 text-xs">
                                        <span className="text-slate-500">
                                          {ao.noa} NOA
                                        </span>
                                        <span className="font-semibold text-slate-700">
                                          {ao.totalPencairan}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Level 4: Nasabah Table */}
                                    {isAoOpen && (
                                      <div className="p-3 bg-slate-50/50 overflow-x-auto">
                                        <table className="w-full text-left text-[11px]">
                                          <thead>
                                            <tr className="text-slate-400 border-b border-slate-200 font-semibold uppercase">
                                              <th className="pb-2">
                                                Nama Nasabah
                                              </th>
                                              <th className="pb-2">
                                                Plafon Pembiayaan
                                              </th>
                                              <th className="pb-2">Tenor</th>
                                              <th className="pb-2">Status</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-slate-100">
                                            {ao.nasabah.map((n) => (
                                              <tr key={n.id}>
                                                <td className="py-2 font-semibold text-slate-700">
                                                  {n.name}
                                                </td>
                                                <td className="py-2 font-bold text-slate-900">
                                                  {n.plafon}
                                                </td>
                                                <td className="py-2 text-slate-500">
                                                  {n.tenor}
                                                </td>
                                                <td className="py-2">
                                                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-medium">
                                                    {n.status}
                                                  </span>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
