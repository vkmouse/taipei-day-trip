import { API } from "../../Core/API";
import { Attraction, Attractions } from "../../Core/Core";

class RealAPI implements API {
  getAttraction = async (id: number) : Promise<Attraction> => {
    let url = `/api/attraction/${id}`;
    const response = await fetch(url);
    const body = await response.json();
    return body.data;
  };

  getAttractions = async (page: number, keyword: string = '') : Promise<Attractions> => {
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

  register = async (name: string, email: string, password: string): Promise<Response> => {
    const response = await fetch('/api/user', {
      method: 'POST',
      body: JSON.stringify({
        'name': name,
        'email': email,
        'password': password,
      }),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
    return response;
  };
}

export default RealAPI;
