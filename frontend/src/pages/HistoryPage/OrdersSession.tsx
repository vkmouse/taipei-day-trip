import React from "react";
import AttractionsInfo from "../../components/AttractionsInfo";
import { OrderResponse } from "../../types/OrderTypes";
import {
  ClickableRow,
  JustifyBetween,
  AttractionsInfoFooter,
  Text,
  Section,
  SectionContainer,
  Title,
} from "./styles";

const OrdersSession = (props: {
  name: string;
  orders: OrderResponse[];
  expandOrder: number;
  onToggle: (orderId: number, isExpand: boolean) => void;
}) => {
  const { name, orders, expandOrder, onToggle } = props;
  return (
    <>
      <Section>
        <SectionContainer>
          <Title>您好，{name}，歷史訂單如下：</Title>
          {orders.map((m, i) => {
            return (
              <>
                <ClickableRow>
                  <Text
                    onClick={() =>
                      onToggle(m.orderId, expandOrder === m.orderId)
                    }
                  >
                    <JustifyBetween>
                      {expandOrder === m.orderId ? (
                        <div>▼ 訂單編號: {m.orderId}</div>
                      ) : (
                        <div>▶ 訂單編號: {m.orderId}</div>
                      )}

                      <div>{`新台幣 ${m.price} 元`}</div>
                    </JustifyBetween>
                  </Text>
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
            );
          })}
        </SectionContainer>
      </Section>
    </>
  );
};

export default OrdersSession;
