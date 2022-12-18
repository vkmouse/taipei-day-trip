import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/InputField';
import Navigation from '../../components/Navigation';
import { Header, Main, Footer } from '../../components/Semantic';
import { useAuthContext } from '../../context/APIContext';
import { useAppSelector } from '../../store/store';
import { BookingResponse } from '../../types/BookingTypes';
import { validateName, validateEmail, validatePhone, validateNumberOnly, validateCardExpiration } from '../../utils/validate';
import AttractionsInfo from './AttractionsInfo';
import { Section, SectionContainer, Title, Row, RowText, RowTextBold, FlexEnd, Button } from './styles';

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

enum Type {
  SET_CONTACT_NAME,
  SET_CONTACT_EMAIL,
  SET_CONTACT_PHONE,
  SET_CARD_NUMBER,
  SET_CARD_EXPIRATION,
  SET_CARD_VERIFICATION_CODE,
}

type Action = { type: Type, payload: string };
const setContactName = (value: string): Action => { return { type: Type.SET_CONTACT_NAME, payload: value }; };
const setContactEmail = (value: string): Action => { return { type: Type.SET_CONTACT_EMAIL, payload: value }; };
const setContactPhone = (value: string): Action => { return { type: Type.SET_CONTACT_PHONE, payload: value }; };
const setCardNumber = (value: string): Action => { return { type: Type.SET_CARD_NUMBER, payload: value }; };
const setCardExpiration = (value: string): Action => { return { type: Type.SET_CARD_EXPIRATION, payload: value }; };
const setCardVerificationCode = (value: string): Action => { return { type: Type.SET_CARD_VERIFICATION_CODE, payload: value }; };

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
    case Type.SET_CONTACT_NAME: {
      const contactName = action.payload;
      const contactNameValid = validateName(contactName);
      const isValid = checkValid({ ...state, contactNameValid });
      return { ...state, contactName, contactNameValid, isValid };
    }
    case Type.SET_CONTACT_EMAIL: {
      const contactEmail = action.payload;
      const contactEmailValid = validateEmail(contactEmail);
      const isValid = checkValid({ ...state, contactEmailValid });
      return { ...state, contactEmail, contactEmailValid, isValid };
    }
    case Type.SET_CONTACT_PHONE: {
      const contactPhone = action.payload.replace(/\D/g, '').substring(0, 10);
      const contactPhoneDisplay = contactPhone
        .replace(/^(09[\d]{2})(\d{3})(\d{0,3})$/g, '$1-$2-$3')
        .replace(/^(09[\d]{2})(\d{0,3})$/g, '$1-$2')
        .replace(/-$/, '');
      const contactPhoneValid = validatePhone(contactPhone);
      const isValid = checkValid({ ...state, contactPhoneValid });
      return { ...state, contactPhone, contactPhoneDisplay, contactPhoneValid, isValid };
    }
    case Type.SET_CARD_NUMBER: {
      const cardNumber = action.payload.replace(/\D/g, '').substring(0, 16);
      const cardNumberDisplay = cardNumber.replace(/(\d{4})/g, '$1 ').trim();
      const cardNumberValid = validateNumberOnly(cardNumber, 16);
      const isValid = checkValid({ ...state, cardNumberValid });
      return { ...state, cardNumber, cardNumberDisplay, cardNumberValid, isValid };
    }
    case Type.SET_CARD_EXPIRATION: {
      const cardExpiration = action.payload.replace(/\D/g, '').substring(0, 4);
      const cardExpirationDisplay = cardExpiration.replace(/^(0[1-9]|1[0-2])(\d{2})$/, '$1/$2');
      const cardExpirationValid = validateCardExpiration(cardExpiration);
      const isValid = checkValid({ ...state, cardExpirationValid });
      return { ...state, cardExpiration, cardExpirationDisplay, cardExpirationValid, isValid };
    }
    case Type.SET_CARD_VERIFICATION_CODE: {
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
  const isLoggedIn = useAppSelector(state => state.user.isLoggedIn);
  const { hasInit, getUserInfo, getBookings, removeBooking } = useAuthContext();
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
    if (hasInit) {
      if (!isLoggedIn) {
        navigate('/');
      } else {
        getUserInfo(true).then(member => {
          if (member !== null) {
            setName(member.name);
          }
        });
        getBookings(true).then(bookings => {
          setBookingResponses(bookings);
        });
      }
    }
  }, [hasInit]);

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
            <AttractionsInfo bookingResponses={bookingResponses} onDeleteClick={async bookingId => {
                const success = await removeBooking(true, bookingId);
                if (success) {
                  setBookingResponses(bookingResponses => bookingResponses.filter(p => p.bookingId !== bookingId));
                }
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
            <RowTextBold>請保持手機暢通，準時到達，導覽人員將用手機與您聯繫，務必留下正確的聯絡方式。</RowTextBold>
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
                <RowTextBold>總價：新台幣 
                  {bookingResponses.map(m => m.price).reduce((total, price) => total + price, 0)} 
                  元
                </RowTextBold>
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
