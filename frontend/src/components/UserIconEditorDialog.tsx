import styled from "@emotion/styled/macro";
import React, { CSSProperties, useEffect, useReducer } from "react";
import { BodyMediumSecondary70 } from "../utils/CommonStyles";
import Dialog from "./Dialog";

const editorWidth = 280;
const editorHeight = 280;

const IconEditorContainer = styled.div`
  padding: 30px 0 0 0;
  display: flex;
  justify-content: center;
  user-select: none;
`;

const IconEditorWrapper = styled.div`
  position: relative;
  width: ${editorWidth}px;
  height: ${editorHeight}px;
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

type Point = {
  x: number;
  y: number;
};

type State = {
  style: CSSProperties;
  position: Point;
  initialPosition: Point | null;
  width: number;
  height: number;
  scale: number;
  initialScale: number;
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
const panningEnd = (p: Point): Action => {
  return { type: Type.PANNING_END, payload: p };
};
const resize = (value: number): Action => {
  return { type: Type.RESIZE, payload: value };
};

const initialState: State = {
  style: {},
  position: { x: 0, y: 0 },
  initialPosition: null,
  width: 0,
  height: 0,
  scale: 1.0,
  initialScale: 1.0,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Type.INITIAL: {
      const width = action.payload.width;
      const height = action.payload.height;
      const initialScale = Math.max(editorWidth / width, editorHeight / height);
      const scale = initialScale;
      return {
        ...state,
        width,
        height,
        initialScale,
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
        initialPosition: action.payload,
      };
    }
    case Type.PANNING_MOVE: {
      if (state.initialPosition) {
        let x = state.position.x - state.initialPosition.x + action.payload.x;
        x = Math.min(x, 0);
        x = Math.max(x, -state.width * state.scale + editorWidth);
        let y = state.position.y - state.initialPosition.y + action.payload.y;
        y = Math.min(y, 0);
        y = Math.max(y, -state.height * state.scale + editorHeight);
        return {
          ...state,
          position: { x, y },
          style: {
            ...state.style,
            transform: `translate(${x}px, ${y}px)`,
          },
        };
      }
      return state;
    }
    case Type.PANNING_END: {
      state.initialPosition = null;
      return state;
    }
    case Type.RESIZE: {
      const scale = state.initialScale + 0.1 * action.payload;
      return {
        ...state,
        scale,
        style: {
          ...state.style,
          width: state.width * scale,
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
  const src = urlCreator.createObjectURL(file);

  useEffect(() => {
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
              const { offsetX, offsetY } = e.nativeEvent;
              dispatch(panningBegin({ x: offsetX, y: offsetY }));
            }}
            onMouseMove={(e) => {
              const { offsetX, offsetY } = e.nativeEvent;
              dispatch(panningMove({ x: offsetX, y: offsetY }));
            }}
            onMouseUp={(e) => {
              const { offsetX, offsetY } = e.nativeEvent;
              dispatch(panningEnd({ x: offsetX, y: offsetY }));
            }}
            onMouseLeave={(e) => {
              const { offsetX, offsetY } = e.nativeEvent;
              dispatch(panningEnd({ x: offsetX, y: offsetY }));
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
    </Dialog>
  );
};

export default UserIconEditorDialog;
