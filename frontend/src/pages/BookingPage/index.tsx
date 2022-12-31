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
} from "../../utils/validate";
import { usePurchasedOrderContext } from "../../context/PurchasedOrderContext";
import PaymentSession from "./PaymentSession";
import ConfirmOrderSession from "./ConfirmOrderSession";
import ContactInfoSession from "./ContactInfoSession";
import Loader from "../../components/Loader";
import AttractionsInfoSession from "./AttractionsInfoSession";
import NoAttractionSession from "./NoAttractionsSession";

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
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const { getBookings } = useAPIContext();
  const loadBookings = async () => {
    const bookings = await getBookings();
    setBookings(bookings);
    setLoading(false);
  };

  const userInfo = useAppSelector((state) => state.user.userInfo);
  const { getUserInfo } = useAPIContext();
  const navigate = useNavigate();
  const loadUserInfo = () => {
    if (!userInfo) {
      getUserInfo().then((userInfo) => {
        if (!userInfo) {
          navigate("/");
        } else {
          dispatch(setContactName(userInfo.name));
          dispatch(setContactEmail(userInfo.email));
          loadBookings();
        }
      });
    } else {
      dispatch(setContactName(userInfo.name));
      dispatch(setContactEmail(userInfo.email));
      loadBookings();
    }
  };

  const hasSetup = useRef(false);
  const {
    loading: TPDirectLoading,
    cardIsValid,
    setup,
    getPrime,
  } = useTPDirect();
  const setupCreditCardBlock = () => {
    if (
      !hasSetup.current &&
      !TPDirectLoading &&
      userInfo &&
      bookings.length > 0
    ) {
      hasSetup.current = true;
      setup("tp-card-number", "tp-expiration-date", "tp-ccv");
    }
  };

  const [contactState, dispatch] = useReducer(reducer, initialState);
  const {
    contactName,
    contactNameValid,
    contactEmail,
    contactEmailValid,
    contactPhone,
    contactPhoneDisplay,
    contactPhoneValid,
    contactIsValid,
  } = contactState;
  const [paymentMessage, setPaymentMessage] = useState("");
  const { processPayment, removeBooking } = useAPIContext();
  const { setId } = usePurchasedOrderContext();
  const isValid = contactIsValid && cardIsValid;
  const totalPrice = bookings
    .map((m) => m.price)
    .reduce((total, price) => total + price, 0);

  const handleConfirmOrderClick = async () => {
    const prime = await getPrime();
    if (prime) {
      const response = await processPayment(
        prime,
        totalPrice,
        bookings.map((x) => x.bookingId),
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

  const handleAttractionDeleteClick = async (bookingId: number) => {
    const success = await removeBooking(bookingId);
    if (success) {
      setBookings((bookingResponses) =>
        bookingResponses.filter((p) => p.bookingId !== bookingId)
      );
    }
  };

  useEffect(() => {
    document.title = "台北一日遊 - 預定行程";
    loadUserInfo();
  }, []);

  useEffect(() => {
    setupCreditCardBlock();
    window.scrollTo({ top: 0 });
  }, [userInfo, bookings, TPDirectLoading]);

  if (loading || TPDirectLoading) {
    return (
      <>
        <Navigation />
        <Header />
        <Main>
          <Loader percent={0} />
        </Main>
        <Footer style={{ flexDirection: "column" }} />
      </>
    );
  }

  if (!userInfo) {
    return <></>;
  }

  if (bookings.length === 0) {
    return (
      <>
        <Navigation />
        <Header />
        <Main>
          <NoAttractionSession name={userInfo.name} />
        </Main>
        <Footer style={{ flexDirection: "column" }} />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <Header />
      <Main>
        <AttractionsInfoSession
          name={userInfo.name}
          bookings={bookings}
          onDeleteClick={handleAttractionDeleteClick}
        />
        <ContactInfoSession
          contactNameValid={contactNameValid || contactName.length === 0}
          contactEmailValid={contactEmailValid || contactEmail.length === 0}
          contactPhoneValid={
            contactPhoneValid || contactPhoneDisplay.length === 0
          }
          contactName={contactName}
          contactEmail={contactEmail}
          contactPhone={contactPhoneDisplay}
          onContactNameChange={(value) => dispatch(setContactName(value))}
          onContactEmailChange={(value) => dispatch(setContactEmail(value))}
          onContactPhoneChange={(value) => dispatch(setContactPhone(value))}
        />
        <PaymentSession />
        <ConfirmOrderSession
          isValid={isValid}
          message={paymentMessage}
          price={totalPrice}
          onConfirmOrderClick={handleConfirmOrderClick}
        />
      </Main>
      <Footer />
    </>
  );
};

export default BookingPage;
