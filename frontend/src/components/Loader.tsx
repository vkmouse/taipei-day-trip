import styled from "@emotion/styled";
import React from "react";
import { BodyMedium, Primary } from "../utils/CommonStyles";

const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100px;
  height: 100px;
`;

const DualRing = styled.div`
  display: inline-block;
  position: absolute;
  width: 80px;
  height: 80px;
  margin-right: 12px;
  margin-bottom: 12px;

  &:after {
    content: " ";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid ${Primary};
    border-color: ${Primary} transparent ${Primary} transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }

  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Percentage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100px;
  height: 100px;
  ${BodyMedium}
  color: ${Primary};
`;

const Loader = (props: { percent: number }) => {
  const { percent } = props;
  return (
    <LoaderContainer>
      <DualRing />
      <Percentage>{Math.round(percent * 100)}%</Percentage>
    </LoaderContainer>
  );
};

export default Loader;
