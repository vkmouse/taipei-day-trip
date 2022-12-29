import React from "react";
import AttractionsInfo from "../../components/AttractionsInfo";
import { BookingResponse } from "../../types/BookingTypes";
import { Section, SectionContainer, Title } from "./styles";

const AttractionsInfoSession = (props: {
  name: string;
  bookings: BookingResponse[];
  onDeleteClick?: (bookingId: number) => void;
}) => {
  const { name, bookings, onDeleteClick } = props;
  return (
    <Section>
      <SectionContainer>
        <>
          <Title>您好，{name}，待預定的行程如下：</Title>
          <AttractionsInfo bookings={bookings} onDeleteClick={onDeleteClick} />
        </>
      </SectionContainer>
    </Section>
  );
};

export default AttractionsInfoSession;
