import styled from "@emotion/styled";
import { H1, Secondery10, BodyBold } from "../../utils/CommonStyles";

export const AttractionsNotFound = styled.img`
  width: 100%;
  height: 100%;
  max-width: 600px;
  content: url('attraction_not_found.png');
`;

export const Loading = styled.img`
  content: url('loading.gif');
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-basis: 100%;
`;

export const BannerContainer = styled.div`
  display: flex;  
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 320px;
  background: url('welcome.png');
  background-size: cover;
`;

export const BannerContent = styled.div`
  width: 1180px;
  height: 149px;
  margin: 0 10px 0 10px;
  padding: 10px;
`;

export const BannerContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const BannerSlogan = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 78px;
`;

export const BannerTitle = styled.div`
  ${H1};
  display: flex;
  align-items: center;
  color: ${Secondery10};
`;

export const BannerDescription = styled.span`
  ${BodyBold};
  display: flex;
  align-items: end;
  flex-grow: 1;
  color: ${Secondery10};
`;

export const SearchBarContainer = styled.div`
  display: flex;
  flex-grow: 1;  
  align-items: end;
`;
