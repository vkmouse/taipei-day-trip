import React from 'react';
import { useNavigationContext } from '../../../../context/NavigationContext';
import { BaseInput, DangerInput, HintText, InputContainer } from "./Input";

const InputName = () => {
    const re = /.{1,20}/g;
    const { name } = useNavigationContext();
    const handleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const match = re.exec(newValue);
        const isValid = match !== null && match[0] === newValue;
        name.setIsValid(isValid);
        name.setValue(newValue);
    };

    const showValid = name.isValid || name.value.length === 0;
    const Input = showValid ? BaseInput : DangerInput;
    return (
      <>
        <InputContainer>
          <Input
            autoFocus
            placeholder='輸入姓名'
            value={name.value}
            onChange={handleChanged}
          />
          {showValid ? <></> : <HintText>⚠ 請輸入 1 ~ 20 個字元</HintText>}
        </InputContainer>
      </>
    );
  };
  
export default InputName;
  