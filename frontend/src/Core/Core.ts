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

export interface AttractionState { 
  data: Attraction[],
  nextPage: number | null 
}
