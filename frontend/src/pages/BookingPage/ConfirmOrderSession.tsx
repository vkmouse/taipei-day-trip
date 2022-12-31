import React from "react";
import {
  Button,
  FlexEnd,
  RowText,
  RowTextBold,
  Section,
  SectionContainer,
} from "./styles";

const ConfirmOrderSession = (props: {
  isValid: boolean;
  message: string;
  price: number;
  onConfirmOrderClick?: () => void;
}) => {
  const { isValid, message, price, onConfirmOrderClick } = props;

  return (
    <Section>
      <SectionContainer>
        <FlexEnd>
          <RowTextBold>總價：新台幣 {price} 元</RowTextBold>
        </FlexEnd>
        <FlexEnd>
          <Button
            style={{ cursor: isValid ? "pointer" : "not-allowed" }}
            disabled={!isValid}
            onClick={onConfirmOrderClick}
          >
            確認訂購並付款
          </Button>
        </FlexEnd>
        <FlexEnd>
          <RowText style={{ color: "red" }}>{message}</RowText>
        </FlexEnd>
      </SectionContainer>
    </Section>
  );
};

export default ConfirmOrderSession;
