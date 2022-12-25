import styled from "@emotion/styled";
import { BodyMedium, Secondery, BodyBold } from "../../utils/CommonStyles";

export const Section = styled.section`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 39px 15px 40px 15px;
  border-top: 1px solid #e8e8e8;
  border-width: 1px;
  @media (max-width: 800px) {
    flex-wrap: wrap;
    padding: 0 0 40px 0;
  }
`;

export const Article = styled.article`
  width: 100%;
  max-width: 1180px;
  border-top: 1px solid #e8e8e8;
  padding: 50px 10px 80px 10px;
`;

export const Text = styled.div`
  ${BodyMedium}
  color: ${Secondery};
  line-height: 24px;
`;

export const TextBold = styled.div`
  ${BodyBold}
  color: ${Secondery};
  padding-top: 20px;
  line-height: 28px;
`;
