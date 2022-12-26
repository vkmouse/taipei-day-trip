import styled from "@emotion/styled";
import React, { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useAPIContext } from "../context/APIContext";
import {
  BodyBold,
  Primary,
  Secondery20,
  Secondery70,
} from "../utils/CommonStyles";

const ProfileMenuContainer = styled.div`
  position: absolute;
  top: 46px;
  right: 0px;
  padding: 5px;
  width: 350px;
  background-color: ${Secondery20};
  border-radius: 5px;
  user-select: none;
  box-shadow: 0px 0px 20px #aabbcc;
`;

const ProfileRow = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  color: ${Secondery70};
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${Primary};
    color: white;
  }
`;

const ProfileIcon = styled.div`
  background-image: url(https://scontent.ftpe8-4.fna.fbcdn.net/v/t1.6435-1/46346680_1919536431427677_1454114397000564736_n.jpg?stp=cp0_dst-jpg_p40x40&_nc_cat=110&ccb=1-7&_nc_sid=7206a8&_nc_ohc=xC0-IOizR8cAX_CNK93&_nc_ht=scontent.ftpe8-4.fna&oh=00_AfCIgrGxBSeHaJ7zSMPBPuLQVxogEm1gLe_sU5V0Whis1w&oe=63D11A42);
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const ProfileText = styled.div`
  padding-left: 10px;
`;

const ProfileTextBold = styled(ProfileText)`
  ${BodyBold};
`;

const ProfileMenu = (props: { style?: CSSProperties }) => {
  const { style } = props;
  const navigate = useNavigate();
  const { logout } = useAPIContext();

  return (
    <ProfileMenuContainer style={style}>
      <ProfileRow onClick={() => navigate("/user")}>
        <ProfileIcon />
        <ProfileTextBold>劉師睿</ProfileTextBold>
      </ProfileRow>
      <hr />
      <ProfileRow onClick={() => navigate("/booking")}>
        <ProfileText>預定行程</ProfileText>
      </ProfileRow>
      <ProfileRow onClick={() => navigate("/history")}>
        <ProfileText>歷史訂單</ProfileText>
      </ProfileRow>
      <ProfileRow onClick={logout}>
        <ProfileText>登出</ProfileText>
      </ProfileRow>
    </ProfileMenuContainer>
  );
};

export default ProfileMenu;
