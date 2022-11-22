import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React from 'react';
import { Attraction } from '../../Core/Core';
import AttractionComponent from './AttractionComponent';

const Grid = css`
  display: grid;
  column-gap: 30px;
  row-gap: 30px;
  grid-template-columns: repeat(4, 1fr);

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    column-gap: 0;
    row-gap: 15px;
    grid-template-columns: repeat(1, 1fr);
  }
`;

const Container = styled.div`
  ${Grid};
  margin: 40px 4px 40px 4px;
  padding: 15px;
  width: 1170px;
`;

interface IProps {
  attractions: Attraction[]
}

const AttractionListComponent = (props: IProps) => {
  return (
    <Container>
      {props.attractions.map(p => {
        return <AttractionComponent key={p.id} {...p} />;
      })}
    </Container>
  );
};

export default AttractionListComponent;
