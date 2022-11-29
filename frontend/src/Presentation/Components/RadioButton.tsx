import styled from '@emotion/styled';
import React, { useState } from 'react';
import { Primary } from '../Styles/Colors';
import { BodyMedium } from '../Styles/Typography';

const RadioContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-left: 5px;
  padding-right: 13px;
`;

const Input = styled.input`
  appearance: none;
  background-color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  margin: 0 4px 0 0;
  :checked {
    background-color: ${Primary};
    border: 2px solid white;
  }
`;

const Text =  styled.label`
  ${BodyMedium}
`;

const Radio = (props: { label: string, value: string, checked?: boolean, onClick?: () => void }) => {
  const { label, value, checked, onClick } = props;

  return (
    <RadioContainer onClick={onClick}>
      <Input type='radio' value={value} checked={checked} onChange={() => void 0}/>
      <Text>{label}</Text>
    </RadioContainer>
  );
};

const RadioGroupContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const RadioGroup = (props: { children: JSX.Element[], onChanged: (value: string) => void }) => {
  const [selected, setSelected] = useState(0);
  const getList = () => {
    const list = Array(props.children.length).fill(false);
    list[selected] = true;
    return list;
  };

  return (
    <RadioGroupContainer>
      {getList().map((checked, i) => {
        const { value, label } = props.children[i].props;
        return <Radio 
          key={i} 
          value={value} 
          label={label} 
          checked={checked}
          onClick={() => {
            setSelected(i);
            props.onChanged(value);
          }}
        />;
      })}
    </RadioGroupContainer>
  );
};

export { Radio, RadioGroup };
