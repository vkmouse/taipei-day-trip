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

export type API = {
  addBooking: (booking: Booking) => Promise<boolean>
  getAttraction: (id: number) => Promise<Attraction>
  getAttractions : (page: number, keyword: string) => Promise<Attractions>
  getCategories: () => Promise<{ data: string[] }>
  getUserInfo: (token: string) => Promise<Response>
  login: (email: string, password: string) => Promise<Response>
  logout: () => Promise<Response>
  refresh: () => Promise<Response>
  register: (name: string, email: string, password: string) => Promise<Response>
}