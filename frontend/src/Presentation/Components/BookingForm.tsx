import styled from '@emotion/styled';
import React, { useRef, useState } from 'react';
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

const Form = styled.div`
  padding: 0 20px 0 20px;
  flex-grow: 1;
  background-color: ${Secondery20};
  border-radius: 5px;
  color: ${Secondery70}
`;

const RowTitle = styled.span`
  padding-right: 6px;
`;

const InputDate = styled.input`
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
  cursor: pointer;
`;

const TextMedium = styled.div`
  ${BodyMedium}
`;

const getDay = (offsetDay: number) => {
  const dayMilli = 1000 * 60 * 60 * 24;
  const date = new Date(new Date().getTime() + (offsetDay * dayMilli));
  const year = date.getFullYear();
  
  let month: number | string = date.getMonth() + 1;
  let day: number | string = date.getDate();
  
  if (month < 10) month = '0' + month;
  if (day < 10) day = '0' + day;
  
  return `${year}-${month}-${day}`;
};

const BookingForm = (props: { attraction?: Attraction }) => {
  if (props.attraction === undefined) {
    return (
      <Container style={{ backgroundColor: Secondery20 }}>
        <Title style={{ backgroundColor: Secondery50 }}>&nbsp;</Title>
        <SubTitle style={{ backgroundColor: Secondery50 }}>&nbsp;</SubTitle>
      </Container>
    );
  }

  const { id, name, category, mrt } = props.attraction;
  const [price, setPrice] = useState(2000);
  const [date, setDate] = useState(getDay(1));
  const timeRef = useRef('morning');
  
  const handleRadioChanged = (val: string) => {
    if (val === 'morning') {
      timeRef.current = 'morning';
      setPrice(2000);
    } else if (val === 'afternoon') {
      timeRef.current = 'afternoon';
      setPrice(2500);
    }
  };

  const startBooking = () => {
    const out = {
      attractionId: id,
      date: date,
      time: timeRef.current,
      price: price
    };
    console.log(out);
  };

  return (
    <Container>
      <Title>{name}</Title>
      <SubTitle>{mrt ? `${category} at ${mrt}` : category}</SubTitle>
      <Form>
        <BoldRow>訂購導覽行程</BoldRow>
        <Row>以此景點為中心的一日行程，帶您探索城市角落故事</Row>
        <BoldRow>
          <RowTitle>選擇日期：</RowTitle>
          <InputDate
            type='date'
            min={getDay(1)}
            max={getDay(90)}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </BoldRow>
        <BoldRow>
          <RowTitle>選擇時間：</RowTitle>
          <RadioGroup onChanged={handleRadioChanged}>
            <Radio value='morning' label='上半天' />
            <Radio value='afternoon' label='下半天' />
          </RadioGroup>
        </BoldRow>
        <BoldRow>
          <RowTitle>導覽費用：</RowTitle>
          <TextMedium>新台幣 {price} 元</TextMedium>
        </BoldRow>
        <Button onClick={startBooking}>開始預約行程</Button>
      </Form>
    </Container>
  );
};

export default BookingForm;
