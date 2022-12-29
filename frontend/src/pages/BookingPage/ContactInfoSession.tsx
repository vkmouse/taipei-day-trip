import React from "react";
import InputField from "../../components/InputField";
import {
  Section,
  SectionContainer,
  Title,
  Row,
  RowText,
  RowTextBold,
} from "./styles";

const Input = (props: {
  dangerMessage: string;
  placeholder: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <InputField
      {...props}
      autoFocus
      style={{ width: "200px", height: "18px" }}
    />
  );
};

const ContactInfoSession = (props: {
  contactNameValid: boolean;
  contactEmailValid: boolean;
  contactPhoneValid: boolean;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  onContactNameChange: (value: string) => void;
  onContactEmailChange: (value: string) => void;
  onContactPhoneChange: (value: string) => void;
}) => {
  const {
    contactNameValid,
    contactEmailValid,
    contactPhoneValid,
    contactName,
    contactEmail,
    contactPhone,
    onContactNameChange,
    onContactEmailChange,
    onContactPhoneChange,
  } = props;
  return (
    <Section>
      <SectionContainer>
        <Title>您的聯絡資訊</Title>
        <Row>
          <RowText>聯絡姓名：</RowText>
          <Input
            dangerMessage={contactNameValid ? "" : "⚠ 請輸入 1 ~ 20 個字元"}
            placeholder=""
            value={contactName}
            onChange={(e) => onContactNameChange(e.target.value)}
          />
        </Row>
        <Row>
          <RowText>聯絡信箱：</RowText>
          <Input
            dangerMessage={contactEmailValid ? "" : "⚠ 請輸入正確的電子郵件"}
            placeholder=""
            value={contactEmail}
            onChange={(e) => onContactEmailChange(e.target.value)}
          />
        </Row>
        <Row>
          <RowText>手機號碼：</RowText>
          <Input
            dangerMessage={contactPhoneValid ? "" : "⚠ 請輸入正確的手機號碼"}
            placeholder=""
            value={contactPhone}
            onChange={(e) => onContactPhoneChange(e.target.value)}
          />
        </Row>
        <RowTextBold>
          請保持手機暢通，準時到達，導覽人員將用手機與您聯繫，務必留下正確的聯絡方式。
        </RowTextBold>
      </SectionContainer>
    </Section>
  );
};

export default ContactInfoSession;
