import React from "react";
import {
  Section,
  SectionContainer,
  Title,
  Row,
  RowText,
  TapPayInput,
} from "./styles";

const PaymentSession = () => {
  return (
    <Section>
      <SectionContainer>
        <Title>信用卡付款資訊</Title>
        <Row>
          <RowText>卡片號碼：</RowText>
          <TapPayInput id="tp-card-number" />
        </Row>
        <Row>
          <RowText>過期時間：</RowText>
          <TapPayInput id="tp-expiration-date" />
        </Row>
        <Row>
          <RowText>驗證密碼：</RowText>
          <TapPayInput id="tp-ccv" />
        </Row>
      </SectionContainer>
    </Section>
  );
};

export default PaymentSession;
