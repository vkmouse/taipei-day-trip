import styled from "@emotion/styled";
import React, { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useAPIContext } from "../context/APIContext";
import { useDialogContext } from "../context/DiagramContext";
import { useAppSelector } from "../store/store";
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

const ProfileIcon = styled.img`
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
  const userInfo = useAppSelector((state) => state.user.userInfo);
  const navigate = useNavigate();
  const { logout } = useAPIContext();
  const { showUserProgile } = useDialogContext();

  return (
    <ProfileMenuContainer style={style}>
      <ProfileRow onClick={showUserProgile}>
        <ProfileIcon src={userInfo?.avatarUrl + "?size=80"} />
        <ProfileTextBold>{userInfo?.name}</ProfileTextBold>
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
