import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useState } from 'react';
import { Attraction } from '../Core/Core';
import { Secondery20 } from '../Presentation/Styles/Colors';
import { CenterCropped } from '../Presentation/Styles/ImageCropped';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  max-width: 540px;
  margin: 0 15px 0 15px;
  @media (max-width: 800px) {
    height: 350px;
    max-width: 600px;
    margin: 0 0 20px 0;
  }
`;

const bounce = keyframes`
  0% {
    opacity: 0.0;
  }
  100% {
    opacity: 1.0;
  }
`;

const Image = styled.img`
  ${CenterCropped}
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  animation: ${bounce} 1s;
  @media (max-width: 540px) {
    border-radius: 0;
  }
`;

const ControlPanelContainer = styled.div`
  display: flex;
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  opacity: 0.75;
`;

const ControlPanel = styled.div`
  display: grid;
  flex-grow: 1;
  grid-template-columns: 36px 1fr 36px;
  padding: 10px;
`;

const ArrowContainer = styled.div`
  display: flex;
  align-items: center;
  user-select: none;
  cursor: pointer;
`;

const LeftArrow = styled.img`
  content: url('/left_arrow.svg');
  user-select: none;
`;

const RightArrow = styled.img`
  content: url('/right_arrow.svg');
  user-select: none;
`;

const DotContainer = styled.div`
  display: flex;
  align-items: end;
  justify-content: center;
  flex-grow: 1;
`;

const DotStyle = css`
  display: inline-block;
  margin: 0 6px 0 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid;
`;

const Dot = styled.div`
  ${DotStyle}
  background-color: white;
  border-color: white;
  cursor: pointer;
`;

const SelectedDot = styled.div`
  ${DotStyle}
  background-color: black;
  border-color: white;
  cursor: pointer;
`;

const Carousel = (props: { attraction?: Attraction }) => {
  if (props.attraction === undefined) {
    return <Container style={{ backgroundColor: Secondery20 }} />;
  }

  const { images } = props.attraction;
  const length = images.length;
  const [selectedImage, setSelectedImage] = useState(0);

  const getList = () => {
    const list = Array(length).fill(false);
    list[selectedImage] = true;
    return list;
  };

  return (
    <Container>
      {getList().map((selected, i) => 
        <Image 
          key={i} 
          src={images[i]}
          style={{display: selected ? 'block' : 'none'}}
        >
        </Image>
      )}
      <ControlPanelContainer>
        <ControlPanel>
          <ArrowContainer onClick={() => setSelectedImage((length + selectedImage - 1) % length)}>
            <LeftArrow />
          </ArrowContainer>
          <DotContainer>
            {getList().map((selected, i) => 
              selected ? <SelectedDot key={i} /> : <Dot key={i} onClick={() => setSelectedImage(i)} />
            )}
          </DotContainer>
          <ArrowContainer onClick={() => setSelectedImage((selectedImage + 1) % length)}>
            <RightArrow />
          </ArrowContainer>
        </ControlPanel>
      </ControlPanelContainer>
    </Container>
  );
};

export default Carousel;
