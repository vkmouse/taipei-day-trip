import styled from '@emotion/styled';
import React, { useRef, useState } from 'react';
import { useAPIContext } from '../context/APIContext';
import { LoginResponse, useAuthContext } from '../context/AuthContext';
import { useNavigationContext } from '../context/NavigationContext';
import { Primary, Secondery20, Secondery50, Secondery70 } from '../Presentation/Styles/Colors';
import { BodyMedium, H3 } from '../Presentation/Styles/Typography';
import { validateEmail, validateName, validatePassword } from '../utils/validate';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const InnerContainer = styled.div`
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

const Form = styled.div`
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
  content: url("/cancel.png");
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

const HintText = styled.span`
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

const InputField = (props: { 
  autoFocus?: boolean
  dangerMessage: string
  isValid: boolean
  placeholder: string
  type?: React.HTMLInputTypeAttribute
  value: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  const { dangerMessage, isValid } = props;
  const Input = isValid ? BaseInput : DangerInput;
  return (
    <>
      <InputContainer>
        <Input {...props} />
        {isValid ? <></> : <HintText>{dangerMessage}</HintText>}
      </InputContainer>
    </>
  );
};

const Dialog = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [responseText, setResponseText] = useState('');
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(false);
  const [name, setName] = useState('');
  const [nameValid, setNameValid] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(false);
  const requireSuccess = useRef(true);
  const { dialog } = useNavigationContext();
  const description: Description = isLogin ? loginDescription : registerDescription;
  const api = useAPIContext();
  const auth = useAuthContext();

  const switchForm = () => {
    setResponseText('');
    setIsLogin(() => !isLogin);
    setEmail('');
    setEmailValid(false);
    setPassword('');
    setPasswordValid(false);
    setName('');
    setNameValid(false);
  };

  const register = async () => {
    const response = await api.register(name, email, password);
    requireSuccess.current = false;
    switch (response.status) {
      case 200:
        setResponseText('✔ 註冊成功！');
        requireSuccess.current = true;
        break;
      case 400:
        setResponseText('⚠ 註冊失敗');
        break;
      case 409:
        setResponseText('⚠ 電子郵件已經被註冊');
        break;
      case 500:
        setResponseText('⚠ 伺服器異常');
        break;
    }
  };

  const login = async () => {
    const response = await auth.login(email, password);
    requireSuccess.current = false;
    switch (response) {
      case LoginResponse.Success: 
        setResponseText('✔ 登入成功');
        requireSuccess.current = true;
        dialog.hide();
        break;
      case LoginResponse.EmailNotExist:
        setResponseText('⚠ 電子郵件不存在');
        break;
      case LoginResponse.LoginFailed:
        setResponseText('⚠ 登入失敗');
        break;
      case LoginResponse.PasswordError:
        setResponseText('⚠ 密碼錯誤');
        break;
      case LoginResponse.ServerFailed:
        setResponseText('⚠ 伺服器異常');
        break;
    }
  };

  const handleClick = () => {
    if (isLogin) {
      login();
    } else {
      register();
    }
  };

  const isValid = (isLogin && emailValid && passwordValid) || 
                  (emailValid && passwordValid && nameValid);
  const buttonCursor = isValid ? 'pointer' : 'not-allowed';
  return (
    <Container>
      <InnerContainer>
        <DecoratorBar />
        <Form>
          <TitleContainer>
            <Title>{description.title}</Title>
            <Cancel onClick={dialog.hide}><CancelIcon /></Cancel>
          </TitleContainer>
          {isLogin ? <></> : 
            <InputField
              autoFocus
              dangerMessage='⚠ 請輸入 1 ~ 20 個字元'
              isValid={nameValid || name.length === 0}
              placeholder='輸入姓名'
              value={name}
              onChange={e => {
                setNameValid(validateName(e.target.value));
                setName(e.target.value);
              }}
            /> }
          <InputField 
            autoFocus
            dangerMessage='⚠ 請輸入正確的電子郵件'
            isValid={emailValid || email.length === 0}
            placeholder='輸入電子信箱'
            value={email}
            onChange={e => {
              setEmailValid(validateEmail(e.target.value));
              setEmail(e.target.value);
            }}
          />
          <InputField 
            autoFocus
            dangerMessage='⚠ 請輸入 4 ~ 100 個字元的英文字母、數字'
            isValid={passwordValid || password.length === 0}
            placeholder='輸入密碼'
            type='password'
            value={password}
            onChange={e => {
              setPasswordValid(validatePassword(e.target.value));
              setPassword(e.target.value);
            }}
          />
          <Button 
            style={{cursor: buttonCursor}} 
            disabled={!isValid}
            onClick={handleClick}>
            {description.button}
          </Button>
          <TextContainer>
            <HintText style={{color: requireSuccess.current ? 'blue' : 'red' }}>{responseText}</HintText>
          </TextContainer>
          <TextContainer>
            <Text>{description.text}</Text>
            <TextButton onClick={switchForm}>{description.textButton}</TextButton>
          </TextContainer>
        </Form>
      </InnerContainer>
    </Container>
  );
};

export default Dialog;
