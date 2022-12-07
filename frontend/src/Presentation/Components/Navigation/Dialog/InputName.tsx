import React, { useRef, useState } from 'react';
import { BaseInput, DangerInput, HintText, InputContainer } from "./Input";

const InputName = (props: { 
    onChange?: (value: string, isValid: boolean) => void 
}) => {
    const re = /.{1,20}/g;
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
            placeholder='輸入姓名'
            value={value}
            onChange={handleChanged}
          />
          {isValid.current ? <></> : <HintText>⚠ 請輸入 1 ~ 20 個字元</HintText>}
        </InputContainer>
      </>
    );
  };
  
export default InputName;
  