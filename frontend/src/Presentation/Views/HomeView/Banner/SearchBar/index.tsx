import styled from '@emotion/styled';
import React, { useState } from 'react';
import { setData, setNextPage } from '../../../../../Data/Slices/attractionSlice';
import { setSearchBarText, updateKeyword } from '../../../../../Data/Slices/keywordSlice';
import { useAppDispatch, useAppSelector } from '../../../../../Data/Store/hooks';
import { Primary } from '../../../../Styles/Colors';
import { BodyBold } from '../../../../Styles/Typography';
import CategoryList from './CategoryList';

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const SearchBarContainer = styled.div`
  display: flex;
  width: 89%;
  height: 46px;
  max-width: 460px;
`;

const Input = styled.input`
  ${BodyBold}
  flex-grow: 1;
  height: 100%;
  min-width: 200px;
  padding: 0 0 0 15px;
  border-radius: 5px 0 0 5px;
  border-width: 0;
  &:focus {
    outline-width: 0;
  }
`;

const Button = styled.button`
  display: flex;  
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 100%;
  background-color: ${Primary};
  cursor: pointer;
  border-radius: 0 5px 5px 0;
  border-width: 0;
`;

const SearchBar = () => {
  const [categoryListVisible, setCategoryListVisible] = useState(false);
  const searchBarText = useAppSelector(state => state.keyword.searchBarText);
  const dispatch = useAppDispatch();

  const handleSearchBarClicked = () => {
    dispatch(setNextPage(0));
    dispatch(setData([]));
    dispatch(updateKeyword());
  };

  return (
    <Container>
      <SearchBarContainer>
        <Input 
          placeholder="輸入景點名稱查詢"
          onChange={e => dispatch(setSearchBarText(e.target.value))}
          onFocus={() => setCategoryListVisible(true)}
          onBlur={() => setCategoryListVisible(false)}
          value={searchBarText}
        />
        <Button onClick={() => handleSearchBarClicked()}>
          <img src='search_icon.svg'/>
        </Button>
      </SearchBarContainer>
      <CategoryList visible={categoryListVisible} />
    </Container>
  );
};

export default SearchBar;
