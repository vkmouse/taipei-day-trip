import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { Header, Main, Footer } from '../components/Semantic';
import { useAuthContext } from '../context/AuthContext';
import { BodyBold, Secondery70 } from '../utils/CommonStyles';

const Section = styled.section`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 39px 10px 35px 10px;
  border-top: 1px solid #E8E8E8;
  border-width: 1px;
  @media (max-width: 800px) {
    flex-wrap: wrap;
  }
`;

const SectionContainer = styled.div`
  max-width: 1000px;
  flex-grow: 1;
`;

const Title = styled.div`
  ${BodyBold}
  color: ${Secondery70};
  flex-grow: 1;
`;

const BookingPage = () => {
  const auth = useAuthContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (auth.hasInit && !auth.isLogin) {
      navigate('/');
    }
  }, [auth.hasInit]);
  
  return (
    <>
      <Navigation />
      <Header />
      <Main>
        <Section>
          <SectionContainer>
            <Title>您好，Yakko，待預定的行程如下：</Title>
          </SectionContainer>
        </Section>
        
      </Main>
      <Footer style={{ flexDirection: 'column' }} />
    </>
  );
};

export default BookingPage;
