import React from 'react';
import { BookingResponse } from '../../types/BookingTypes';
import { convertTimeToDate, getShortTimeString } from '../../utils/time';
import { AttractionsAction, AttractionsActionIcon, AttractionsDetail, AttractionsImage, AttractionsInfoContainer, Row, RowTextBold, PrimaryRowText, RowText } from './styles';

const AttractionsInfo = (props: { 
  bookingResponses: BookingResponse[],
  onDeleteClick?: (bookingId: number) => void
}) => {
  const { bookingResponses, onDeleteClick } = props;

  if (bookingResponses.length === 0) {
    return (
      <AttractionsInfoContainer>
        <RowText>目前沒有任何待預訂的行程</RowText>
      </AttractionsInfoContainer>
    );
  }
  
  return (
    <>
      {bookingResponses.map((booking, i) => 
        <AttractionsInfoContainer key={i}>
          <AttractionsImage src={booking.attraction.image} />
          <AttractionsDetail>
            <Row>
              <PrimaryRowText>台北一日遊：{booking.attraction.name}</PrimaryRowText>
            </Row>
            <Row>
              <RowTextBold>日期：</RowTextBold>
              <RowText>{convertTimeToDate(booking.starttime)}</RowText>
            </Row>
            <Row>
              <RowTextBold>時間：</RowTextBold>
              <RowText>
                {getShortTimeString(booking.starttime)} 到 {getShortTimeString(booking.endtime)} 
              </RowText>
            </Row>
            <Row>
              <RowTextBold>費用：</RowTextBold>
              <RowText>新台幣 {booking.price} 元</RowText>
            </Row>
            <Row>
              <RowTextBold>地點：</RowTextBold>
              <RowText>臺北市 大安區忠孝東路4段</RowText>
            </Row>
          </AttractionsDetail>
          <AttractionsAction>
            <AttractionsActionIcon src='trash.png' onClick={() => onDeleteClick?.(booking.bookingId)}/>
          </AttractionsAction>
        </AttractionsInfoContainer>
      )}
    </>
  );
};

export default AttractionsInfo;
