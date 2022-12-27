import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AttractionsInfo from "../../components/AttractionsInfo";
import Loader from "../../components/Loader";
import Navigation from "../../components/Navigation";
import { Footer, Header, Main } from "../../components/Semantic";
import { useAPIContext } from "../../context/APIContext";
import { useAppSelector } from "../../store/store";
import { OrderResponse } from "../../types/OrderTypes";
import { BodyMediumSecondary70 } from "../../utils/CommonStyles";
import {
  Section,
  SectionContainer,
  Title,
  Text,
  ClickableRow,
  AttractionsInfoFooter,
  JustifyBetween,
} from "./styles";

const HistoryPage = () => {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const { getUserInfo, getOrders } = useAPIContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderResponses, setOrderResponses] = useState<OrderResponse[]>([]);
  const [expandOrder, setExpandOrder] = useState(-1);

  const handleOrders = async () => {
    const orders = await getOrders();
    setOrderResponses(orders);
    setLoading(false);
  };

  useEffect(() => {
    document.title = "台北一日遊 - 歷史訂單";
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      getUserInfo().then((member) => {
        if (!member) {
          navigate("/");
        } else {
          handleOrders();
        }
      });
    } else {
      handleOrders();
    }
  }, []);

  if (!loading && orderResponses.length === 0) {
    return (
      <>
        <Navigation />
        <Header />
        <Main>
          <Section>
            <SectionContainer>
              <Title>歷史訂單如下：</Title>
              <div style={{ display: "flex", paddingTop: "20px" }}>
                <BodyMediumSecondary70>目前沒有任何訂單</BodyMediumSecondary70>
              </div>
            </SectionContainer>
          </Section>
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
        {loading ? (
          <Loader percent={0} />
        ) : (
          <Section>
            <SectionContainer>
              <Title>歷史訂單如下：</Title>
              {orderResponses.length === 0 ? (
                <Text>目前沒有任何訂單</Text>
              ) : (
                <>
                  {orderResponses.map((m, i) => {
                    return (
                      <>
                        <>
                          <ClickableRow>
                            {expandOrder === m.orderId ? (
                              <Text onClick={() => setExpandOrder(-1)}>
                                <JustifyBetween>
                                  <div>▼ 訂單編號: {m.orderId}</div>
                                  <div>{`新台幣 ${m.price} 元`}</div>
                                </JustifyBetween>
                              </Text>
                            ) : (
                              <Text onClick={() => setExpandOrder(m.orderId)}>
                                <JustifyBetween>
                                  <div>▶ 訂單編號: {m.orderId}</div>
                                  <div>{`新台幣 ${m.price} 元`}</div>
                                </JustifyBetween>
                              </Text>
                            )}
                          </ClickableRow>
                          {expandOrder === m.orderId ? (
                            <>
                              <AttractionsInfo key={i} bookings={m.trip} />
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
              )}
            </SectionContainer>
          </Section>
        )}
      </Main>
      <Footer style={{ flexDirection: "column" }} />
    </>
  );
};

export default HistoryPage;
