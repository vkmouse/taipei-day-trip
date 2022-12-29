import React, { createContext, useContext, useEffect, useState } from "react";
import LoginRegisterDialog from "../components/LoginRegisterDialog";
import UserIconEditorDialog from "../components/UserIconEditorDialog";
import UserProfileDialog from "../components/UserProfileDialog";
import { useAppSelector } from "../store/store";

type DialogState = {
  showLoginRegister: () => void;
  showUserProgile: () => void;
  showUserIconEditor: (file: File) => void;
  hideLoginRegister: () => void;
  hideUserProgile: () => void;
  hideUserIconEditor: () => void;
};

const initialState: DialogState = {
  showLoginRegister: () => {
    throw "Not Implement";
  },
  showUserProgile: () => {
    throw "Not Implement";
  },
  showUserIconEditor: () => {
    throw "Not Implement";
  },
  hideLoginRegister: () => {
    throw "Not Implement";
  },
  hideUserProgile: () => {
    throw "Not Implement";
  },
  hideUserIconEditor: () => {
    throw "Not Implement";
  },
};

const DialogContext = createContext<DialogState>(initialState);
const handleStopWheel = (e: WheelEvent) => e.preventDefault();
const handleStopTouchMove = (e: TouchEvent) => e.preventDefault();

const DialogProvider = (props: { children: JSX.Element[] }) => {
  const [displayLoginRegister, setDisplayLoginRegister] = useState(false);
  const [displayUserProgile, setDisplayUserProgile] = useState(false);
  const [displayUserIconEditor, setDisplayUserIconEditor] = useState(false);
  const [file, setFile] = useState<File>();
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const value: DialogState = {
    showLoginRegister: () => {
      setDisplayLoginRegister(true);
    },
    showUserProgile: () => {
      setDisplayUserProgile(true);
    },
    showUserIconEditor: (file: File) => {
      setDisplayUserIconEditor(true);
      setFile(file);
    },
    hideLoginRegister: () => {
      setDisplayLoginRegister(false);
    },
    hideUserProgile: () => {
      setDisplayUserProgile(false);
    },
    hideUserIconEditor: () => {
      setDisplayUserIconEditor(false);
      setDisplayUserProgile(true);
    },
  };

  useEffect(() => {
    if (displayLoginRegister || displayUserProgile || displayUserIconEditor) {
      window.addEventListener("wheel", handleStopWheel, {
        passive: false,
      });
      window.addEventListener("touchmove", handleStopTouchMove, {
        passive: false,
      });
    } else {
      window.removeEventListener("wheel", handleStopWheel);
      window.removeEventListener("touchmove", handleStopTouchMove);
    }
  }, [displayLoginRegister, displayUserProgile, displayUserIconEditor]);

  const selectDialog = () => {
    if (isLoggedIn && displayUserProgile) {
      return (
        <UserProfileDialog
          hide={value.hideUserProgile}
          showEditor={value.showUserIconEditor}
        />
      );
    } else if (isLoggedIn && displayUserIconEditor && file) {
      return (
        <UserIconEditorDialog file={file} hide={value.hideUserIconEditor} />
      );
    } else if (!isLoggedIn && displayLoginRegister) {
      return <LoginRegisterDialog hide={value.hideLoginRegister} />;
    } else {
      return <></>;
    }
  };

  return (
    <DialogContext.Provider value={value}>
      {selectDialog()}
      {props.children}
    </DialogContext.Provider>
  );
};

const useDialogContext = (): DialogState => {
  return useContext(DialogContext);
};

export { DialogProvider, useDialogContext };
