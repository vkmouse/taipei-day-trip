import React from "react";
import {
  CopyIcon,
  Section,
  SectionContainer,
  Title,
  Row,
  RowText,
  TapPayInput,
  CopyButton,
} from "./styles";

const PaymentSession = () => {
  return (
    <Section>
      <SectionContainer>
        <Title>信用卡付款資訊</Title>
        <Row>
          <RowText>卡片號碼：</RowText>
          <TapPayInput id="tp-card-number" />
          <CopyButton
            onClick={() => navigator.clipboard.writeText("4242424242424242")}
          >
            <CopyIcon src="copy-icon.svg" />
          </CopyButton>
        </Row>
        <Row>
          <RowText>過期時間：</RowText>
          <TapPayInput id="tp-expiration-date" />
          <CopyButton onClick={() => navigator.clipboard.writeText("0128")}>
            <CopyIcon src="copy-icon.svg" />
          </CopyButton>
        </Row>
        <Row>
          <RowText>驗證密碼：</RowText>
          <TapPayInput id="tp-ccv" />
          <CopyButton onClick={() => navigator.clipboard.writeText("123")}>
            <CopyIcon src="copy-icon.svg" />
          </CopyButton>
        </Row>
      </SectionContainer>
    </Section>
  );
};

export default PaymentSession;
