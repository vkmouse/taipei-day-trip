import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAPIContext } from "../context/APIContext";
import { useLoginRegisterContext } from "../context/LoginRegisterContext";
import { useAppSelector } from "../store/store";
import {
  H2,
  Primary,
  BodyMedium,
  Secondery,
  Secondery20,
} from "../utils/CommonStyles";
import ProfileMenu from "./ProfileMenu";

const Container = styled.nav`
  display: flex;
  position: fixed;
  justify-content: center;
  z-index: 999;
  width: 100%;
  height: 54px;
  background: white;
`;

const Navbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 1200px;
  height: 100%;
  margin: 0 10px 0 10px;
`;

const NavBrand = styled(Link)`
  ${H2};
  padding: 0;
  background-color: transparent;
  cursor: pointer;
  color: ${Primary};
  border-width: 0px;
  text-decoration: none;
`;

const NavToggler = styled.div`
  background-image: url(https://scontent.ftpe8-4.fna.fbcdn.net/v/t1.6435-1/46346680_1919536431427677_1454114397000564736_n.jpg?stp=cp0_dst-jpg_p40x40&_nc_cat=110&ccb=1-7&_nc_sid=7206a8&_nc_ohc=xC0-IOizR8cAX_CNK93&_nc_ht=scontent.ftpe8-4.fna&oh=00_AfCIgrGxBSeHaJ7zSMPBPuLQVxogEm1gLe_sU5V0Whis1w&oe=63D11A42);
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
`;

const NavItems = styled.div`
  display: flex;
`;

const NavItem = styled.button`
  ${BodyMedium};
  padding: 10px;
  background-color: transparent;
  cursor: pointer;
  color: ${Secondery};
  border-width: 0px;
  @media (max-width: 1200px) {
    &:last-child {
      padding-right: 0;
    }
  }
  &:hover {
    background-color: ${Secondery20};
  }
`;

const Navigation = () => {
  const location = useLocation();
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const userInfo = useAppSelector((state) => state.user.userInfo);
  const loading = useAppSelector((state) => state.user.loading);
  const { getUserInfo } = useAPIContext();
  const { show } = useLoginRegisterContext();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || !userInfo) {
      getUserInfo();
    }
  }, []);

  const handleBrandClicked = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Container>
      <Navbar>
        <NavBrand to="/" onClick={handleBrandClicked}>
          台北一日遊
        </NavBrand>
        <NavItems>
          {isLoggedIn ? (
            <NavToggler
              onClick={() => {
                if (!loading && isLoggedIn) {
                  setIsMenuVisible((isMenuVisible) => !isMenuVisible);
                } else {
                  setIsMenuVisible(false);
                }
              }}
            >
              <ProfileMenu
                style={{ display: isMenuVisible ? "block" : "none" }}
              />
            </NavToggler>
          ) : (
            <NavItem onClick={show}>{"登入/註冊"}</NavItem>
          )}
        </NavItems>
      </Navbar>
    </Container>
  );
};

export default Navigation;
