import React from 'react';
import { useNavigationContext } from '../../../../context/NavigationContext';
import { BaseInput, DangerInput, HintText, InputContainer } from "./Input";

const InputEmail = () => {
    const re = /[.*a-zA-Z\d]{4,100}/g;
    const { password } = useNavigationContext();
    const handleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const match = re.exec(newValue);
        const isValid = match !== null && match[0] === newValue;
        password.setIsValid(isValid);
        password.setValue(newValue);
    };

    const showValid = password.isValid || password.value.length === 0;
    const Input = showValid ? BaseInput : DangerInput;
    return (
      <>
        <InputContainer>
          <Input
            autoFocus
            placeholder='輸入密碼'
            type='password'
            value={password.value}
            onChange={handleChanged}
          />
          {showValid ? <></> : <HintText>⚠ 請輸入 4 ~ 100 個字元的英文字母、數字</HintText>}
        </InputContainer>
      </>
    );
  };
  
export default InputEmail;
  