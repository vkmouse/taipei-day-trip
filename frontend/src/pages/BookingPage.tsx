import styled from '@emotion/styled';
import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import Navigation from '../components/Navigation';
import { Header, Main, Footer } from '../components/Semantic';
import { useAuthContext } from '../context/AuthContext';
import { BookingResponse } from '../types/BookingTypes';
import { BodyBold, BodyMedium, CenterCropped, Primary, Secondery20, Secondery70 } from '../utils/CommonStyles';
import { convertTimeToDate, getShortTimeString } from '../utils/time';
import { validateCardExpiration, validateEmail, validateName, validateNumberOnly, validatePhone } from '../utils/validate';

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
  &:disabled {
    background-color: ${Secondery20};
    color: ${Secondery70};
  }
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
  cursor: pointer;
  border-radius: 5px;
  &:hover {
    background-color: ${Secondery20}
  }
`;

const FlexEnd = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const AttractionsInfo = (props: { 
  bookingResponses: BookingResponse[],
  onDeleteClick?: (bookingId: number) => void
}) => {
  const { bookingResponses, onDeleteClick } = props;

  if (bookingResponses.length === 0) {
    return (
      <AttractionsInfoContainer>
        <RowText>目前沒有任何待預訂的行程</RowText>
      </AttractionsInfoContainer>
    );
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
            <AttractionsActionIcon src='trash.png' onClick={() => onDeleteClick?.(booking.bookingId)}/>
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
      style={{ width: '200px', height: '18px' }}
    />
  );
};

type State = {
  contactName: string
  contactNameValid: boolean
  contactEmail: string
  contactEmailValid: boolean
  contactPhone: string
  contactPhoneDisplay: string,
  contactPhoneValid: boolean
  cardNumber: string
  cardNumberDisplay: string
  cardNumberValid: boolean
  cardExpiration: string
  cardExpirationDisplay: string
  cardExpirationValid: boolean
  cardVerificationCode: string
  cardVerificationCodeValid: boolean
  isValid: boolean
}

type Action = 
  | { type: 'SET_CONTACT_NAME', payload: string }
  | { type: 'SET_CONTACT_EMAIL', payload: string }
  | { type: 'SET_CONTACT_PHONE', payload: string }
  | { type: 'SET_CARD_NUMBER', payload: string }
  | { type: 'SET_CARD_EXPIRATION', payload: string }
  | { type: 'SET_CARD_VERIFICATION_CODE', payload: string };
const setContactName = (value: string): Action => { return { type: 'SET_CONTACT_NAME', payload: value }; };
const setContactEmail = (value: string): Action => { return { type: 'SET_CONTACT_EMAIL', payload: value }; };
const setContactPhone = (value: string): Action => { return { type: 'SET_CONTACT_PHONE', payload: value }; };
const setCardNumber = (value: string): Action => { return { type: 'SET_CARD_NUMBER', payload: value }; };
const setCardExpiration = (value: string): Action => { return { type: 'SET_CARD_EXPIRATION', payload: value }; };
const setCardVerificationCode = (value: string): Action => { return { type: 'SET_CARD_VERIFICATION_CODE', payload: value }; };

const initialState: State = {
  contactName: '',
  contactNameValid: false,
  contactEmail: '',
  contactEmailValid: false,
  contactPhone: '',
  contactPhoneDisplay: '',
  contactPhoneValid: false,
  cardNumber: '',
  cardNumberDisplay: '',
  cardNumberValid: false,
  cardExpiration: '',
  cardExpirationDisplay: '',
  cardExpirationValid: false,
  cardVerificationCode: '',
  cardVerificationCodeValid: false,
  isValid: false,
};

const reducer = (state: State, action: Action): State => {
  const checkValid = (state: State) => {
    return (
      state.contactNameValid &&
      state.contactEmailValid &&
      state.contactPhoneValid &&
      state.cardNumberValid &&
      state.cardExpirationValid &&
      state.cardVerificationCodeValid
    );
  };
  switch (action.type) {
    case 'SET_CONTACT_NAME': {
      const contactName = action.payload;
      const contactNameValid = validateName(contactName);
      const isValid = checkValid({ ...state, contactNameValid });
      return { ...state, contactName, contactNameValid, isValid };
    }
    case 'SET_CONTACT_EMAIL': {
      const contactEmail = action.payload;
      const contactEmailValid = validateEmail(contactEmail);
      const isValid = checkValid({ ...state, contactEmailValid });
      return { ...state, contactEmail, contactEmailValid, isValid };
    }
    case 'SET_CONTACT_PHONE': {
      const contactPhone = action.payload.replace(/\D/g, '').substring(0, 10);
      const contactPhoneDisplay = contactPhone
        .replace(/^(09[\d]{2})(\d{3})(\d{0,3})$/g, '$1-$2-$3')
        .replace(/^(09[\d]{2})(\d{0,3})$/g, '$1-$2')
        .replace(/-$/, '');
      const contactPhoneValid = validatePhone(contactPhone);
      const isValid = checkValid({ ...state, contactPhoneValid });
      return { ...state, contactPhone, contactPhoneDisplay, contactPhoneValid, isValid };
    }
    case 'SET_CARD_NUMBER': {
      const cardNumber = action.payload.replace(/\D/g, '').substring(0, 16);
      const cardNumberDisplay = cardNumber.replace(/(\d{4})/g, '$1 ').trim();
      const cardNumberValid = validateNumberOnly(cardNumber, 16);
      const isValid = checkValid({ ...state, cardNumberValid });
      return { ...state, cardNumber, cardNumberDisplay, cardNumberValid, isValid };
    }
    case 'SET_CARD_EXPIRATION': {
      const cardExpiration = action.payload.replace(/\D/g, '').substring(0, 4);
      const cardExpirationDisplay = cardExpiration.replace(/^(0[1-9]|1[0-2])(\d{2})$/, '$1/$2');
      const cardExpirationValid = validateCardExpiration(cardExpiration);
      const isValid = checkValid({ ...state, cardExpirationValid });
      return { ...state, cardExpiration, cardExpirationDisplay, cardExpirationValid, isValid };
    }
    case 'SET_CARD_VERIFICATION_CODE': {
      const cardVerificationCode = action.payload.replace(/\D/g, '').substring(0, 3);
      const cardVerificationCodeValid = validateNumberOnly(cardVerificationCode, 3);
      const isValid = checkValid({ ...state, cardVerificationCodeValid });
      return { ...state, cardVerificationCode, cardVerificationCodeValid, isValid };
    }
    default:
      return state;
  }
};

const BookingPage = () => {
  const auth = useAuthContext();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { 
    contactName, contactNameValid, 
    contactEmail, contactEmailValid, 
    contactPhoneDisplay, contactPhoneValid,
    cardNumberDisplay, cardNumberValid,
    cardExpirationDisplay, cardExpirationValid,
    cardVerificationCode, cardVerificationCodeValid,
    isValid
  } = state;
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

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [bookingResponses]);
  
  useEffect(() => {
    document.title = '台北一日遊 - 預定行程';
  }, []);

  return (
    <>
      <Navigation />
      <Header />
      <Main>
        <Section>
          <SectionContainer>
            <Title>您好，{name}，待預定的行程如下：</Title>
            <AttractionsInfo 
              bookingResponses={bookingResponses}
              onDeleteClick={(bookingId) => {
                auth.removeBooking(true, bookingId)
                .then(success => {
                  if (success) {
                    setBookingResponses(() => bookingResponses.filter(p => p.bookingId !== bookingId));
                  }
                });
              }}
            />
          </SectionContainer>
        </Section>
        {bookingResponses.length === 0 ? <></> : 
        <>
          <Section>
          <SectionContainer>
            <Title>您的聯絡資訊</Title>
            <Row>
              <RowText>聯絡姓名：</RowText>
              <Input 
                dangerMessage={contactNameValid || contactName.length === 0 ? '' : '⚠ 請輸入 1 ~ 20 個字元'}
                placeholder=''
                value={contactName}
                onChange={e => dispatch(setContactName(e.target.value))}
              />
            </Row>
            <Row>
              <RowText>聯絡信箱：</RowText>
              <Input 
                dangerMessage={contactEmailValid || contactEmail.length === 0 ? '' : '⚠ 請輸入正確的電子郵件'}
                placeholder=''
                value={contactEmail}
                onChange={e => dispatch(setContactEmail(e.target.value))}
              />
            </Row>
            <Row>
              <RowText>手機號碼：</RowText>
              <Input 
                dangerMessage={contactPhoneValid || contactPhoneDisplay.length === 0 ? '' : '⚠ 請輸入正確的手機號碼'}
                placeholder=''
                value={contactPhoneDisplay}
                onChange={e => dispatch(setContactPhone(e.target.value))}
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
                dangerMessage={cardNumberValid || cardNumberDisplay.length === 0 ? '' : '⚠ 請輸入正確的信用卡號碼'}
                placeholder='**** **** **** ****'
                value={cardNumberDisplay}
                onChange={e => dispatch(setCardNumber(e.target.value)) }
              />
            </Row>
            <Row>
              <RowText>過期時間：</RowText>
              <Input
                dangerMessage={cardExpirationValid || cardExpirationDisplay.length === 0 ? '' : '⚠ 請輸入正確的過期時間'}
                placeholder='MM/YY'
                value={cardExpirationDisplay}
                onChange={e => dispatch(setCardExpiration(e.target.value))}
              />
            </Row>
            <Row>
              <RowText>驗證密碼：</RowText>
              <Input
                dangerMessage={cardVerificationCodeValid || cardVerificationCode.length === 0 ? '' : '⚠ 請輸入正確的驗證密碼'}
                placeholder='CVV'
                value={cardVerificationCode}
                onChange={e => dispatch(setCardVerificationCode(e.target.value))}
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
                <Button 
                  style={{cursor: isValid ? 'pointer' : 'not-allowed'}} 
                  disabled={!isValid}
                >
                  確認訂購並付款
                </Button>
              </FlexEnd>
            </SectionContainer>
          </Section>
        </>
        }
      </Main>
      <Footer style={{ flexDirection: 'column' }} />
    </>
  );
};

export default BookingPage;
