import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../Data/Store/hooks';
import { Secondery50 } from '../Presentation/Styles/Colors';
import { CenterCropped } from '../Presentation/Styles/ImageCropped';
import { AbsoluteBottom, AbsoluteFull, RatioContainer } from '../Presentation/Styles/Ratio';
import { BodyBold, BodyMedium } from '../Presentation/Styles/Typography';

const Grid = css`
  display: grid;
  row-gap: 30px;
  column-gap: 30px;
  grid-template-columns: repeat(4, 1fr);
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    row-gap: 15px;
    column-gap: 0;
    grid-template-columns: repeat(1, 1fr);
  }
`;

const AttractionsListContainer  = styled.div`
  ${Grid};
  width: 1170px;
  padding: 15px;
  margin: 40px 4px 40px 4px;
`;

const AttractionTitleContainer = styled.div`
  ${AbsoluteBottom}
`;

const AttractionTitleContent = styled.div`
  position: relative;
  height: 40px;
`;

const AttractionTitleOverlay = styled.div`
  ${AbsoluteFull}
  display: flex;
  align-items: center;
  z-index: 1;
  background: black;
  opacity: 0.6;
`;

const Title = styled.div`
  ${AbsoluteFull}
  ${BodyBold};
  display: flex;
  align-items: center;
  z-index: 2;
  padding: 0 10px 0 10px;
  color: white;
`;

const AttractionCardContainer = styled(Link)`
  border: 1px solid #E8E8E8;
  border-radius: 5px;
  text-decoration: none;
`;

const AttractionImageContainer = styled.div`
  ${RatioContainer};
  width: 100%;
`;

const AttractionImage = styled.img`
  ${AbsoluteFull};
  ${CenterCropped};
  width: 100%;
  height: 100%;
  border-radius: 5px 5px 0 0;
`;

const AttractionDescriptionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 45px;
`;

const AttractionDescription = styled.div`
  ${BodyMedium};
  padding: 0 10px 0 10px;
  color: ${Secondery50};
`;

const AttractionsList = () => {
  const attractions = useAppSelector(state => state.attraction.data);
  return (
    <AttractionsListContainer>
      {attractions.map((p, i) => 
        <AttractionCardContainer to={`/attraction/${p.id}`} key={i}>
          <AttractionImageContainer>
            <AttractionImage src={p.images[0]}></AttractionImage>
            <AttractionTitleContainer>
              <AttractionTitleContent>
                <AttractionTitleOverlay />
                <Title>{p.name}</Title>
              </AttractionTitleContent>
            </AttractionTitleContainer>
          </AttractionImageContainer>
          <AttractionDescriptionContainer>
            <AttractionDescription>{p.mrt}</AttractionDescription>
            <AttractionDescription>{p.category}</AttractionDescription>
          </AttractionDescriptionContainer>
        </AttractionCardContainer>
      )}
    </AttractionsListContainer>
  );
};

export default AttractionsList;
