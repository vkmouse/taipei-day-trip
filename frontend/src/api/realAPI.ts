import { Attraction, Attractions } from "../types/AttractionTypes";
import { Booking } from "../types/BookingTypes";
import { convertTimeToDateTime } from "../utils/time";
import { API } from "./api";

const realAPI: API = {
  addBooking: async (token: string, booking: Booking): Promise<Response> => {
    return await fetch("/api/booking", {
      method: "POST",
      body: JSON.stringify({
        attractionId: booking.attractionId,
        starttime: convertTimeToDateTime(booking.starttime),
        endtime: convertTimeToDateTime(booking.endtime),
        price: booking.price,
      }),
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }),
    });
  },

  getAttraction: async (id: number): Promise<Attraction> => {
    let url = `/api/attraction/${id}`;
    const response = await fetch(url);
    const body = await response.json();
    return body.data;
  },

  getAttractions: async (
    page: number,
    keyword: string = ""
  ): Promise<Attractions> => {
    let url = "";
    if (keyword === "") {
      url = `/api/attractions?page=${page}`;
    } else {
      url = `/api/attractions?page=${page}&keyword=${keyword}`;
    }
    const response = await fetch(url);
    const body = await response.json();
    return body;
  },

  getBookings: async (token: string): Promise<Response> => {
    return await fetch("/api/booking", {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    });
  },

  getCategories: async (): Promise<{ data: string[] }> => {
    const response = await fetch("/api/categories");
    const body = await response.json();
    return body;
  },

  getOrder: async (token: string, orderId: number): Promise<Response> => {
    const response = await fetch(`/api/order/${orderId}`, {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    });
    return response;
  },

  getUserInfo: async (token: string): Promise<Response> => {
    const response = await fetch("/api/user/auth", {
      method: "GET",
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    });
    return response;
  },

  login: async (email: string, password: string): Promise<Response> => {
    const response = await fetch("/api/user/auth", {
      method: "PUT",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    return response;
  },

  logout: async (): Promise<Response> => {
    const response = await fetch("/api/user/auth", { method: "DELETE" });
    return response;
  },

  processPayment: async (
    token: string,
    prime: string,
    price: number,
    bookingIds: number[],
    contactName: string,
    contactEmail: string,
    contactPhone: string
  ): Promise<Response> => {
    return await fetch("api/orders", {
      method: "POST",
      body: JSON.stringify({
        prime: prime,
        order: {
          price,
          bookingIds,
          contact: {
            name: contactName,
            email: contactEmail,
            phone: contactPhone,
          },
        },
      }),
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }),
    });
  },

  refresh: async (): Promise<Response> => {
    const response = await fetch("/api/user/refresh", { method: "POST" });
    return response;
  },

  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<Response> => {
    const response = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    return response;
  },

  removeBooking: async (
    token: string,
    bookingId: number
  ): Promise<Response> => {
    const response = await fetch("/api/booking", {
      method: "DELETE",
      body: JSON.stringify({
        bookingId: bookingId,
      }),
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }),
    });
    return response;
  },
};

export default realAPI;
