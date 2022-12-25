import styled from "@emotion/styled";
import React, { useState, useEffect } from "react";
import { useAPIContext } from "../context/APIContext";
import {
  BodyBold,
  Primary,
  CategoryMedium,
  Secondery20,
} from "../utils/CommonStyles";

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInputContainer = styled.div`
  display: flex;
  width: 89%;
  height: 46px;
  max-width: 460px;
`;

const SearchInput = styled.input`
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

const SearchButton = styled.button`
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

const CategoryList = styled.div`
  position: absolute;
  top: 46px;
  z-index: 3;
  width: 100%;
  max-width: 400px;
  background-color: white;
  margin-top: 5px;
  box-shadow: 0px 0px 20px #aabbcc;
  border-radius: 5px;
`;

const CategoryItems = styled.div`
  ${CategoryMedium}
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-right: 10%;
`;

const CategoryItem = styled.div`
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: ${Secondery20};
  }
`;

const CategoryName = styled.div`
  margin: 10px 15px;
  user-select: none;
`;

const SearchCategoryList = (props: {
  visible: boolean;
  onCategoryItemClick?: (text: string) => void;
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const { visible, onCategoryItemClick } = props;
  const api = useAPIContext();

  const getCategories = async () => {
    const body = await api.getCategories();
    setCategories(body.data);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <CategoryList style={{ visibility: visible ? "visible" : "hidden" }}>
      <CategoryItems>
        {categories.map((p, i) => (
          <CategoryItem key={i} onMouseDown={() => onCategoryItemClick?.(p)}>
            <CategoryName>{p}</CategoryName>
          </CategoryItem>
        ))}
      </CategoryItems>
    </CategoryList>
  );
};

const SearchBar = (props: {
  searchInputText: string;
  onSearchButtonClick?: () => void;
  onSearchInputTextChanged?: (text: string) => void;
}) => {
  const [categoryListVisible, setCategoryListVisible] = useState(false);
  const { searchInputText, onSearchButtonClick, onSearchInputTextChanged } =
    props;

  return (
    <SearchContainer>
      <SearchInputContainer>
        <SearchInput
          placeholder="輸入景點名稱查詢"
          onChange={(e) => onSearchInputTextChanged?.(e.target.value)}
          onFocus={() => setCategoryListVisible(true)}
          onBlur={() => setCategoryListVisible(false)}
          value={searchInputText}
        />
        <SearchButton onClick={onSearchButtonClick}>
          <img src="search_icon.svg" />
        </SearchButton>
      </SearchInputContainer>
      <SearchCategoryList
        visible={categoryListVisible}
        onCategoryItemClick={(text) => onSearchInputTextChanged?.(text)}
      />
    </SearchContainer>
  );
};

export default SearchBar;
