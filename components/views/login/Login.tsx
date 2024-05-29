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
import ReCAPTCHA from "react-google-recaptcha";

export default function Login({ maintenance }: { maintenance: boolean }) {
  const { status } = useSession();
  const [feed, setFeed] = useState("");
  const [loading, setLoading] = useState(false);
  const notif = useContext(notifContext);
  const [stateTry, setStateTry] = useState<number>(0);
  const [cap, setCap] = useState(false);
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
    if (!cap) {
      setFeed("Mohon validasi captcha");
      setLoading(false);
      return;
    }
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
    <section className="login-wrap">
      <Spin spinning={loading}>
        <div className="login-form">
          <div className="flex justify-center">
            <img
              src={process.env.NEXT_PUBLIC_APP_LOGO}
              alt="Logo Kami"
              width={80}
            />
          </div>
          <div>
            <Form layout="vertical" onFinish={handleLogin}>
              <div className="px-5">
                <Form.Item label="Username" name={"username"}>
                  <Input required onChange={() => setFeed("")} />
                </Form.Item>
                <Form.Item label="Password" name={"password"}>
                  <Input.Password required onChange={() => setFeed("")} />
                </Form.Item>
                <Form.Item
                  required
                  className="flex justify-center"
                  style={{
                    overflowX: "hidden",
                  }}
                >
                  <ReCAPTCHA
                    sitekey="6Ldoq6MpAAAAAB_Ewiq0iZWG4fSEgQiTtlTqCDvV"
                    onChange={(e) => e && setCap(true)}
                    onErrored={() => setCap(false)}
                  />
                </Form.Item>
                {feed && (
                  <p
                    className="italic text-red-600 mb-2"
                    style={{ marginTop: -20 }}
                  >
                    <InfoCircleOutlined className="mr-2" />
                    {feed}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full bg-orange-500 p-3 rounded text-gray-100 font-bold"
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
