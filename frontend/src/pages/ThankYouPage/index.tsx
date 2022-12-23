import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { Footer, Header, Main } from '../../components/Semantic';
import { useAPIContext } from '../../context/APIContext';
import { useAppSelector } from '../../store/store';
import { Section, SectionContainer, Title } from './styles';

const ThankYouPage = () => {
  const isLoggedIn = useAppSelector(state => state.user.isLoggedIn);
  const userInfo = useAppSelector(state => state.user.userInfo);
  const { getUserInfo } = useAPIContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || !userInfo) {
      getUserInfo().then(member => {
        if (!member) {
          navigate('/');
        }
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
              
              {/* <AttractionsInfo bookingResponses={bookingResponses} onDeleteClick={async bookingId => {
                  const success = await removeBooking(bookingId);
                  if (success) {
                    setBookingResponses(bookingResponses => bookingResponses.filter(p => p.bookingId !== bookingId));
                  }
                }}
              /> */}
          </SectionContainer>
        </Section>
      </Main>
      <Footer />
    </>
  );
};

export default ThankYouPage;
