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
