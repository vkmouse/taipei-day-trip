import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { useAppSelector } from '../../Data/Store/hooks';
import AttractionComponent from './AttractionComponent';

const Grid = css`
  display: grid;
  row-gap: 30px;
  column-gap: 30px;
  grid-template-columns: repeat(4, 1fr);
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    row-gap: 15px;
    column-gap: 0;
    grid-template-columns: repeat(1, 1fr);
  }
`;

const Container = styled.div`
  ${Grid};
  width: 1170px;
  padding: 15px;
  margin: 40px 4px 40px 4px;
`;

const AttractionListComponent = () => {
  const attractions = useAppSelector(state => state.attraction.data);
  return (
    <Container>
      {attractions.map(p => {
        return <AttractionComponent key={p.id} {...p} />;
      })}
    </Container>
  );
};

export default AttractionListComponent;
