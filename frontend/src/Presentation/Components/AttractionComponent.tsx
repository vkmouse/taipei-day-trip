import styled from '@emotion/styled';
import React from 'react';
import { Attraction } from '../../Core/Core';
import { Secondery50 } from '../Styles/Colors';
import { CenterCropped } from '../Styles/ImageCropped';
import { AbsoluteBottom, AbsoluteFull, RatioContainer } from '../Styles/Ratio';
import { BodyBold, BodyMedium } from '../Styles/Typography';

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

const AttractionTitle = (props: { children: string } ) => (
  <AttractionTitleContainer>
    <AttractionTitleContent>
      <AttractionTitleOverlay />
      <Title>{props.children}</Title>
    </AttractionTitleContent>
  </AttractionTitleContainer>
);

const Container = styled.div`
  border: 1px solid #E8E8E8;
  border-radius: 5px;
`;

const ImageContainer = styled.div`
  ${RatioContainer};
  width: 100%;
`;

const Image = styled.img`
  ${AbsoluteFull};
  ${CenterCropped};
  width: 100%;
  height: 100%;
  border-radius: 5px 5px 0 0;
`;

const DescriptionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 45px;
`;

const Text = styled.div`
  ${BodyMedium};
  padding: 0 10px 0 10px;
  color: ${Secondery50};
`;

const AttractionComponent = (props: Attraction) => {
  const { name, category, mrt, images } = props;
  return (
    <Container>
      <ImageContainer>
        <Image src={images[0]}></Image>
        <AttractionTitle>{name}</AttractionTitle>
      </ImageContainer>
      <DescriptionContainer>
        <Text>{mrt}</Text>
        <Text>{category}</Text>
      </DescriptionContainer>
    </Container>
  );
};

export default AttractionComponent;
