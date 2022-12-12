import { useState } from "react";
import { useAPIContext } from "../context/APIContext";

const useRegister = () => {
  const api = useAPIContext();
  const [success, setSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState('');

  const register = async (name: string, email: string, password: string) => {
    setSuccess(null);
    const response = await api.register(name, email, password);
    switch (response.status) {
      case 200:
        setMessage('✔ 註冊成功！');
        setSuccess(true);
        break;
      case 400:
        setMessage('⚠ 註冊失敗');
        setSuccess(false);
        break;
      case 409:
        setMessage('⚠ 電子郵件已經被註冊');
        setSuccess(false);
        break;
      case 500:
        setMessage('⚠ 伺服器異常');
        setSuccess(false);
        break;
    }
  };

  const clear = () => {
    setMessage('');
    setSuccess(null);
  };

  return { success, message, register, clear };
};

export default useRegister;
