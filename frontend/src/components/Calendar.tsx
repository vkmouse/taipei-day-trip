import styled from '@emotion/styled';
import React from 'react';
import { BodyMedium } from '../Presentation/Styles/Typography';

const InputDate = styled.input`
  position: relative;
  padding: 10px;
  width: 173px;
  height: 15px;
  border-width: 0;
  ${BodyMedium}
  color: black;
  ::-webkit-calendar-picker-indicator {
    position: absolute;
    background-image: url(/icon_calendar.png);
    background-position: 60px;
    cursor: pointer;
    width: 80px;
    height: 24px;
    left: 97px;
  }
`;

const Calendar = (props: { min: string, max: string, value: string, onChange: (value: string) => void }) => {
  const maxDate = Date.parse(props.max);
  const minDate = Date.parse(props.min);
  const handleChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Date.parse(e.target.value);
    if (value > maxDate) {
      props.onChange(props.max);
    } else if (value < minDate) {
      props.onChange(props.min);
    } else {
      props.onChange(e.target.value);
    }
  };
  
  return (
    <InputDate
      type='date'
      min={props.min}
      max={props.max}
      value={props.value}
      onChange={handleChanged}
    />
  );
};

export default Calendar;

