import React, { useEffect } from "react";
import Navigation from "../../components/Navigation";
import { Header, Main } from "../../components/Semantic";

const HistoryPage = () => {
  useEffect(() => {
    document.title = "台北一日遊 - 歷史訂單";
  }, []);

  return (
    <>
      <Navigation />
      <Header />
      <Main></Main>
    </>
  );
};

export default HistoryPage;
