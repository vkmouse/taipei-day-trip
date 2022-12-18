import styled from '@emotion/styled';
import React, { useState, useRef } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useLoginRegisterContext } from '../context/LoginRegisterContext';
import { Attraction } from '../types/AttractionTypes';
import { Booking } from '../types/BookingTypes';
import { H3, Secondery70, BodyMedium, BodyBold, Secondery20, Primary } from '../utils/CommonStyles';
import { convertTimeToDate, getNextDate, parseDateString } from '../utils/time';
import Calendar from './Calendar';
import { RadioGroup, Radio } from './RadioButton';

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
  display: flex;
  align-items: center;
  padding-top: 15px;
  ${BodyMedium}
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding-top: 15px;
  ${BodyMedium}
`;

const Bold = styled.div`
  ${BodyBold}
`;

const RowTitle = styled(Bold)`
  padding-right: 6px;
`;

const Form = styled.div`
  padding: 0 20px 20px 20px;
  flex-grow: 1;
  background-color: ${Secondery20};
  border-radius: 5px;
  color: ${Secondery70}
`;

const Button = styled.button`
  margin: 5px 10px 5px 0;
  padding: 10px 20px;
  background-color: ${Primary};
  color: white;
  font-size: 19px;
  line-height: 16px;
  border-radius: 5px;
  border-width: 0;
  cursor: pointer;
`;

const BookingForm = (props: { attraction?: Attraction }) => {
  if (props.attraction === undefined) {
    return (
      <Container>
        <Title style={{ backgroundColor: Secondery20 }}>&nbsp;</Title>
        <SubTitle style={{ backgroundColor: Secondery20 }}>&nbsp;</SubTitle>
        <Form />
      </Container>
    );
  }

  const { id, name, category, mrt } = props.attraction;
  const [price, setPrice] = useState(2000);
  const [date, setDate] = useState(getNextDate(1));
  const [bookingStatus, setBookingStatus] = useState('');
  const timeRef = useRef('morning');
  const auth = useAuthContext();
  const { show } = useLoginRegisterContext();
  
  const handleRadioChanged = (val: string) => {
    timeRef.current = val;
    if (val === 'morning') {
      setPrice(2000);
    } else if (val === 'afternoon') {
      setPrice(2500);
    }
  };

  const startBooking = async () => {
    setBookingStatus('預約中 ...');
    const starttime = new Date(date);
    const endtime = new Date(date);
    if (timeRef.current === 'morning') {
      starttime.setHours(date.getHours() + 8);
      endtime.setHours(date.getHours() + 12);
    } else if (timeRef.current === 'afternoon') {
      starttime.setHours(date.getHours() + 14);
      endtime.setHours(date.getHours() + 18);
    }
    const booking: Booking = {
      attractionId: id,
      starttime: starttime,
      endtime: endtime,
      price: price
    };
    const success = await auth.addBooking(true, booking);
    if (success) {
      setBookingStatus('✔ 預約成功，前往預定行程查看');
    } else {
      setBookingStatus('✘ 已預約該時段，預約失敗');
    }
  };

  return (
    <Container>
      <Title>{name}</Title>
      <SubTitle>{mrt ? `${category} at ${mrt}` : category}</SubTitle>
      <Form>
        <Row><Bold>訂購導覽行程</Bold></Row>
        <Row>以此景點為中心的一日行程，帶您探索城市角落故事</Row>
        <Row>
          <RowTitle>選擇日期：</RowTitle>
          <Calendar
            min={convertTimeToDate(getNextDate(1))}
            max={convertTimeToDate(getNextDate(90))}
            value={convertTimeToDate(date)}
            onChange={value => setDate(parseDateString(value))}
          />
        </Row>
        <Row>
          <RowTitle>選擇時間：</RowTitle>
          <RadioGroup onChanged={handleRadioChanged}>
            <Radio value='morning' label='上半天' />
            <Radio value='afternoon' label='下半天' />
          </RadioGroup>
        </Row>
        <Row>
          <RowTitle>導覽費用：</RowTitle>
          新台幣 {price} 元
        </Row>
        <FlexRow>
          <Button onClick={ auth.isLogin ? startBooking : show }>開始預約行程</Button>
          {bookingStatus}
        </FlexRow>
      </Form>
    </Container>
  );
};

export default BookingForm;
