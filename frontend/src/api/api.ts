import { Attraction, Attractions } from '../types/AttractionTypes';
import { Booking } from '../types/BookingTypes';

export type API = {
  addBooking: (token: string, booking: Booking) => Promise<Response>
  getAttraction: (id: number) => Promise<Attraction>
  getAttractions: (page: number, keyword: string) => Promise<Attractions>
  getBookings: (token: string) => Promise<Response>
  getCategories: () => Promise<{ data: string[] }>
  getUserInfo: (token: string) => Promise<Response>
  login: (email: string, password: string) => Promise<Response>
  logout: () => Promise<Response>
  processPayment: (
    token: string,
    prime: string,
    price: number,
    bookingIds: number[],
    contactName: string,
    contactEmail: string,
    contactPhone: string
  ) => Promise<Response>
  refresh: () => Promise<Response>
  register: (name: string, email: string, password: string) => Promise<Response>
  removeBooking: (token: string, bookingId: number) => Promise<Response>
}
