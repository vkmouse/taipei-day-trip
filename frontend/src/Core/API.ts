import { Attraction, Attractions } from "./Core";

export interface API {
  getAttraction: (id: number) => Promise<Attraction>
  getAttractions : (page: number, keyword: string) => Promise<Attractions>
  getCategories: () => Promise<{ data: string[] }>
}

export let api : API = {
  getAttraction: () => new Promise(() => void 0),
  getAttractions: () => new Promise(() => void 0),
  getCategories: () => new Promise(() => void 0),
};

export const setAPI = (newapi : API) => {
  api = newapi;
};
