import { BookingResponse } from "./BookingTypes";

export type PaymentResponse = {
  orderId: number;
  payment: {
    status: number;
    message: string;
  };
};

export type OrderResponse = {
  orderId: number;
  status: number;
  trip: BookingResponse[];
  contact: {
    name: string;
    email: string;
    phone: string;
  };
};
