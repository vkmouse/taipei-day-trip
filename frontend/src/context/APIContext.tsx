import React, { createContext, useContext } from "react";
import mockAPI from "../api/mockAPI";
import realAPI from "../api/realAPI";
import { useAppDispatch, useAppSelector } from "../store/store";
import { reset, setToken, setUser, startLoading } from "../store/userSlice";
import { Attraction, Attractions } from "../types/AttractionTypes";
import { Booking, BookingResponse } from "../types/BookingTypes";
import { OrderResponse, PaymentResponse } from "../types/OrderTypes";
import { LoginResponse, UserInfo } from "../types/UserTypes";
import { parseDateTimeString } from "../utils/time";

type APIState = {
  getAttraction: (id: number) => Promise<Attraction>;
  getAttractions: (page: number, keyword: string) => Promise<Attractions>;
  getCategories: () => Promise<{ data: string[] }>;
  refresh: () => Promise<Response>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<Response>;

  addBooking: (booking: Booking) => Promise<boolean>;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  getBookings: () => Promise<BookingResponse[]>;
  getOrder: (orderId: number) => Promise<OrderResponse | null>;
  getUserInfo: () => Promise<UserInfo | null>;
  processPayment: (
    prime: string,
    price: number,
    bookingIds: number[],
    contactName: string,
    contactEmail: string,
    contactPhone: string
  ) => Promise<PaymentResponse | null>;
  removeBooking: (bookingId: number) => Promise<boolean>;
};

const initialState: APIState = {
  getAttraction: () => {
    throw new Error("Function not implemented.");
  },
  getAttractions: () => {
    throw new Error("Function not implemented.");
  },
  getCategories: () => {
    throw new Error("Function not implemented.");
  },
  refresh: () => {
    throw new Error("Function not implemented.");
  },
  register: () => {
    throw new Error("Function not implemented.");
  },

  addBooking: (): Promise<boolean> => {
    throw new Error("Function not implemented.");
  },
  login: (): Promise<LoginResponse> => {
    throw new Error("Function not implemented.");
  },
  logout: (): Promise<void> => {
    throw new Error("Function not implemented.");
  },
  getBookings: (): Promise<BookingResponse[]> => {
    throw new Error("Function not implemented.");
  },
  getOrder: (): Promise<OrderResponse | null> => {
    throw new Error("Function not implemented.");
  },
  getUserInfo: (): Promise<UserInfo> => {
    throw new Error("Function not implemented.");
  },
  processPayment: (): Promise<null> => {
    throw new Error("Function not implemented.");
  },
  removeBooking: (): Promise<boolean> => {
    throw new Error("Function not implemented.");
  },
};

const APIContext = createContext<APIState>(initialState);

const APIProvider = (props: {
  isMock?: boolean;
  children: JSX.Element[] | JSX.Element;
}) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.user.userToken);
  const api = props.isMock ? mockAPI : realAPI;

  const refreshAndCall = async (
    callback: (token: string) => Promise<Response>
  ) => {
    const response = await api.refresh();
    if (response.status === 200) {
      const body: { ok: boolean; access_token: string } = await response.json();
      dispatch(setToken(body.access_token));
      return await callback(body.access_token);
    }
    return response;
  };

  const callAPIWithRefresh = async (
    token: string | null,
    callAPI: (token: string) => Promise<Response>
  ) => {
    if (token) {
      const response = await callAPI(token);
      if (response.status === 401) {
        return refreshAndCall(callAPI);
      }
      return response;
    } else {
      return refreshAndCall(callAPI);
    }
  };

  const apiState: APIState = {
    getAttraction: api.getAttraction,
    getAttractions: api.getAttractions,
    getCategories: api.getCategories,
    refresh: api.refresh,
    register: api.register,

    addBooking: async (booking) => {
      const response = await callAPIWithRefresh(token, (token) =>
        api.addBooking(token, booking)
      );
      if (response.status === 201) {
        return true;
      }
      return false;
    },
    login: async (email, password) => {
      dispatch(startLoading());
      const response = await api.login(email, password);
      if (response.status === 200) {
        try {
          const body: { ok: boolean; access_token: string } =
            await response.json();
          dispatch(setToken(body.access_token));
          return LoginResponse.Success;
        } catch (e) {
          dispatch(reset());
          return LoginResponse.LoginFailed;
        }
      } else {
        dispatch(reset());
        const body: { error: boolean; message: string } = await response.json();
        if (body.message.includes("email")) {
          return LoginResponse.EmailNotExist;
        } else if (body.message.includes("password")) {
          return LoginResponse.PasswordError;
        } else if (response.status === 500) {
          return LoginResponse.ServerFailed;
        } else {
          return LoginResponse.LoginFailed;
        }
      }
    },
    logout: async () => {
      const response = await api.logout();
      const body: { ok: boolean } = await response.json();
      if (body.ok) {
        dispatch(reset());
      }
    },
    getOrder: async (orderId: number) => {
      const response = await callAPIWithRefresh(token, (token) =>
        api.getOrder(token, orderId)
      );
      if (response.status === 200) {
        const body: {
          data: {
            orderId: number;
            status: number;
            trip: {
              attraction: {
                id: number;
                name: string;
                address: string;
                image: string;
              };
              bookingId: number;
              starttime: string;
              endtime: string;
              price: number;
            }[];
            contact: {
              name: string;
              email: string;
              phone: string;
            };
          } | null;
        } = await response.json();
        if (body.data !== null) {
          return {
            ...body.data,
            trip: body.data.trip.map((m) => {
              return {
                ...m,
                starttime: parseDateTimeString(m.starttime),
                endtime: parseDateTimeString(m.endtime),
              };
            }),
          };
        }
      }
      return null;
    },
    getUserInfo: async () => {
      dispatch(startLoading());
      const response = await callAPIWithRefresh(token, api.getUserInfo);
      if (response.status === 200) {
        const body: { data: UserInfo } = await response.json();
        dispatch(setUser(body.data));
        return body.data;
      }
      dispatch(reset());
      return null;
    },
    getBookings: async () => {
      const response = await callAPIWithRefresh(token, api.getBookings);
      if (response.status === 200) {
        const body: {
          data: {
            attraction: {
              id: number;
              name: string;
              address: string;
              image: string;
            };
            bookingId: number;
            starttime: string;
            endtime: string;
            price: number;
          }[];
        } = await response.json();
        return body.data.map((m) => {
          return {
            ...m,
            starttime: parseDateTimeString(m.starttime),
            endtime: parseDateTimeString(m.endtime),
          };
        });
      }
      return [];
    },
    processPayment: async (
      prime,
      price,
      bookingIds,
      contactName,
      contactEmail,
      contactPhone
    ) => {
      const response = await callAPIWithRefresh(token, (token) => {
        return api.processPayment(
          token,
          prime,
          price,
          bookingIds,
          contactName,
          contactEmail,
          contactPhone
        );
      });
      if (response.status === 201) {
        const body: { data: PaymentResponse } = await response.json();
        return body.data;
      }
      return null;
    },
    removeBooking: async (bookingId) => {
      const response = await callAPIWithRefresh(token, (token) =>
        api.removeBooking(token, bookingId)
      );
      if (response.status === 200) {
        return true;
      }
      return false;
    },
  };
  return <APIContext.Provider value={apiState} {...props} />;
};

const useAPIContext = (): APIState => {
  return useContext(APIContext);
};

export { type APIState, APIContext, APIProvider, LoginResponse, useAPIContext };
