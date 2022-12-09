import React from 'react';
import { useNavigationContext } from '../../../../context/NavigationContext';
import { BaseInput, DangerInput, HintText, InputContainer } from "./Input";

const InputEmail = () => {
    const re = /\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/g;
    const { email } = useNavigationContext();
    const handleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const match = re.exec(newValue);
        const isValid = match !== null && match[0] === newValue;
        email.setIsValid(isValid);
        email.setValue(newValue);
    };

    const showValid = email.isValid || email.value.length === 0;
    const Input = showValid ? BaseInput : DangerInput;
    return (
      <>
        <InputContainer>
          <Input
            autoFocus
            placeholder='輸入電子信箱'
            value={email.value}
            onChange={handleChanged}
          />
          {showValid ? <></> : <HintText>⚠ 請輸入正確的電子郵件</HintText>}
        </InputContainer>
      </>
    );
  };
  
export default InputEmail;
  