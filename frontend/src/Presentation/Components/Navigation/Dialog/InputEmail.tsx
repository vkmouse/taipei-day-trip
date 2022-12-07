import React, { useRef, useState } from 'react';
import { useNavigationContext } from '../../../../context/NavigationContext';
import { BaseInput, DangerInput, HintText, InputContainer } from "./Input";

const InputEmail = (props: { 
    onChange?: (value: string, isValid: boolean) => void 
}) => {
    const re = /\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/g;
    const isValid = useRef(true);
    const { email, setEmail } = useNavigationContext();
    const Input = isValid.current ? BaseInput : DangerInput;
    const handleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const match = re.exec(newValue);
        isValid.current = match !== null && match[0] === newValue;
        setEmail(newValue);
        props.onChange?.(newValue, isValid.current);
    };

    return (
      <>
        <InputContainer>
          <Input
            autoFocus
            placeholder='輸入電子信箱'
            value={email}
            onChange={handleChanged}
          />
          {isValid.current ? <></> : <HintText>⚠ 請輸入正確的電子郵件</HintText>}
        </InputContainer>
      </>
    );
  };
  
export default InputEmail;
  