"use client";

import { Input, Modal, Select } from "antd";
import { DataDataPengajuan } from "../utils/Interfaces";

export const FilterOption = ({
  options,
  width,
  onChange,
  placeHolder,
}: {
  options: any[];
  width?: number;
  onChange: Function;
  placeHolder?: any;
}) => {
  return (
    <Select
      options={options}
      allowClear
      size="small"
      style={{ width: width || 150 }}
      placeholder={placeHolder || "Filter"}
      onChange={(e) => onChange(e)}
    />
  );
};

export const ViewBerkas = ({
  title,
  open,
  setOpen,
  url,
  type,
}: {
  open: boolean;
  setOpen: Function;
  url: string | null;
  type: "pdf" | "video";
  title: string;
}) => {
  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        title={title}
        width={window && window.innerWidth > 600 ? "80vw" : "95vw"}
        style={{ top: 30 }}
        footer={[]}
      >
        <div className="h-[75vh]">
          {url ? (
            <object
              data={url}
              className="w-full h-full"
              type={type === "pdf" ? "application/pdf" : "video/mp4"}
              width="100%"
              height="100%"
            ></object>
          ) : (
            <div className="text-center text-red-500">
              <p>{title} belum di upload!</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export const FormInput = ({
  label,
  value,
  type,
  disabled,
  width,
  options,
  onChange,
  prefix,
  suffix,
  mode,
  className,
}: {
  label: string;
  value: any;
  type?: "number" | "area" | "date" | "options";
  disabled?: boolean;
  width?: number;
  options?: { label: any; value: any }[];
  onChange?: Function;
  prefix?: any;
  suffix?: any;
  mode?: "row" | "col";
  className?: string;
}) => {
  return (
    <div
      className={`w-full flex ${
        mode === "row" ? "flex-row gap-4 items-center" : "flex-col gap-1"
      } ${className ? className : ""}`}
    >
      <p style={{ width: width || 150 }}>{label}</p>
      <div className="flex-1">
        {!type && (
          <Input
            value={value}
            disabled={disabled}
            onChange={(e) => onChange && onChange(e.target.value)}
            prefix={prefix}
            suffix={suffix}
            style={{ width: "100%", color: "black" }}
          />
        )}
        {type && ["date", "number"].includes(type) && (
          <Input
            value={value}
            disabled={disabled}
            type={type}
            onChange={(e) => onChange && onChange(e.target.value)}
            prefix={prefix}
            suffix={suffix}
            style={{ width: "100%", color: "black" }}
          />
        )}
        {type && type === "area" && (
          <Input.TextArea
            value={value}
            disabled={disabled}
            onChange={(e) => onChange && onChange(e.target.value)}
            prefix={prefix}
            style={{ width: "100%", color: "black" }}
          />
        )}
        {type && type === "options" && (
          <Select
            options={options}
            value={value}
            disabled={disabled}
            onChange={(e) => onChange && onChange(e)}
            style={{ width: "100%", color: "black" }}
          />
        )}
      </div>
    </div>
  );
};

export const ViewBerkasPengajuan = ({
  open,
  setOpen,
  data,
  isEdit,
}: {
  open: boolean;
  setOpen: Function;
  data: DataDataPengajuan;
  isEdit?: boolean;
}) => {
  return (
    <div>
      <Modal
        open={open}
        width={"95vw"}
        title={"DATA PENGAJUAN " + data.nama}
        onClose={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        style={{ top: 30 }}
        footer={[]}
      >
        <div className="flex justify-between gap-4 flex-col sm:flex-row">
          <div style={{ width: window.innerWidth > 600 ? 500 : "100%" }}>
            LEFT
          </div>
          <div className="flex-1">RIGHT</div>
        </div>
      </Modal>
    </div>
  );
};
