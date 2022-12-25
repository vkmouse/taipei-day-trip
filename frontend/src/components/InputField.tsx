import styled from "@emotion/styled";
import React, { CSSProperties } from "react";
import { BodyMedium, Secondery50, Primary } from "../utils/CommonStyles";

const InputContainer = styled.div`
  margin: 10px 0;
  padding: 0 32px 0 0;
`;

const BaseInput = styled.input`
  padding: 10px 15px;
  width: 100%;
  ${BodyMedium}
  color: ${Secondery50};
  border: 1px solid #cccccc;
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
  font-family: "Noto Sans TC";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 23px;
  color: red;
`;

const InputField = (props: {
  autoFocus?: boolean;
  autoComplete?: string;
  dangerMessage: string;
  placeholder: string;
  style?: CSSProperties;
  type?: React.HTMLInputTypeAttribute;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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

export default InputField;
