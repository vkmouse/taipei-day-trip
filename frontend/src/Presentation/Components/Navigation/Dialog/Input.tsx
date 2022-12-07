import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Secondery50, Primary } from "../../../Styles/Colors";
import { BodyMedium } from "../../../Styles/Typography";

export const InputContainer = styled.form`
  margin: 10px 0;
  padding: 0 32px 0 0;
`;

export const BaseInput = styled.input`
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

export const DangerInput = styled(BaseInput)`
  &:focus {
    outline: none;
    border: 1px solid red;
    box-shadow: 0 0 4px red;
  }
`;

export const HintText = styled.span`
  font-family: 'Noto Sans TC';
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 23px;
  color: red;
`;
