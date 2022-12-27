import styled from "@emotion/styled";
import React from "react";
import { useAppSelector } from "../store/store";
import {
  BodyBoldSecondary70,
  BodyMediumSecondary70,
  Primary,
} from "../utils/CommonStyles";
import Dialog from "./Dialog";

const UserIconContainer = styled.div`
  padding: 30px 0 0 0;
  display: flex;
  justify-content: center;
`;

const UserIcon = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 10px solid ${Primary};
`;

const UserInfoContainer = styled.div`
  padding-top: 15px;
`;

const UserProfileDialog = (props: { hide?: () => void }) => {
  const { hide } = props;
  const userInfo = useAppSelector((state) => state.user.userInfo);
  return (
    <Dialog title={"會員資料"} hide={hide}>
      <UserIconContainer>
        <UserIcon src={userInfo?.avatarUrl + "?size=160"} />
      </UserIconContainer>
      <UserInfoContainer>
        <BodyBoldSecondary70>姓名</BodyBoldSecondary70>
        <BodyMediumSecondary70>{userInfo?.name}</BodyMediumSecondary70>
      </UserInfoContainer>
      <UserInfoContainer>
        <BodyBoldSecondary70>電子信箱</BodyBoldSecondary70>
        <BodyMediumSecondary70>{userInfo?.email}</BodyMediumSecondary70>
      </UserInfoContainer>
    </Dialog>
  );
};

export default UserProfileDialog;
