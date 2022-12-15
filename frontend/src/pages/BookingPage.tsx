import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingResponse } from '../api/api';
import InputField from '../components/InputField';
import Navigation from '../components/Navigation';
import { Header, Main, Footer } from '../components/Semantic';
import { useAuthContext } from '../context/AuthContext';
import { BodyBold, BodyMedium, CenterCropped, Primary, Secondery70 } from '../utils/CommonStyles';
import { convertTimeToDate, getShortTimeString } from '../utils/time';

const Section = styled.section`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 40px 10px 40px 10px;
  border-top: 1px solid #E8E8E8;
  border-width: 1px;
`;

const SectionContainer = styled.div`
  max-width: 1000px;
  flex-grow: 1;
`;

const Title = styled.div`
  flex-grow: 1;
  margin: 0 0 10px 0;
  ${BodyBold}
  font-size: 19px;
  color: ${Secondery70};
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const RowText = styled.div`
  margin: 7px 0 7px 0;
  ${BodyMedium}
  color: ${Secondery70};
  min-width: 80px;
`;

const RowBoldText = styled.div`
  margin: 7px 0 7px 0;
  ${BodyBold}
  color: ${Secondery70};
`;

const RowPrimaryText = styled.div`
  margin-bottom: 10px;
  ${BodyBold}
  color: ${Primary};
`;

const Button = styled.button`
  margin: 5px 0 5px 0;
  padding: 10px 20px;
  background-color: ${Primary};
  color: white;
  font-size: 19px;
  line-height: 16px;
  border-radius: 5px;
  border-width: 0;
  cursor: pointer;
`;

const AttractionsInfoContainer = styled.div`
  display: flex;
  padding-top: 20px;
  @media (max-width: 600px) {
    display: block;
  }
`;

const AttractionsImage = styled.img`
  ${CenterCropped}
  width: 260px;
  height: 200px;
  @media (max-width: 600px) {
    width: 100%;
  }
`;

const AttractionsDetail = styled.div`
  padding-left: 25px;
  flex-grow: 1;
  @media (max-width: 600px) {
    padding: 25px 0 0 0;
  }
`;

const AttractionsAction = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const AttractionsActionIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const FlexEnd = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const AttractionsInfo = (props: { bookingResponses: BookingResponse[] }) => {
  const { bookingResponses } = props;

  if (bookingResponses.length === 0) {
    return <>目前沒有任何待預訂的行程</>;
  }
  
  return (
    <>
      {bookingResponses.map((booking, i) => 
        <AttractionsInfoContainer key={i}>
          <AttractionsImage src={booking.attraction.image} />
          <AttractionsDetail>
            <Row><RowPrimaryText>台北一日遊：{booking.attraction.name}</RowPrimaryText></Row>
            <Row>
              <RowBoldText>日期：</RowBoldText>
              <RowText>{convertTimeToDate(booking.starttime)}</RowText>
            </Row>
            <Row>
              <RowBoldText>時間：</RowBoldText>
              <RowText>
                {getShortTimeString(booking.starttime)} 到 {getShortTimeString(booking.endtime)} 
              </RowText>
            </Row>
            <Row>
              <RowBoldText>費用：</RowBoldText>
              <RowText>新台幣 {booking.price} 元</RowText>
            </Row>
            <Row>
              <RowBoldText>地點：</RowBoldText>
              <RowText>臺北市 大安區忠孝東路4段</RowText>
            </Row>
          </AttractionsDetail>
          <AttractionsAction>
            <AttractionsActionIcon src='trash.png'/>
          </AttractionsAction>
        </AttractionsInfoContainer>
      )}
    </>
  );
};

const Input = (props: {
  dangerMessage: string
  placeholder: string
  value: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => {
  return (
    <InputField 
      {...props}
      autoFocus
      style={{ width: '150px', height: '18px' }}
    />
  );
};

const BookingPage = () => {
  const auth = useAuthContext();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [bookingResponses, setBookingResponses] = useState<BookingResponse[]>([]);

  useEffect(() => {
    if (auth.hasInit) {
      if (!auth.isLogin) {
        navigate('/');
      } else {
        auth.getUserInfo(true).then(member => {
          if (member !== null) {
            setName(member.name);
          }
        });
        auth.getBookings(true).then(bookings => {
          setBookingResponses(bookings);
        });
      }
    }
  }, [auth.hasInit]);
  
  return (
    <>
      <Navigation />
      <Header />
      <Main>
        <Section>
          <SectionContainer>
            <Title>您好，{name}，待預定的行程如下：</Title>
            <AttractionsInfo bookingResponses={bookingResponses} />
          </SectionContainer>
        </Section>
        <Section>
          <SectionContainer>
            <Title>您的聯絡資訊</Title>
            <Row>
              <RowText>聯絡姓名：</RowText>
              <Input 
                dangerMessage={''}
                placeholder=''
                value={''}
                onChange={() => void 0}
              />
            </Row>
            <Row>
              <RowText>聯絡信箱：</RowText>
              <Input 
                dangerMessage={''}
                placeholder=''
                value={''}
                onChange={() => void 0}
              />
            </Row>
            <Row>
              <RowText>手機號碼：</RowText>
              <Input 
                dangerMessage={''}
                placeholder=''
                value={''}
                onChange={() => void 0}
              />
            </Row>
            <RowBoldText>請保持手機暢通，準時到達，導覽人員將用手機與您聯繫，務必留下正確的聯絡方式。</RowBoldText>
          </SectionContainer>
        </Section>
        <Section>
          <SectionContainer>
            <Title>信用卡付款資訊</Title>
            <Row>
              <RowText>卡片號碼：</RowText>
              <Input
                dangerMessage={''}
                placeholder='**** **** **** ****'
                value={''}
                onChange={() => void 0}
              />
            </Row>
            <Row>
              <RowText>過期時間：</RowText>
              <Input
                dangerMessage={''}
                placeholder='MM/YY'
                value={''}
                onChange={() => void 0}
              />
            </Row>
            <Row>
              <RowText>驗證密碼：</RowText>
              <Input
                dangerMessage={''}
                placeholder='CVV'
                value={''}
                onChange={() => void 0}
              />
            </Row>
          </SectionContainer>
        </Section>
        <Section>
          <SectionContainer>
            <FlexEnd>
              <RowBoldText>總價：新台幣 
                {bookingResponses.map(m => m.price).reduce((total, price) => total + price, 0)} 
                元
              </RowBoldText>
            </FlexEnd>
            <FlexEnd>
              <Button>確認訂購並付款</Button>
            </FlexEnd>
          </SectionContainer>
        </Section>
      </Main>
      <Footer style={{ flexDirection: 'column' }} />
    </>
  );
};

export default BookingPage;
