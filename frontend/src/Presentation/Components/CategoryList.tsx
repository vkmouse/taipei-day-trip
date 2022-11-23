import styled from '@emotion/styled';
import React from 'react';
import { Secondery20 } from '../Styles/Colors';
import { CategoryMedium } from '../Styles/Typography';

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

const CategoryList = (props: { categories: string[], visible: boolean, onSelected?: (category: string) => void }) => {
  const handleSelect = (category: string) => {
    if (props.onSelected !== undefined) {
      props.onSelected(category);
    }
  };

  return (
    <Container style={{ visibility: props.visible ? 'visible' : 'hidden' }}  >
      <Items>
        {props.categories.map((p, i) => 
        <Item key={i} onMouseDown={() => handleSelect(p)}>
          <Text>{p}</Text>
        </Item>)}
      </Items>
    </Container>
  );
};

export default CategoryList;
