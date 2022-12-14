export interface Attraction {
  id: number
  name: string
  description: string
  address: string
  lat: number
  lng: number
  transport: string
  images: string[]
  category: string
  mrt?: string
}

export interface Attractions { 
  data: Attraction[]
  nextPage: number | null
}

export type Booking = {
  attractionId: number
  starttime: Date,
  endtime: Date,
  price: number
}

export type BookingResponse = {
  attraction: {
    id: number
    name: string
    address: string
    image: string
  },
  bookingId: number
  starttime: Date
  endtime: Date
  price: number
}

export type API = {
  addBooking: (token: string, booking: Booking) => Promise<Response>
  getAttraction: (id: number) => Promise<Attraction>
  getAttractions: (page: number, keyword: string) => Promise<Attractions>
  getBookings: (token: string) => Promise<Response>
  getCategories: () => Promise<{ data: string[] }>
  getUserInfo: (token: string) => Promise<Response>
  login: (email: string, password: string) => Promise<Response>
  logout: () => Promise<Response>
  refresh: () => Promise<Response>
  register: (name: string, email: string, password: string) => Promise<Response>
}