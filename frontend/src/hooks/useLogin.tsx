import { useState } from "react";
import { useAPIContext, LoginResponse } from "../context/APIContext";

type Status =
  | "Pending"
  | "Success"
  | "Failed"
  | "EmailFailed"
  | "PasswordFailed";

const useLogin = () => {
  const api = useAPIContext();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("Success");

  const login = async (email: string, password: string) => {
    setStatus("Pending");
    const response = await api.login(email, password);
    switch (response) {
      case LoginResponse.Success:
        setMessage("✔ 登入成功");
        setStatus("Success");
        await api.getUserInfo();
        break;
      case LoginResponse.EmailNotExist:
        setMessage("⚠ 電子郵件不存在");
        setStatus("EmailFailed");
        break;
      case LoginResponse.LoginFailed:
        setMessage("⚠ 登入失敗");
        setStatus("Failed");
        break;
      case LoginResponse.PasswordError:
        setMessage("⚠ 密碼錯誤");
        setStatus("PasswordFailed");
        break;
      case LoginResponse.ServerFailed:
        setMessage("⚠ 伺服器異常");
        setStatus("Failed");
        break;
    }
  };

  const clear = () => {
    setMessage("");
    setStatus("Success");
  };

  return { status, message, login, clear };
};

export default useLogin;
