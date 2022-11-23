import { Attraction } from "../../Core/Core";

const getAttractions = async (page: number, keyword: string = '') : Promise<{ data: Attraction[], nextPage: number | null }> => {
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

const getCategories = async () : Promise<{ data: string[] }> => {
  const response = await fetch('/api/categories');
  const body = await response.json();
  return body;
};

export { getAttractions, getCategories };
