import styled from "@emotion/styled";
import { BodyBold, Secondery70, BodyMedium, Primary, Secondery20, CenterCropped } from "../../utils/CommonStyles";

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

export const Row = styled.div`
  display: flex;
  align-items: center;
`;

export const RowText = styled.div`
  margin: 7px 0 7px 0;
  ${BodyMedium}
  color: ${Secondery70};
  min-width: 80px;
`;

export const RowTextBold = styled.div`
  margin: 7px 0 7px 0;
  ${BodyBold}
  color: ${Secondery70};
`;

export const PrimaryRowText = styled.div`
  margin-bottom: 10px;
  ${BodyBold}
  color: ${Primary};
`;

export const Button = styled.button`
  margin: 5px 0 5px 0;
  padding: 10px 20px;
  background-color: ${Primary};
  color: white;
  font-size: 19px;
  line-height: 16px;
  border-radius: 5px;
  border-width: 0;
  cursor: pointer;
  &:disabled {
    background-color: ${Secondery20};
    color: ${Secondery70};
  }
`;

export const AttractionsInfoContainer = styled.div`
  display: flex;
  padding-top: 20px;
  @media (max-width: 600px) {
    display: block;
  }
`;

export const AttractionsImage = styled.img`
  ${CenterCropped}
  width: 260px;
  height: 200px;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const AttractionsDetail = styled.div`
  padding-left: 25px;
  flex-grow: 1;
  @media (max-width: 600px) {
    padding: 25px 0 0 0;
  }
`;

export const AttractionsAction = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const AttractionsActionIcon = styled.img`
  width: 30px;
  height: 30px;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: ${Secondery20}
  }
`;

export const FlexEnd = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const TapPayInput = styled.div`
  margin: 10px 0;
  padding: 10px 15px;
  width: 200px;
  height: 18px;
  ${BodyMedium}
  border: 1px solid #CCCCCC;
  border-radius: 5px;
`;
