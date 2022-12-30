import React from "react";
import { BodyMediumSecondary70 } from "../../utils/CommonStyles";
import { Section, SectionContainer, Title } from "./styles";

const NoAttractionSession = (props: { name: string }) => {
  const { name } = props;
  return (
    <Section>
      <SectionContainer>
        <Title>您好，{name}，待預定的行程如下：</Title>
        <div style={{ display: "flex", paddingTop: "20px" }}>
          <BodyMediumSecondary70>
            目前沒有任何待預訂的行程
          </BodyMediumSecondary70>
        </div>
      </SectionContainer>
    </Section>
  );
};

export default NoAttractionSession;
