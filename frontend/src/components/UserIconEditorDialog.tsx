import styled from "@emotion/styled/macro";
import React, { CSSProperties, useEffect, useReducer, useState } from "react";
import { useAPIContext } from "../context/APIContext";
import {
  BodyMedium,
  BodyMediumSecondary70,
  Primary,
  Secondery20,
  Secondery70,
} from "../utils/CommonStyles";
import Dialog from "./Dialog";

const editorSize = 310;
const saveSize = 310;

const IconEditorContainer = styled.div`
  padding: 30px 0 0 0;
  display: flex;
  justify-content: center;
  user-select: none;
`;

const IconEditorWrapper = styled.div`
  position: relative;
  width: ${editorSize}px;
  height: ${editorSize}px;
  border-radius: 5px;
  overflow: hidden;
`;

const IconEditorImage = styled.img`
  position: absolute;
  object-fit: fill;
  draggable: false;
  user-drag: none;
  -webkit-user-drag: none;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`;

const IconEditorScaleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
`;

const IconEditorScale = styled.input`
  width: 200px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ConfirmButton = styled.button`
  padding: 5px 20px 5px 20px;
  margin: 3px;
  ${BodyMedium}
  color: white;
  background-color: ${Primary};
  cursor: pointer;
  border-radius: 5px;
  border-width: 0;
`;

const CancelButton = styled.button`
  padding: 5px 20px 5px 20px;
  margin: 3px;
  ${BodyMedium}
  color: ${Secondery70};
  background-color: ${Secondery20};
  cursor: pointer;
  border-radius: 5px;
  border-width: 0;
`;

type Point = {
  x: number;
  y: number;
};

type State = {
  position: Point;
  panningPosition: Point | null;
  originWidth: number;
  originHeight: number;
  scale: number;
  initialScale: number;
  style: CSSProperties;
};

enum Type {
  INITIAL,
  PANNING_BEGIN,
  PANNING_MOVE,
  PANNING_END,
  RESIZE,
}

type Action = { type: Type; payload?: any };
const initial = (props: { width: number; height: number }): Action => {
  return { type: Type.INITIAL, payload: props };
};
const panningBegin = (p: Point): Action => {
  return { type: Type.PANNING_BEGIN, payload: p };
};
const panningMove = (p: Point): Action => {
  return { type: Type.PANNING_MOVE, payload: p };
};
const panningEnd = (): Action => {
  return { type: Type.PANNING_END };
};
const resize = (value: number): Action => {
  return { type: Type.RESIZE, payload: value };
};

const initialState: State = {
  style: {},
  initialScale: 1.0,
  originWidth: 0,
  originHeight: 0,
  panningPosition: null,
  position: { x: 0, y: 0 },
  scale: 1.0,
};

const reducer = (state: State, action: Action): State => {
  const constrain = (props: { position: Point; scale: number }) => {
    const { position: p, scale } = props;
    p.x = Math.min(p.x, 0);
    p.x = Math.max(p.x, -state.originWidth * scale + editorSize);
    p.y = Math.min(p.y, 0);
    p.y = Math.max(p.y, -state.originHeight * scale + editorSize);
    return p;
  };

  switch (action.type) {
    case Type.INITIAL: {
      const { width, height } = action.payload;
      const initialScale = Math.max(editorSize / width, editorSize / height);
      const scale = initialScale;
      return {
        ...state,
        initialScale,
        originWidth: width,
        originHeight: height,
        scale,
        style: {
          transform: `translate($0px, 0px)`,
          width: width * scale,
        },
      };
    }
    case Type.PANNING_BEGIN: {
      return {
        ...state,
        panningPosition: {
          x: -state.position.x + action.payload.x,
          y: -state.position.y + action.payload.y,
        },
      };
    }
    case Type.PANNING_MOVE: {
      if (state.panningPosition) {
        const position = constrain({
          ...state,
          position: {
            x: -state.panningPosition.x + action.payload.x,
            y: -state.panningPosition.y + action.payload.y,
          },
        });
        return {
          ...state,
          position,
          style: {
            ...state.style,
            transform: `translate(${position.x}px, ${position.y}px)`,
          },
        };
      }
      return state;
    }
    case Type.PANNING_END: {
      return {
        ...state,
        panningPosition: null,
      };
    }
    case Type.RESIZE: {
      const { initialScale } = state;
      const scale = initialScale + 0.1 * initialScale * action.payload;
      const position = constrain({ ...state, scale });
      return {
        ...state,
        position,
        scale,
        style: {
          ...state.style,
          transform: `translate(${position.x}px, ${position.y}px)`,
          width: state.originWidth * scale,
        },
      };
    }
    default: {
      return state;
    }
  }
};

const UserIconEditorDialog = (props: { file: File; hide?: () => void }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const urlCreator = window.URL || window.webkitURL;
  const { file, hide } = props;
  const [src, setSrc] = useState("");
  const { getUserInfo, uploadUserAvatar } = useAPIContext();

  const handleConfirmClick = () => {
    const canvas = document.createElement("canvas");
    canvas.width = saveSize;
    canvas.height = saveSize;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = src;
    image.onload = () => {
      const srcX = Math.abs(state.position.x) / state.scale;
      const srcY = Math.abs(state.position.y) / state.scale;
      const srcW = editorSize / state.scale;
      const srcH = editorSize / state.scale;
      const dstX = 0;
      const dstY = 0;
      const dstW = saveSize;
      const dstH = saveSize;
      ctx?.drawImage(image, srcX, srcY, srcW, srcH, dstX, dstY, dstW, dstH);
      canvas.toBlob(async (blob) => {
        if (blob) {
          await uploadUserAvatar(blob);
          await getUserInfo();
          hide?.();
        }
      });
    };
  };

  useEffect(() => {
    const src = urlCreator.createObjectURL(file);
    setSrc(src);
    const image = new Image();
    image.src = src;
    image.onload = () => {
      dispatch(initial({ width: image.width, height: image.height }));
    };
  }, []);

  return (
    <Dialog title={"更換頭貼"} hide={hide}>
      <IconEditorContainer>
        <IconEditorWrapper>
          <IconEditorImage
            src={src}
            style={state.style}
            onMouseDown={(e) => {
              const { clientX, clientY } = e;
              dispatch(panningBegin({ x: clientX, y: clientY }));
            }}
            onMouseMove={(e) => {
              const { clientX, clientY } = e;
              dispatch(panningMove({ x: clientX, y: clientY }));
            }}
            onMouseUp={() => {
              dispatch(panningEnd());
            }}
            onMouseLeave={() => {
              dispatch(panningEnd());
            }}
            onTouchStart={(e) => {
              const { clientX, clientY } = e.targetTouches[0];
              dispatch(panningBegin({ x: clientX, y: clientY }));
            }}
            onTouchMove={(e) => {
              const { clientX, clientY } = e.targetTouches[0];
              dispatch(panningMove({ x: clientX, y: clientY }));
            }}
            onTouchEnd={() => {
              dispatch(panningEnd());
            }}
            onTouchCancel={() => {
              dispatch(panningEnd());
            }}
          />
        </IconEditorWrapper>
      </IconEditorContainer>
      <IconEditorScaleContainer>
        <BodyMediumSecondary70>-</BodyMediumSecondary70>
        <IconEditorScale
          type="range"
          min={0}
          max={10}
          defaultValue={0}
          onChange={(e) => {
            dispatch(resize(Number(e.target.value)));
          }}
        />
        <BodyMediumSecondary70>+</BodyMediumSecondary70>
      </IconEditorScaleContainer>
      <ButtonContainer>
        <CancelButton onClick={hide}>取消</CancelButton>
        <ConfirmButton onClick={handleConfirmClick}>確認</ConfirmButton>
      </ButtonContainer>
    </Dialog>
  );
};

export default UserIconEditorDialog;
