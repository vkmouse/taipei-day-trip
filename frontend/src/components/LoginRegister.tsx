import styled from '@emotion/styled';
import React, { useState, useReducer } from 'react';
import { useAuthContext } from '../context/AuthContext';
import useLogin from '../hooks/useLogin';
import useRegister from '../hooks/useRegister';
import { H3, Secondery70, Secondery20, Primary, BodyMedium, Secondery50 } from '../utils/CommonStyles';
import { validateEmail, validateName, validatePassword } from '../utils/validate';

const FullPage = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
`;

const Modal = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ModalOverlay = styled.div`
  position: absolute;
  background: black;
  opacity: 0.25;
  width: 100%;
  height: 100%;
`;

const ModalContent = styled.div`
  display: flex;
  justify-content: center;
`;

const ModalBody = styled.div`
  z-index: 1;  
  margin-top: 80px;
  width: 340px;
  background: white;
  border-radius: 5px;
`;

const DecoratorBar = styled.div`
  width: 100%;
  height: 10px;
  background: linear-gradient(270deg, #337788 0%, #66AABB 100%);
  border-radius: 5px 5px 0 0;
`;

const Form = styled.form`
  padding: 15px;
`;

const TitleContainer = styled.div`
  display: flex;
`;

const Title = styled.div`
  ${H3}
  text-align: center;
  color: ${Secondery70};
  flex-grow: 1;
  margin-left: 24px;
  user-select: none;
`;

const Cancel = styled.div`
  padding: 4px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  user-select: none;
  border-radius: 5px;
  &:hover {
    background-color: ${Secondery20};
  }
`;

const CancelIcon = styled.img`
  content: url('/cancel.png');
  width: 16px;
  height: 16px;
`;

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

const InputContainer = styled.div`
  margin: 10px 0;
  padding: 0 32px 0 0;
`;

const BaseInput = styled.input`
  padding: 10px 15px;
  width: 100%;
  ${BodyMedium}
  color: ${Secondery50};
  border: 1px solid #CCCCCC;
  border-radius: 5px;
  &:focus {
    outline: none;
    border: 1px solid ${Primary};
    box-shadow: 0 0 4px ${Primary};
  }
`;

const DangerInput = styled(BaseInput)`
  &:focus {
    outline: none;
    border: 1px solid red;
    box-shadow: 0 0 4px red;
  }
`;

const HintTextStyle = styled.span`
  font-family: 'Noto Sans TC';
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 23px;
  color: red;
`;

type Description = {
  title: string
  button: string
  text: string
  textButton: string
}

const loginDescription: Description = {
  title: '登入會員帳號',
  button: '登入帳戶',
  text: '還沒有帳戶？',
  textButton: '點此註冊',
};

const registerDescription: Description = {
  title: '註冊會員帳號',
  button: '註冊新帳戶',
  text: '已經有帳戶了？',
  textButton: '點此登入',
};

const HintText = (props: { status: string, message: string }) => {
  const color = props.status === 'Success' ? 'blue' : 'red';
  if (props.status === 'Success' || props.status === 'Failed') {
    return <HintTextStyle style={{ color }}>{props.message}</HintTextStyle>;
  }
  return <></>;
};

const InputField = (props: { 
  autoFocus?: boolean
  dangerMessage: string
  placeholder: string
  type?: React.HTMLInputTypeAttribute
  value: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  const { dangerMessage } = props;
  const Input = dangerMessage ? DangerInput : BaseInput;
  return (
    <>
      <InputContainer>
        <Input {...props} />
        {dangerMessage ? <HintTextStyle>{dangerMessage}</HintTextStyle> : <></>}
      </InputContainer>
    </>
  );
};

type LoginRegisterState = {
  email: string
  emailValid: boolean
  name: string
  nameValid: boolean
  password: string
  passwordValid: boolean
}

type LoginRegisterAction = 
  | { type: 'SET_EMAIL', payload: string }
  | { type: 'SET_NAME', payload: string }
  | { type: 'SET_PASSWORD', payload: string }
  | { type: 'CLEAR' };
const setEmail = (email: string): LoginRegisterAction => { return { type: 'SET_EMAIL', payload: email }; };
const setName = (name: string): LoginRegisterAction => { return { type: 'SET_NAME', payload: name }; };
const setPassword = (password: string): LoginRegisterAction => { return { type: 'SET_PASSWORD', payload: password }; };
const clear = (): LoginRegisterAction => { return { type: 'CLEAR' }; };

const initialState: LoginRegisterState = {
  email: '',
  emailValid: false,
  name: '',
  nameValid: false,
  password: '',
  passwordValid: false,
};

const loginRegisterReducer = (state: LoginRegisterState, action: LoginRegisterAction): LoginRegisterState => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { 
        ...state,
        email: action.payload,
        emailValid: validateEmail(action.payload),
      };
    case 'SET_NAME':
      return { 
        ...state,
        name: action.payload,
        nameValid: validateName(action.payload),
      };
    case 'SET_PASSWORD':
      return { 
        ...state,
        password: action.payload,
        passwordValid: validatePassword(action.payload),
      };
    case 'CLEAR':
      return {
        email: '',
        emailValid: false,
        name: '',
        nameValid: false,
        password: '',
        passwordValid: false,
      };
    default:
      return state;
  }
};

const LoginRegister = (props: {
  display: string,
  hide?: () => void,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [state, dispatch] = useReducer(loginRegisterReducer, initialState);
  const { email, emailValid, name, nameValid, password, passwordValid } = state;
  const description: Description = isLogin ? loginDescription : registerDescription;
  const loginHandler = useLogin();
  const registerHandler = useRegister();
  const auth = useAuthContext();

  const switchForm = () => {
    loginHandler.clear();
    registerHandler.clear();
    setIsLogin(() => !isLogin);
    dispatch(clear());
  };

  const isValid = (isLogin && emailValid && passwordValid) || 
                  (emailValid && passwordValid && nameValid);
  const buttonCursor = isValid ? 'pointer' : 'not-allowed';

  let emailMessage = '';
  if (loginHandler.status === 'EmailFailed') {
    emailMessage = loginHandler.message;
  } else if (registerHandler.status === 'EmailFailed') {
    emailMessage = registerHandler.message;
  } else if (!emailValid && email.length) {
    emailMessage = '⚠ 請輸入正確的電子郵件';
  }

  let passwordMessage = '';
  if (loginHandler.status === 'PasswordFailed') {
    passwordMessage = loginHandler.message;
  } else if (registerHandler.status === 'PasswordFailed') {
    passwordMessage = registerHandler.message;
  } else if (!passwordValid && password.length) {
    passwordMessage = '⚠ 請輸入 4 ~ 100 個字元的英文字母、數字';
  }

  return (
    <FullPage style={{ display: props.display }}>
      <Modal>
        <ModalOverlay onClick={props.hide}/>
        <ModalContent>
          <ModalBody>
            <DecoratorBar />
            <Form onSubmit={e => e.preventDefault()}>
              <TitleContainer>
                <Title>{description.title}</Title>
                <Cancel onClick={props.hide}><CancelIcon /></Cancel>
              </TitleContainer>
              {isLogin ? <></> : 
                <InputField
                  autoFocus
                  dangerMessage={nameValid || name.length === 0 ? '' : '⚠ 請輸入 1 ~ 20 個字元'}
                  placeholder='輸入姓名'
                  value={name}
                  onChange={e => dispatch(setName(e.target.value))}
                /> }
              <InputField 
                autoFocus
                dangerMessage={emailMessage}
                placeholder='輸入電子信箱'
                value={email}
                onChange={e => dispatch(setEmail(e.target.value))}
              />
              <InputField
                autoFocus
                dangerMessage={passwordMessage}
                placeholder='輸入密碼'
                type='password'
                value={password}
                onChange={e => dispatch(setPassword(e.target.value))}
              />
              <Button 
                style={{cursor: buttonCursor}} 
                disabled={!isValid}
                onClick={() => {
                  if (isLogin) {
                    loginHandler.login(email, password);
                  } else {
                    registerHandler.register(name, email, password);
                  }
                }}>
                {description.button}
              </Button>
              <TextContainer>
                {isLogin ? <HintText {...loginHandler} /> : <></>}
                {!isLogin ? <HintText {...registerHandler} /> : <></>}
              </TextContainer>
              <TextContainer>
                <Text>{description.text}</Text>
                <TextButton onClick={switchForm}>{description.textButton}</TextButton>
              </TextContainer>
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </FullPage>
  );
};

export default LoginRegister;
