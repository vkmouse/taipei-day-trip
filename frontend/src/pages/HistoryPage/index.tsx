import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AttractionsInfo from "../../components/AttractionsInfo";
import Loader from "../../components/Loader";
import Navigation from "../../components/Navigation";
import { Footer, Header, Main } from "../../components/Semantic";
import { useAPIContext } from "../../context/APIContext";
import { useAppSelector } from "../../store/store";
import { OrderResponse } from "../../types/OrderTypes";
import NoOrdersSession from "./NoOrdersSession";
import OrdersSession from "./OrdersSession";

const HistoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const { getOrders } = useAPIContext();
  const loadOrders = async () => {
    const orders = await getOrders();
    setOrders(orders);
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
          loadOrders();
        }
      });
    } else {
      loadOrders();
    }
  };

  const [expandOrder, setExpandOrder] = useState(-1);

  useEffect(() => {
    document.title = "台北一日遊 - 歷史訂單";
    loadUserInfo();
  }, []);

  if (loading) {
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

  if (orders.length === 0) {
    return (
      <>
        <Navigation />
        <Header />
        <Main>
          <NoOrdersSession name={userInfo.name} />
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
        <OrdersSession
          name={userInfo.name}
          orders={orders}
          expandOrder={expandOrder}
          onToggle={(orderId, isExpand) => {
            if (isExpand) {
              setExpandOrder(-1);
            } else {
              setExpandOrder(orderId);
            }
          }}
        />
      </Main>
      <Footer />
    </>
  );
};

export default HistoryPage;
