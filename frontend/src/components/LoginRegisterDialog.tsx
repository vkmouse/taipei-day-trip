import styled from "@emotion/styled";
import React, { useState, useReducer } from "react";
import useLogin from "../hooks/useLogin";
import useRegister from "../hooks/useRegister";
import {
  Secondery70,
  Secondery20,
  Primary,
  BodyMedium,
} from "../utils/CommonStyles";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../utils/validate";
import Dialog from "./Dialog";
import InputField from "./InputField";

const Button = styled.button`
  padding: 15px;
  margin: 0 0 10px 0;
  width: 100%;
  background-color: ${Primary};
  color: white;
  font-size: 19px;
  line-height: 16px;
  border-radius: 5px;
  border-width: 0;
  cursor: pointer;
  user-select: none;
  &:disabled {
    background-color: ${Secondery20};
    color: ${Secondery70};
  }
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Text = styled.div`
  ${BodyMedium}
  color: ${Secondery70};
  user-select: none;
`;

const TextButton = styled(Text)`
  padding: 0 4px 0 4px;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: ${Secondery20};
  }
`;

const HintTextStyle = styled.span`
  font-family: "Noto Sans TC";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 23px;
  color: red;
`;

const HintText = (props: { status: string; message: string }) => {
  const color = props.status === "Success" ? "blue" : "red";
  if (props.status === "Success" || props.status === "Failed") {
    return <HintTextStyle style={{ color }}>{props.message}</HintTextStyle>;
  }
  return <></>;
};

type State = {
  email: string;
  emailValid: boolean;
  name: string;
  nameValid: boolean;
  password: string;
  passwordValid: boolean;
};

enum Type {
  SET_EMAIL,
  SET_NAME,
  SET_PASSWORD,
}

type Action = { type: Type; payload: string };
const setEmail = (email: string): Action => {
  return { type: Type.SET_EMAIL, payload: email };
};
const setName = (name: string): Action => {
  return { type: Type.SET_NAME, payload: name };
};
const setPassword = (password: string): Action => {
  return { type: Type.SET_PASSWORD, payload: password };
};

const initialState: State = {
  email: "a@a.a",
  emailValid: true,
  name: "vkmouse",
  nameValid: true,
  password: "aaaa",
  passwordValid: true,
};

const Reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Type.SET_EMAIL:
      return {
        ...state,
        email: action.payload,
        emailValid: validateEmail(action.payload),
      };
    case Type.SET_NAME:
      return {
        ...state,
        name: action.payload,
        nameValid: validateName(action.payload),
      };
    case Type.SET_PASSWORD:
      return {
        ...state,
        password: action.payload,
        passwordValid: validatePassword(action.payload),
      };
    default:
      return state;
  }
};

const LoginRegisterDialog = (props: { hide?: () => void }) => {
  const [isLoginDialog, setIsLoginDialog] = useState(true);

  const switchForm = () => {
    setIsLoginDialog((isLoginDialog) => !isLoginDialog);
  };

  if (isLoginDialog) {
    return <LoginDialog hide={props.hide} switchForm={switchForm} />;
  } else {
    return <RegisterDialog hide={props.hide} switchForm={switchForm} />;
  }
};

const LoginDialog = (props: { hide?: () => void; switchForm: () => void }) => {
  const { hide, switchForm } = props;
  const [state, dispatch] = useReducer(Reducer, initialState);
  const { email, emailValid, password, passwordValid } = state;
  const handler = useLogin();
  const isValid = emailValid && passwordValid;

  let emailMessage = "";
  if (handler.status === "EmailFailed") {
    emailMessage = handler.message;
  } else if (!emailValid && email.length) {
    emailMessage = "⚠ 請輸入正確的電子郵件";
  }

  let passwordMessage = "";
  if (handler.status === "PasswordFailed") {
    passwordMessage = handler.message;
  } else if (!passwordValid && password.length) {
    passwordMessage = "⚠ 請輸入 4 ~ 100 個字元的英文字母、數字";
  }

  return (
    <Dialog title={"登入會員帳號"} hide={hide}>
      <InputField
        autoFocus
        dangerMessage={emailMessage}
        placeholder="輸入電子信箱"
        value={email}
        onChange={(e) => dispatch(setEmail(e.target.value))}
      />
      <InputField
        autoFocus
        autoComplete="off"
        dangerMessage={passwordMessage}
        placeholder="輸入密碼"
        type="password"
        value={password}
        onChange={(e) => dispatch(setPassword(e.target.value))}
      />
      <Button
        style={{ cursor: isValid ? "pointer" : "not-allowed" }}
        disabled={!isValid}
        onClick={() => handler.login(email, password)}
      >
        登入帳戶
      </Button>
      <TextContainer>
        <HintText {...handler} />
      </TextContainer>
      <TextContainer>
        <Text>還沒有帳戶？</Text>
        <TextButton onClick={switchForm}>點此註冊</TextButton>
      </TextContainer>
    </Dialog>
  );
};

const RegisterDialog = (props: {
  hide?: () => void;
  switchForm: () => void;
}) => {
  const { hide, switchForm } = props;
  const [state, dispatch] = useReducer(Reducer, initialState);
  const { email, emailValid, name, nameValid, password, passwordValid } = state;
  const handler = useRegister();
  const isValid = emailValid && passwordValid && nameValid;

  let emailMessage = "";
  if (handler.status === "EmailFailed") {
    emailMessage = handler.message;
  } else if (!emailValid && email.length) {
    emailMessage = "⚠ 請輸入正確的電子郵件";
  }

  let passwordMessage = "";
  if (handler.status === "PasswordFailed") {
    passwordMessage = handler.message;
  } else if (!passwordValid && password.length) {
    passwordMessage = "⚠ 請輸入 4 ~ 100 個字元的英文字母、數字";
  }

  return (
    <Dialog title={"註冊會員帳號"} hide={hide}>
      <InputField
        autoFocus
        dangerMessage={
          nameValid || name.length === 0 ? "" : "⚠ 請輸入 1 ~ 20 個字元"
        }
        placeholder="輸入姓名"
        value={name}
        onChange={(e) => dispatch(setName(e.target.value))}
      />
      <InputField
        autoFocus
        dangerMessage={emailMessage}
        placeholder="輸入電子信箱"
        value={email}
        onChange={(e) => dispatch(setEmail(e.target.value))}
      />
      <InputField
        autoFocus
        autoComplete="off"
        dangerMessage={passwordMessage}
        placeholder="輸入密碼"
        type="password"
        value={password}
        onChange={(e) => dispatch(setPassword(e.target.value))}
      />
      <Button
        style={{ cursor: isValid ? "pointer" : "not-allowed" }}
        disabled={!isValid}
        onClick={() => handler.register(name, email, password)}
      >
        註冊新帳戶
      </Button>
      <TextContainer>
        <HintText {...handler} />
      </TextContainer>
      <TextContainer>
        <Text>已經有帳戶了？</Text>
        <TextButton onClick={switchForm}>點此登入</TextButton>
      </TextContainer>
    </Dialog>
  );
};

export default LoginRegisterDialog;
