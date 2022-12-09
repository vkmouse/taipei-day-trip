import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { useAPIContext } from '../../../../../context/APIContext';
import { setSearchBarText } from '../../../../../Data/Slices/keywordSlice';
import { useAppDispatch } from '../../../../../Data/Store/hooks';
import { Secondery20 } from '../../../../Styles/Colors';
import { CategoryMedium } from '../../../../Styles/Typography';

const Container = styled.div`
  position: absolute;
  top: 46px;
  z-index: 3;
  width: 100%;
  max-width: 400px;
  background-color: white;
  margin-top: 5px;
  box-shadow: 0px 0px 20px #AABBCC;
  border-radius: 5px;
`;

const Items = styled.div`
  ${CategoryMedium}
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-right: 10%;
`;

const Item = styled.div`
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: ${Secondery20};
  }
`;

const Text = styled.div`
  margin: 10px 15px;
  user-select:none;
`;

const CategoryList = (props: { visible: boolean }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const api = useAPIContext();
  
  const getCategories = async () => {
    const body = await api.getCategories();
    setCategories(body.data);
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Container style={{ visibility: props.visible ? 'visible' : 'hidden' }}  >
      <Items>
        {categories.map((p, i) => 
        <Item key={i} onMouseDown={() => dispatch(setSearchBarText(p))}>
          <Text>{p}</Text>
        </Item>)}
      </Items>
    </Container>
  );
};

export default CategoryList;
