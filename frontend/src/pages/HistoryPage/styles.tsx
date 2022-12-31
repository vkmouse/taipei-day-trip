import styled from "@emotion/styled";
import {
  BodyBold,
  BodyMedium,
  Secondery20,
  Secondery70,
} from "../../utils/CommonStyles";

export const Section = styled.section`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 40px 10px 40px 10px;
  border-top: 1px solid #e8e8e8;
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

export const Text = styled.div`
  ${BodyMedium}
  color: ${Secondery70};
`;

export const ClickableRow = styled.div`
  padding: 3px;
  cursor: pointer;
  user-select: none;
  &:hover {
    background-color: ${Secondery20};
  }
`;

export const AttractionsInfoFooter = styled.div`
  padding-bottom: 20px;
`;

export const JustifyBetween = styled.div`
  display: flex;
  justify-content: space-between;
`;
