import { Attractions } from "./Core";

export interface API {
  getAttractions : (page: number, keyword: string) => Promise<Attractions>
  getCategories: () => Promise<{ data: string[] }>
}

export let api : API = {
  getAttractions: () => new Promise(() => void 0),
  getCategories: () => new Promise(() => void 0),
};

export const setAPI = (newapi : API) => {
  api = newapi;
};
