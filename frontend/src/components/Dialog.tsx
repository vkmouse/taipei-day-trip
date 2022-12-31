import styled from "@emotion/styled";
import React from "react";
import { H3, Secondery70, Secondery20 } from "../utils/CommonStyles";

const FullPage = styled.div`
  position: fixed;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
`;

const Modal = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const ModalOverlay = styled.div`
  position: absolute;
  background: black;
  opacity: 0.25;
  width: 100%;
  height: 100%;
`;

const ModalContent = styled.div`
  display: flex;
  justify-content: center;
`;

const ModalBody = styled.div`
  z-index: 1;
  margin-top: 80px;
  width: 340px;
  background: white;
  border-radius: 5px;
`;

const DecoratorBar = styled.div`
  width: 100%;
  height: 10px;
  background: linear-gradient(270deg, #337788 0%, #66aabb 100%);
  border-radius: 5px 5px 0 0;
`;

const Form = styled.form`
  padding: 15px;
`;

const TitleContainer = styled.div`
  display: flex;
`;

const Title = styled.div`
  ${H3}
  text-align: center;
  color: ${Secondery70};
  flex-grow: 1;
  margin-left: 24px;
  user-select: none;
`;

const Cancel = styled.div`
  padding: 4px;
  width: 16px;
  height: 16px;
  cursor: pointer;
  user-select: none;
  border-radius: 5px;
  &:hover {
    background-color: ${Secondery20};
  }
`;

const CancelIcon = styled.img`
  content: url("/cancel.png");
  width: 16px;
  height: 16px;
`;
const Dialog = (props: {
  title: string;
  children: JSX.Element | JSX.Element[];
  hide?: () => void;
}) => {
  const { title, children, hide } = props;
  return (
    <FullPage>
      <Modal>
        <ModalOverlay onClick={hide} />
        <ModalContent>
          <ModalBody>
            <DecoratorBar />
            <Form onSubmit={(e) => e.preventDefault()}>
              <TitleContainer>
                <Title>{title}</Title>
                <Cancel onClick={hide}>
                  <CancelIcon />
                </Cancel>
              </TitleContainer>
              {children}
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </FullPage>
  );
};

export default Dialog;
