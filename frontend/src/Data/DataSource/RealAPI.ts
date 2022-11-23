import { API } from "../../Core/API";
import { Attraction } from "../../Core/Core";

class RealAPI implements API {
  getAttractions = async (page: number, keyword: string = '') : Promise<{ data: Attraction[], nextPage: number | null }> => {
    let url = '';
    if (keyword === '') {
      url = `/api/attractions?page=${page}`;
    } else {
      url = `/api/attractions?page=${page}&keyword=${keyword}`;
    }
    const response = await fetch(url);
    const body = await response.json();
    return body;
  };

  getCategories = async () : Promise<{ data: string[] }> => {
    const response = await fetch('/api/categories');
    const body = await response.json();
    return body;
  };
}

export default RealAPI;
