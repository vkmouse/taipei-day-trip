import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { api } from '../../Core/API';
import { Primary } from '../Styles/Colors';
import { BodyBold } from '../Styles/Typography';
import CategoryList from './CategoryList';

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const SearchBarContainer = styled.div`
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

const SearchBar = (props: { 
  onSearchButtonClick?: () => void
  onSearchTextChanged?: (text: string) => void
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryListVisible, setCategoryListVisible] = useState(false);
  const [keyword, setKeyword] = useState('');

  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const onChange = props.onSearchTextChanged ?? (() => void 0);
    const newKeyword = event.target.value;
    setKeyword(newKeyword);
    onChange(newKeyword);
  };

  const handleFocused = () => {
    setCategoryListVisible(true);
  };

  const handleBlur = () => {
    setCategoryListVisible(false);
  };

  const handleSelect = (category: string) => {
    const onChange = props.onSearchTextChanged ?? (() => void 0);
    const newKeyword = category;
    setKeyword(newKeyword);
    onChange(newKeyword);
  };

  const initCategories = async () => {
    const body = await api.getCategories();
    setCategories(body.data);
  };

  useEffect(() => {
    initCategories();
  }, []);

  return (
    <Container>
      <SearchBarContainer>
        <Input 
          placeholder="輸入景點名稱查詢"
          onChange={handleSearchTextChange}
          onFocus={handleFocused}
          onBlur={handleBlur}
          value={keyword}
        />
        <Button onClick={props.onSearchButtonClick}>
          <img src='search_icon.svg'/>
        </Button>
      </SearchBarContainer>
      <CategoryList 
        categories={categories}
        visible={categoryListVisible}
        onSelected={handleSelect}
      />
    </Container>
  );
};

export default SearchBar;
