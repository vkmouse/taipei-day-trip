import styled from '@emotion/styled';
import React from 'react';
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
  align-items: center;
  background: black;
  display: flex;
  opacity: 0.6;
  z-index: 1;
`;

const Title = styled.div`
  ${AbsoluteFull}
  ${BodyBold};
  align-items: center;
  color: white;
  display: flex;
  padding: 0 10px 0 10px;
  z-index: 2;
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
  align-items: center;
  display: flex;
  height: 45px;
  justify-content: space-between;
  width: 100%;
`;

const Text = styled.div`
  ${BodyMedium};
  color: ${Secondery50};
  padding: 0 10px 0 10px;
`;

const AttractionComponent = () => {
  const imgUrl = "https://www.travel.taipei/content/images/attractions/221371/1024x768_attractions-image-jyms0r6aquqilooahyiw8w.jpg";
  const name = '樹河';
  const mrt = '忠孝復興';
  const category = '公共藝術';
  return (
    <Container>
      <ImageContainer>
        <Image src={imgUrl}></Image>
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
