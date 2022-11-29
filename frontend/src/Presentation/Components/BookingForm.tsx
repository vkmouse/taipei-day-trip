import styled from '@emotion/styled';
import React from 'react';
import { Attraction } from '../../Core/Core';
import { Primary, Secondery20, Secondery50, Secondery70 } from '../Styles/Colors';
import { BodyBold, BodyMedium, H3 } from '../Styles/Typography';
import { Radio, RadioGroup } from './RadioButton';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 400px;
  max-width: 600px;
  margin: 0 15px 0 15px;
  @media (max-width: 800px) {
    height: 390px;
  }
`;

const Title = styled.div`
  ${H3}
  color: ${Secondery70};
`;

const SubTitle = styled.div`
  ${BodyMedium}
  color: ${Secondery70};
  margin: 15px 0 20px 0;
`;

const Row = styled.div`
  ${BodyMedium}
  padding-top: 15px;
`;

const BoldRow = styled(Row)`
  display: flex;
  align-items: center;
  ${BodyBold}
  padding-top: 15px;
`;

const Form = styled.form`
  padding: 0 20px 0 20px;
  flex-grow: 1;
  background-color: ${Secondery20};
  border-radius: 5px;
  color: ${Secondery70}
`;

const RowTitle = styled.span`
  padding-right: 6px;
`;

const Date = styled.input`
  position: relative;
  padding: 10px;
  width: 173px;
  height: 15px;
  border-width: 0;
  ${BodyMedium}
  color: black;
  ::-webkit-calendar-picker-indicator {
    position: absolute;
    background-image: url(/icon_calendar.png);
    background-position: 80px;
    cursor: pointer;
    width: 100px;
    height: 24px;
    left: 77px;
  }
`;

const Button = styled.button`
  margin: 25px 0 0 0;
  padding: 10px 20px;
  background-color: ${Primary};
  color: white;
  font-size: 19px;
  line-height: 16px;
  border-radius: 5px;
  border-width: 0;
`;

const BookingForm = (props: { attraction?: Attraction }) => {
  if (props.attraction === undefined) {
    return (
      <Container style={{ backgroundColor: Secondery20 }}>
        <Title style={{ backgroundColor: Secondery50 }}>&nbsp;</Title>
        <SubTitle style={{ backgroundColor: Secondery50 }}>&nbsp;</SubTitle>
      </Container>
    );
  }

  const { name, category, mrt } = props.attraction;

  return (
    <Container>
      <Title>{name}</Title>
      <SubTitle>{mrt ? `${category} at ${mrt}` : category}</SubTitle>
      <Form>
        <BoldRow>訂購導覽行程</BoldRow>
        <Row>以此景點為中心的一日行程，帶您探索城市角落故事</Row>
        <BoldRow>
          <RowTitle>選擇日期：</RowTitle>
          <Date type='date' />
        </BoldRow>
        <BoldRow>
          <RowTitle>選擇時間：</RowTitle>
          <RadioGroup onChanged={(val) => console.log(val)}>
            <Radio value='am' label='上半天' />
            <Radio value='pm' label='下半天' />
          </RadioGroup>
        </BoldRow>
        <BoldRow>導覽費用：</BoldRow>
        <Button>開始預約行程</Button>
      </Form>
    </Container>
  );
};

export default BookingForm;
