export type PaymentResponse = {
  orderId: number,
  payment: {
    status: number,
    message: string
  }
}
