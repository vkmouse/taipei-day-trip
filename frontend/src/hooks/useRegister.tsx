import { useState } from "react";
import { useAPIContext } from "../context/APIContext";

type Status = 
  | 'Pending'
  | 'Success'
  | 'Failed'
  | 'EmailFailed'
  | 'PasswordFailed';

const useRegister = () => {
  const api = useAPIContext();
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('Success');

  const register = async (name: string, email: string, password: string) => {
    setStatus('Pending');
    const response = await api.register(name, email, password);
    switch (response.status) {
      case 200:
        setMessage('✔ 註冊成功！');
        setStatus('Success');
        break;
      case 400:
        setMessage('⚠ 註冊失敗');
        setStatus('Failed');
        break;
      case 409:
        setMessage('⚠ 電子郵件已經被註冊');
        setStatus('EmailFailed');
        break;
      case 500:
        setMessage('⚠ 伺服器異常');
        setStatus('Failed');
        break;
    }
  };

  const clear = () => {
    setMessage('');
    setStatus('Success');
  };

  return { status, message, register, clear };
};

export default useRegister;
