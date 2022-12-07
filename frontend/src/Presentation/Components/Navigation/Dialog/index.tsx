import styled from '@emotion/styled';
import React from 'react';
import { Primary, Secondery20, Secondery50, Secondery70 } from '../../../Styles/Colors';
import { BodyMedium, H3 } from '../../../Styles/Typography';
import InputEmail from './InputEmail';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const DialogContainer = styled.div`
  z-index: 1;  
  margin-top: 80px;
  width: 340px;
  background: white;
  border-radius: 5px;
`;

const DecoratorBar = styled.div`
  width: 100%;
  height: 10px;
  background: linear-gradient(270deg, #337788 0%, #66AABB 100%);
  border-radius: 5px 5px 0 0;
`;

const Form = styled.div`
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

const InputContainer = styled.div`
  margin: 10px 0;
  padding: 0 32px 0 0;
`;

const Input = styled.input`
  padding: 10px 15px;
  width: 100%;
  ${BodyMedium}
  color: ${Secondery50};
  border: 1px solid #CCCCCC;
  border-radius: 5px;
  &:focus {
    outline: none;
    border: 1px solid ${Primary};
    box-shadow: 0 0 4px ${Primary};
  }
`;

const Button = styled.button`
  padding: 15px;
  margin: 0 0 10px 0;
  width: 100%;
  background-color: ${Primary};
  color: white;
  font-size: 19px;
  line-height: 16px;
  border-radius: 5px;
  border-width: 0;
  cursor: pointer;
  user-select: none;
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Text = styled.div`
  ${BodyMedium}
  color: ${Secondery70};
  user-select: none;
`;

const TextButton = styled(Text)`
  padding: 0 4px 0 4px;
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: ${Secondery20};
  }
`;

const Dialog = () => {
  return (
    <Container>
      <DialogContainer>
        <DecoratorBar />
        <Form>
          <TitleContainer>
            <Title>登入會員帳號</Title>
            <Cancel><CancelIcon /></Cancel>
          </TitleContainer>
          <InputEmail onChange={(v1, v2) => console.log(v1, v2)}/>
          <InputContainer>
            <Input placeholder='輸入密碼'></Input>
          </InputContainer>
          <Button>
            登入帳戶
          </Button>
          <TextContainer>
            <Text>還沒有帳戶？</Text>
            <TextButton>點此註冊</TextButton>
          </TextContainer>
        </Form>
      </DialogContainer>
    </Container>
  );
};

export default Dialog;
