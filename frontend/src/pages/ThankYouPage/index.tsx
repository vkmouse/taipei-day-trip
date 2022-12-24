import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AttractionsInfo from '../../components/AttractionsInfo';
import Navigation from '../../components/Navigation';
import { Footer, Header, Main } from '../../components/Semantic';
import { useAPIContext } from '../../context/APIContext';
import { usePurchasedOrderContext } from '../../context/PurchasedOrderContext';
import { useAppSelector } from '../../store/store';
import { BookingResponse } from '../../types/BookingTypes';
import { Section, SectionContainer, Title } from './styles';

const ThankYouPage = () => {
  const isLoggedIn = useAppSelector(state => state.user.isLoggedIn);
  const userInfo = useAppSelector(state => state.user.userInfo);
  const { getUserInfo } = useAPIContext();
  const navigate = useNavigate();
  const api = useAPIContext();
  const { id, setId } = usePurchasedOrderContext();
  const [bookingResponses, setBookingResponses] = useState<BookingResponse[]>([]);

  useEffect(() => {
    if (!id) {
      navigate('/');
    } else {
      if (!isLoggedIn || !userInfo) {
        getUserInfo().then(member => {
          if (!member) {
            navigate('/');
          }
        });
      }
      api.getOrder(id).then(response => {
        if (response !== null) {
          setBookingResponses(response.trip);
        }
        setId(null);
      });
    }
  }, []);

  return (
    <>
      <Navigation />
      <Header />
      <Main>
        <Section>
          <SectionContainer>
            <Title>{userInfo?.name}，感謝您的預訂，祝您旅遊愉快</Title>
            <AttractionsInfo bookingResponses={bookingResponses} />
          </SectionContainer>
        </Section>
      </Main>
      <Footer />
    </>
  );
};

export default ThankYouPage;
