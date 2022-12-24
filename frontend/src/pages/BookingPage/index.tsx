import React, { useEffect, useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputField";
import Navigation from "../../components/Navigation";
import { Header, Main, Footer } from "../../components/Semantic";
import { useAPIContext } from "../../context/APIContext";
import useTPDirect from "../../hooks/useTPDirect";
import { useAppSelector } from "../../store/store";
import { BookingResponse } from "../../types/BookingTypes";
import {
  validateName,
  validateEmail,
  validatePhone,
  validateNumberOnly,
  validateCardExpiration,
} from "../../utils/validate";
import AttractionsInfo from "../../components/AttractionsInfo";
import {
  Section,
  SectionContainer,
  Title,
  Row,
  RowText,
  RowTextBold,
  FlexEnd,
  Button,
  TapPayInput,
} from "./styles";
import { usePurchasedOrderContext } from "../../context/PurchasedOrderContext";

const Input = (props: {
  dangerMessage: string;
  placeholder: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <InputField
      {...props}
      autoFocus
      style={{ width: "200px", height: "18px" }}
    />
  );
};

type State = {
  contactName: string;
  contactNameValid: boolean;
  contactEmail: string;
  contactEmailValid: boolean;
  contactPhone: string;
  contactPhoneDisplay: string;
  contactPhoneValid: boolean;
  contactIsValid: boolean;
};

enum Type {
  SET_CONTACT_NAME,
  SET_CONTACT_EMAIL,
  SET_CONTACT_PHONE,
}

type Action = { type: Type; payload: string };
const setContactName = (value: string): Action => {
  return { type: Type.SET_CONTACT_NAME, payload: value };
};
const setContactEmail = (value: string): Action => {
  return { type: Type.SET_CONTACT_EMAIL, payload: value };
};
const setContactPhone = (value: string): Action => {
  return { type: Type.SET_CONTACT_PHONE, payload: value };
};

const initialState: State = {
  contactName: "",
  contactNameValid: false,
  contactEmail: "",
  contactEmailValid: false,
  contactPhone: "",
  contactPhoneDisplay: "",
  contactPhoneValid: false,
  contactIsValid: false,
};

const reducer = (state: State, action: Action): State => {
  const checkValid = (state: State) => {
    return (
      state.contactNameValid &&
      state.contactEmailValid &&
      state.contactPhoneValid
    );
  };
  switch (action.type) {
    case Type.SET_CONTACT_NAME: {
      const contactName = action.payload;
      const contactNameValid = validateName(contactName);
      const isValid = checkValid({ ...state, contactNameValid });
      return {
        ...state,
        contactName,
        contactNameValid,
        contactIsValid: isValid,
      };
    }
    case Type.SET_CONTACT_EMAIL: {
      const contactEmail = action.payload;
      const contactEmailValid = validateEmail(contactEmail);
      const isValid = checkValid({ ...state, contactEmailValid });
      return {
        ...state,
        contactEmail,
        contactEmailValid,
        contactIsValid: isValid,
      };
    }
    case Type.SET_CONTACT_PHONE: {
      const contactPhone = action.payload.replace(/\D/g, "").substring(0, 10);
      const contactPhoneDisplay = contactPhone
        .replace(/^(09[\d]{2})(\d{3})(\d{0,3})$/g, "$1-$2-$3")
        .replace(/^(09[\d]{2})(\d{0,3})$/g, "$1-$2")
        .replace(/-$/, "");
      const contactPhoneValid = validatePhone(contactPhone);
      const isValid = checkValid({ ...state, contactPhoneValid });
      return {
        ...state,
        contactPhone,
        contactPhoneDisplay,
        contactPhoneValid,
        contactIsValid: isValid,
      };
    }
    default:
      return state;
  }
};

const BookingPage = () => {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const userInfo = useAppSelector((state) => state.user.userInfo);
  const { getUserInfo, getBookings, removeBooking } = useAPIContext();
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    contactName,
    contactNameValid,
    contactEmail,
    contactEmailValid,
    contactPhone,
    contactPhoneDisplay,
    contactPhoneValid,
    contactIsValid,
  } = state;
  const [bookingResponses, setBookingResponses] = useState<BookingResponse[]>(
    []
  );
  const [paymentMessage, setPaymentMessage] = useState("");
  const hasSetup = useRef(false);
  const api = useAPIContext();
  const { loadingSuccess, cardIsValid, setup, getPrime } = useTPDirect();
  const { setId } = usePurchasedOrderContext();
  const isValid = contactIsValid && cardIsValid;
  const totalPrice = bookingResponses
    .map((m) => m.price)
    .reduce((total, price) => total + price, 0);

  const handleSubmit = async () => {
    const prime = await getPrime();
    if (prime) {
      const response = await api.processPayment(
        prime,
        totalPrice,
        bookingResponses.map((x) => x.bookingId),
        contactName,
        contactEmail,
        contactPhone
      );
      if (response && response.payment.status === 0) {
        setId(response.orderId);
        navigate("/thankyou");
      } else {
        setPaymentMessage("付款失敗，請確認信用卡資訊");
      }
    }
  };

  useEffect(() => {
    if (!isLoggedIn || !userInfo) {
      getUserInfo().then((member) => {
        if (!member) {
          navigate("/");
        } else {
          dispatch(setContactName(userInfo ? userInfo.name : ""));
          dispatch(setContactEmail(userInfo ? userInfo.email : ""));
          getBookings().then((bookings) => setBookingResponses(bookings));
        }
      });
    } else {
      dispatch(setContactName(userInfo ? userInfo.name : ""));
      dispatch(setContactEmail(userInfo ? userInfo.email : ""));
      getBookings().then((bookings) => setBookingResponses(bookings));
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [bookingResponses]);

  useEffect(() => {
    document.title = "台北一日遊 - 預定行程";
  }, []);

  useEffect(() => {
    if (
      !hasSetup.current &&
      loadingSuccess &&
      userInfo &&
      bookingResponses.length > 0
    ) {
      hasSetup.current = true;
      setup("tp-card-number", "tp-expiration-date", "tp-ccv");
    }
  }, [userInfo, bookingResponses, loadingSuccess]);

  return (
    <>
      <Navigation />
      <Header />
      <Main>
        <Section>
          <SectionContainer>
            {userInfo ? (
              <>
                <Title>您好，{userInfo.name}，待預定的行程如下：</Title>
                <AttractionsInfo
                  bookingResponses={bookingResponses}
                  onDeleteClick={async (bookingId) => {
                    const success = await removeBooking(bookingId);
                    if (success) {
                      setBookingResponses((bookingResponses) =>
                        bookingResponses.filter(
                          (p) => p.bookingId !== bookingId
                        )
                      );
                    }
                  }}
                />
              </>
            ) : (
              <></>
            )}
          </SectionContainer>
        </Section>
        {bookingResponses.length === 0 ? (
          <></>
        ) : (
          <>
            <Section>
              <SectionContainer>
                <Title>您的聯絡資訊</Title>
                <Row>
                  <RowText>聯絡姓名：</RowText>
                  <Input
                    dangerMessage={
                      contactNameValid || contactName.length === 0
                        ? ""
                        : "⚠ 請輸入 1 ~ 20 個字元"
                    }
                    placeholder=""
                    value={contactName}
                    onChange={(e) => dispatch(setContactName(e.target.value))}
                  />
                </Row>
                <Row>
                  <RowText>聯絡信箱：</RowText>
                  <Input
                    dangerMessage={
                      contactEmailValid || contactEmail.length === 0
                        ? ""
                        : "⚠ 請輸入正確的電子郵件"
                    }
                    placeholder=""
                    value={contactEmail}
                    onChange={(e) => dispatch(setContactEmail(e.target.value))}
                  />
                </Row>
                <Row>
                  <RowText>手機號碼：</RowText>
                  <Input
                    dangerMessage={
                      contactPhoneValid || contactPhoneDisplay.length === 0
                        ? ""
                        : "⚠ 請輸入正確的手機號碼"
                    }
                    placeholder=""
                    value={contactPhoneDisplay}
                    onChange={(e) => dispatch(setContactPhone(e.target.value))}
                  />
                </Row>
                <RowTextBold>
                  請保持手機暢通，準時到達，導覽人員將用手機與您聯繫，務必留下正確的聯絡方式。
                </RowTextBold>
              </SectionContainer>
            </Section>
            <Section>
              <SectionContainer>
                <Title>信用卡付款資訊</Title>
                <Row>
                  <RowText>卡片號碼：</RowText>
                  <TapPayInput id="tp-card-number" />
                </Row>
                <Row>
                  <RowText>過期時間：</RowText>
                  <TapPayInput id="tp-expiration-date" />
                </Row>
                <Row>
                  <RowText>驗證密碼：</RowText>
                  <TapPayInput id="tp-ccv" />
                </Row>
              </SectionContainer>
            </Section>
            <Section>
              <SectionContainer>
                <FlexEnd>
                  <RowTextBold>總價：新台幣 {totalPrice} 元</RowTextBold>
                </FlexEnd>
                <FlexEnd>
                  <Button
                    style={{ cursor: isValid ? "pointer" : "not-allowed" }}
                    disabled={!isValid}
                    onClick={handleSubmit}
                  >
                    確認訂購並付款
                  </Button>
                </FlexEnd>
                <FlexEnd>
                  <RowText style={{ color: "red" }}>{paymentMessage}</RowText>
                </FlexEnd>
              </SectionContainer>
            </Section>
          </>
        )}
      </Main>
      <Footer style={{ flexDirection: "column" }} />
    </>
  );
};

export default BookingPage;
