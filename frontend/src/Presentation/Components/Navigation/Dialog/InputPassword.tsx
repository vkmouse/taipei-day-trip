import React, { useRef, useState } from 'react';
import { BaseInput, DangerInput, HintText, InputContainer } from "./Input";

const InputEmail = (props: { 
    onChange?: (value: string, isValid: boolean) => void 
}) => {
    const re = /[.*a-zA-Z\d]{4,100}/g;
    const isValid = useRef(true);
    const [value, setValue] = useState('');
    const Input = isValid.current ? BaseInput : DangerInput;
    const handleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const match = re.exec(newValue);
        isValid.current = match !== null && match[0] === newValue;      
        setValue(newValue);
        props.onChange?.(newValue, isValid.current);
    };

    return (
      <>
        <InputContainer>
          <Input
            autoFocus
            placeholder='輸入密碼'
            type='password'
            autoComplete='off'
            value={value}
            onChange={handleChanged}
          />
          {isValid.current ? <></> : <HintText>⚠ 請輸入 4 ~ 100 個字元的英文字母、數字</HintText>}
        </InputContainer>
      </>
    );
  };
  
export default InputEmail;
  