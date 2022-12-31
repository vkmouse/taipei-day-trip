import React from "react";
import { BodyMediumSecondary70 } from "../../utils/CommonStyles";
import { Section, SectionContainer, Title } from "./styles";

const NoOrdersSession = (props: { name: string }) => {
  const { name } = props;
  return (
    <Section>
      <SectionContainer>
        <Title>您好，{name}，歷史訂單如下：</Title>
        <div style={{ display: "flex", paddingTop: "20px" }}>
          <BodyMediumSecondary70>目前沒有任何訂單</BodyMediumSecondary70>
        </div>
      </SectionContainer>
    </Section>
  );
};

export default NoOrdersSession;
