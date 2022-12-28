import { css } from "@emotion/react";
import styled from "@emotion/styled/macro";
import React from "react";
import { useAppSelector } from "../store/store";
import {
  BodyBold,
  BodyBoldSecondary70,
  BodyMediumSecondary70,
  Primary,
} from "../utils/CommonStyles";
import Dialog from "./Dialog";

const UserIconContainer = styled.div`
  padding: 30px 0 0 0;
  display: flex;
  justify-content: center;
  user-select: none;
`;

const UserIconWrapper = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: 50%;
`;

const UserIconSize = css`
  position: absolute;
  width: 120px;
  height: 120px;
`;

const UserIconPosition = css`
  left: 10px;
  top: 10px;
`;

const UserIconVisibility = css`
  visibility: hidden;
  ${UserIconWrapper}:hover & {
    visibility: visible;
  }
`;

const UserIcon = styled.img`
  ${UserIconSize}
  border-radius: 50%;
  border: 10px solid ${Primary};
`;

const UserIconBackground = styled.div`
  ${UserIconSize}
  ${UserIconPosition}
  ${UserIconVisibility}
  border-radius: 50%;
  background-color: black;
  opacity: 0.5;
`;

const UserIconText = styled.div`
  ${UserIconSize}
  ${UserIconPosition}
  ${UserIconVisibility}
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${BodyBold}
  color: white;
  user-select: none;
`;

const UserIconUploader = styled.input`
  ${UserIconSize}
  ${UserIconPosition}
  ${UserIconVisibility}
  border-radius: 50%;
  padding: 0;
  border-width: 0;
  cursor: pointer;
  opacity: 0;
  &:focus {
    outline-width: 0;
  }
`;

const UserInfoContainer = styled.div`
  padding-top: 15px;
`;

const UserProfileDialog = (props: {
  showEditor?: (file: File) => void;
  hide?: () => void;
}) => {
  const { showEditor, hide } = props;
  const userInfo = useAppSelector((state) => state.user.userInfo);
  return (
    <Dialog title={"會員資料"} hide={hide}>
      <UserIconContainer>
        <UserIconWrapper>
          <UserIcon src={userInfo?.avatarUrl + "?size=160"} />
          <UserIconBackground />
          <UserIconText>更改頭像</UserIconText>
          <UserIconUploader
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => {
              if (e.target.files) {
                hide?.();
                showEditor?.(e.target.files[0]);
              }
            }}
          />
        </UserIconWrapper>
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
