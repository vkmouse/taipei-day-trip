import React, { useEffect, useState } from "react";
import AttractionsInfo from "../../components/AttractionsInfo";
import Navigation from "../../components/Navigation";
import { Footer, Header, Main } from "../../components/Semantic";
import { useAPIContext } from "../../context/APIContext";
import { OrderResponse } from "../../types/OrderTypes";
import {
  Section,
  SectionContainer,
  Title,
  Text,
  ClickableRow,
  AttractionsInfoFooter,
} from "./styles";

const HistoryPage = () => {
  const api = useAPIContext();
  const [orderResponses, setOrderResponses] = useState<OrderResponse[]>([]);
  const [expandOrder, setExpandOrder] = useState(-1);

  const getOrders = async () => {
    const orders = await api.getOrders();
    setOrderResponses(orders);
    console.log(orders);
  };

  useEffect(() => {
    document.title = "台北一日遊 - 歷史訂單";
  }, []);

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <>
      <Navigation />
      <Header />
      <Main>
        <Section>
          <SectionContainer>
            <Title>歷史訂單如下：</Title>
            <>
              {orderResponses.map((m, i) => {
                return (
                  <>
                    <>
                      <ClickableRow>
                        {expandOrder === m.orderId ? (
                          <Text onClick={() => setExpandOrder(-1)}>
                            ▼ 訂單編號: {m.orderId}
                          </Text>
                        ) : (
                          <Text onClick={() => setExpandOrder(m.orderId)}>
                            ▶ 訂單編號: {m.orderId}
                          </Text>
                        )}
                      </ClickableRow>
                      {expandOrder === m.orderId ? (
                        <>
                          <AttractionsInfo key={i} bookingResponses={m.trip} />
                          <AttractionsInfoFooter />
                        </>
                      ) : (
                        <></>
                      )}
                    </>
                  </>
                );
              })}
            </>
          </SectionContainer>
        </Section>
      </Main>
      <Footer />
    </>
  );
};

export default HistoryPage;
