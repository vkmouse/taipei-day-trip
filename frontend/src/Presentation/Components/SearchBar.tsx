import styled from '@emotion/styled';
import React from 'react';
import { Primary } from '../Styles/Colors';
import { BodyBold } from '../Styles/Typography';

const Container = styled.div`
  display: flex;
  height: 46px;
  width: 89%;
  max-width: 460px;
`;

const Input = styled.input`
  ${BodyBold}
  border-radius: 5px 0 0 5px;
  border-width: 0;
  height: 100%;
  flex-grow: 1;
  min-width: 200px;
  padding: 0;
  padding-left: 15px;
  &:focus {
    outline-width: 0;
  }
`;

const Button = styled.button`
  align-items: center;
  background-color: ${Primary};
  border-radius: 0 5px 5px 0;
  border-width: 0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  height: 100%;
  width: 60px;
`;

const SearchBar = () => {
  return (
    <Container>
      <Input placeholder="輸入景點名稱查詢" />
      <Button>
        <img src='search_icon.svg'/>
      </Button>
    </Container>
  );
};

export default SearchBar;
