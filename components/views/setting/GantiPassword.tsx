"use client";

import { LoadingOutlined } from "@ant-design/icons";
import { User } from "@prisma/client";
import { Form, Input, Spin, message } from "antd";
import { useEffect, useState } from "react";

export default function GantiPassword() {
  const [data, setData] = useState<User>();
  const [msg, setMsg] = useState<string>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch(`/api/ganti-password`);
      const result = await res.json();
      setData(result);
      setLoading(false);
    })();
  }, []);

  const handleChangePassword = async (e: any) => {
    if (!e.password || !e.password_baru) {
      setMsg("Mohon isi perubahan sandi terlebih dahulu!");
    }
    if (e.password_baru !== e.konfirmasi_password_baru) {
      setMsg("password baru tidak sesui dengan konfirmasi password!");
    }
    setLoading(true);
    const res = await fetch("/api/ganti-password", {
      method: "POST",
      body: JSON.stringify({ id: data?.id, ...e }),
    });
    const result = await res.json();
    if (res.ok) {
      message.success("Ganti password berhasil");
    } else {
      setMsg(result.msg);
    }
    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <div className="py-2 px-3">
        <div className="block mb-5 md:flex flex-wrap gap-5">
          <div
            style={{
              flex: 0.8,
              marginTop: 10,
              border: "1px solid #aaa",
              padding: 5,
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
            className="text-sm"
          >
            <div className="flex justify-center my-2">
              <img
                src={data?.picture as string}
                width={100}
                style={{ border: "2px solid orange", borderRadius: 50 }}
              />
            </div>
            <div className="flex justify-between">
              <span className="flex-1">Nama Depan</span>
              <span style={{flex: .5}}>:</span>
              <span className="flex-1">{data?.first_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex-1">Nama Belakang</span>
              <span style={{flex: .5}}>:</span>
              <span className="flex-1">{data?.last_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex-1">Email</span>
              <span style={{flex: .5}}>:</span>
              <span className="flex-1">{data?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex-1">Username</span>
              <span style={{flex: .5}}>:</span>
              <span className="flex-1">{data?.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex-1">No Telepon</span>
              <span style={{flex: .5}}>:</span>
              <span className="flex-1">{data?.no_telepon}</span>
            </div>
            <div className="flex justify-between">
              <span className="flex-1">Jabatan</span>
              <span style={{flex: .5}}>:</span>
              <span className="flex-1">{data?.posisi}</span>
            </div>
          </div>
          <div style={{ flex: 1.2 }}>
            <div className="text-center font-bold my-5">Ganti Password</div>
            <Form
              labelCol={{ span: 7 }}
              onFinish={handleChangePassword}
              onFieldsChange={() => setMsg(undefined)}
            >
              <Form.Item label="Password Saat Ini" name={"password"}>
                <Input.Password />
              </Form.Item>
              <Form.Item label="Password Baru" name={"password_baru"}>
                <Input.Password />
              </Form.Item>
              <Form.Item
                label="Konfirmasi Password Baru"
                name={"konfirmasi_password_baru"}
              >
                <Input.Password />
              </Form.Item>
              {msg && (
                <div className="text-red-500 my-2 text-xs text-center">
                  {msg}
                </div>
              )}
              <Form.Item className="flex justify-center">
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white py-2 w-20 text-xs rounded shadow"
                >
                  Submit {loading && <LoadingOutlined />}
                </button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </Spin>
  );
}
