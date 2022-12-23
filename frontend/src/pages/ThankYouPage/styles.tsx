import styled from "@emotion/styled";
import { BodyBold, Secondery70 } from "../../utils/CommonStyles";

export const Section = styled.section`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 40px 10px 40px 10px;
  border-top: 1px solid #E8E8E8;
  border-width: 1px;
`;

export const SectionContainer = styled.div`
  max-width: 1000px;
  flex-grow: 1;
`;

export const Title = styled.div`
  flex-grow: 1;
  margin: 0 0 10px 0;
  ${BodyBold}
  font-size: 19px;
  color: ${Secondery70};
`;
