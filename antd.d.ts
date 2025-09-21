import "antd";
import type { ModalProps } from "antd";

declare module "antd" {
  interface ModalProps {
    /** Custom property untuk kompatibilitas onClose */
    onClose?: () => void;
  }
}
