import { useState } from "react";
import { useAuthContext, LoginResponse } from "../context/AuthContext";

const useLogin = () => {
  const auth = useAuthContext();
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');

  const login = async (email: string, password: string) => {
    setSuccess(null);
    const response = await auth.login(email, password);
    switch (response) {
      case LoginResponse.Success: 
        setMessage('✔ 登入成功');
        setSuccess(true);
        break;
      case LoginResponse.EmailNotExist:
        setMessage('⚠ 電子郵件不存在');
        setSuccess(false);
        break;
      case LoginResponse.LoginFailed:
        setMessage('⚠ 登入失敗');
        setSuccess(false);
        break;
      case LoginResponse.PasswordError:
        setMessage('⚠ 密碼錯誤');
        setSuccess(false);
        break;
      case LoginResponse.ServerFailed:
        setMessage('⚠ 伺服器異常');
        setSuccess(false);
        break;
    }
  };

  const clear = () => {
    setMessage('');
    setSuccess(null);
  };

  return { success, message, login, clear };
};

export default useLogin;
