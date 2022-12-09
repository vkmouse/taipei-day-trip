import { API } from ".";
import { Attraction, Attractions } from "../../Core/Core";

const realAPI: API = {
  getAttraction: async (id: number) : Promise<Attraction> => {
    let url = `/api/attraction/${id}`;
    const response = await fetch(url);
    const body = await response.json();
    return body.data;
  },

  getAttractions: async (page: number, keyword: string = '') : Promise<Attractions> => {
    let url = '';
    if (keyword === '') {
      url = `/api/attractions?page=${page}`;
    } else {
      url = `/api/attractions?page=${page}&keyword=${keyword}`;
    }
    const response = await fetch(url);
    const body = await response.json();
    return body;
  },

  getCategories: async () : Promise<{ data: string[] }> => {
    const response = await fetch('/api/categories');
    const body = await response.json();
    return body;
  },

  getUserInfo: async (token: string) : Promise<Response> => {
    const response = await fetch('/api/user/auth', {
      method: 'GET',
      headers: new Headers({
        'Authorization': `Bearer ${token}`
      })
    });
    return response;
  },

  login: async (email: string, password: string): Promise<Response> => {
    const response = await fetch('/api/user/auth', {
      method: 'PUT',
      body: JSON.stringify({
        'email': email,
        'password': password,
      }),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
    return response;
  },

  logout: async () : Promise<Response> => {
    const response = await fetch('/api/user/auth', { method: 'DELETE' });
    return response;
  },

  refresh: async (): Promise<Response> => {
    const response = await fetch('/api/user/refresh', { method: 'POST' });
    return response;
  },

  register: async (name: string, email: string, password: string): Promise<Response> => {
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
  },
};

export default realAPI;
