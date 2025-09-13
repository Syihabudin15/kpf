"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  LoadingOutlined,
  LoginOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Modal, Spin } from "antd";
import { useContext, useState } from "react";
import { notifContext } from "@/components/NotifContext";

export default function Login({ maintenance }: { maintenance: boolean }) {
  const { status } = useSession();
  const [feed, setFeed] = useState("");
  const [loading, setLoading] = useState(false);
  const notif = useContext(notifContext);
  const [stateTry, setStateTry] = useState<number>(0);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  if (status == "loading") {
    <Spin spinning={true} indicator={<LoadingOutlined />}>
      Loading <LoadingOutlined />
    </Spin>;
  } else if (status == "authenticated" && !maintenance) {
    router.push("/dashboard");
  } else if (maintenance) {
    async () => await signOut();
  }
  const handleLogin = async (e: any) => {
    if (maintenance && e.username.toLowerCase() !== "masterdata") {
      setOpen(true);
      return;
    }
    setLoading(true);
    const result = await signIn("credentials", {
      username: e.username.toLowerCase(),
      password: e.password,
      redirect: false,
    });
    if (result?.ok) {
      await notif.getNotifFunction();
      router.push("/dashboard");
    }
    if (result?.error) {
      if (stateTry === 3) {
        await fetch("/api/auth/user", {
          method: "PUT",
          headers: { "Content-Type": "Application/json" },
          body: JSON.stringify({ username: e.username }),
        });
      }
      if (result.error === "Username atau password salah!" && stateTry < 3) {
        setStateTry(stateTry + 1);
      }
      setLoading(false);
      setFeed(result.error);
    }
  };
  return (
    <section className="login-wrap flex justify-evenly md:gap-48 relative">
      <video
        src="/kpf-login-bg.mp4"
        className="absolute inset-0 h-full w-full object-cover filter brightness-75 contrast-110 saturate-125 "
        muted
        autoPlay
        loop
      />
      <div
        className="hidden md:block z-10 text-gray-50 p-2 font-bold text-center"
        style={{ lineHeight: 2 }}
      >
        <div className="text-3xl">
          <p className="drop-shadow-lg my-2">KOPERASI JASA</p>
          <p className="drop-shadow-lg">FADILLAH AQILA SEJAHTRA</p>
        </div>
        <div className="text-2xl italic mt-4">
          <p>Be Optimictic Success to Surplus</p>
        </div>
      </div>
      <Spin spinning={loading}>
        <div className="login-form">
          <div className="flex justify-center">
            <img
              src={"/assets/images/app_logo.png"}
              alt="Logo Kami"
              width={200}
            />
          </div>
          <div>
            <Form layout="vertical" onFinish={handleLogin}>
              <div className="px-5">
                <Form.Item label="Username" name={"username"}>
                  <Input required onChange={() => setFeed("")} />
                </Form.Item>
                <Form.Item label="Password" name={"password"} className="mb-10">
                  <Input.Password required onChange={() => setFeed("")} />
                </Form.Item>
                <div className="mt-10"></div>
                {feed && (
                  <p className="italic text-red-600 my-5">
                    <InfoCircleOutlined className="mr-2" />
                    {feed}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full bg-blue-500 p-3 rounded text-gray-100 font-bold mb-3"
                >
                  {loading ? (
                    <LoadingOutlined />
                  ) : (
                    <>
                      <span className="mr-3">SIGN IN</span>
                      <LoginOutlined />
                    </>
                  )}
                </button>
              </div>
            </Form>
          </div>
        </div>
      </Spin>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        footer={[
          <Button type="primary" key={1} onClick={() => setOpen(false)}>
            OK
          </Button>,
        ]}
        title={
          <div className="text-red-500">
            <InfoCircleOutlined /> SITE MAINTENANCE
          </div>
        }
      >
        <p>Maaf website sedang dalam tahap maintenance!</p>
      </Modal>
    </section>
  );
}
