"use client";

import { LogoutOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function Logout() {
  const [modalLogout, setModalLogout] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleCLick = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
  };
  return (
    <>
      <div className="flex justify-center">
        <Button
          onClick={() => setModalLogout(true)}
          icon={<LogoutOutlined />}
          style={{ color: "red" }}
        >
          <span className="flex md:hidden">Logout</span>
        </Button>
      </div>
      <Modal
        open={modalLogout}
        title="Konfirmasi Logout"
        footer={[]}
        onCancel={() => setModalLogout(false)}
      >
        <p>Lanjutkan Logout?</p>
        <div className="flex justify-end gap-3 mt-5">
          <Button onClick={() => setModalLogout(false)}>Batal</Button>
          <Button
            type="primary"
            onClick={() => handleCLick()}
            loading={loading}
          >
            Ya
          </Button>
        </div>
      </Modal>
    </>
  );
}
