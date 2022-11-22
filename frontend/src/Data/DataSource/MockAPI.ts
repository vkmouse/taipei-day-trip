import { Attraction } from "../../Core/Core";

const getAttractions = async (page: number, keyword: string = '') : Promise<{ data: Attraction[], nextPage: number | null }> => {
    let data: Attraction[] = [];
    let nextPage: number | null = page + 1;

    for (let i = 0; i < 12; i++) {
      const id = i + 12 * page;
      const attraction: Attraction = {
        id,
        name: `樹河${id}`,
        description: '',
        address: '',
        lat: 0,
        lng: 0,
        transport: '',
        images: ['https://www.travel.taipei/content/images/attractions/221371/1024x768_attractions-image-jyms0r6aquqilooahyiw8w.jpg'],
        category: `公共藝術${id}`,
        mrt: `忠孝復興${id}`
      };
      data.push(attraction);
    }

    if (page > 3 || (keyword !== '' && page > 1)) {
      nextPage = null;
      data = data.slice(1, 6);
    }
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve({ data, nextPage }), 1000);
  });
};

export { getAttractions };
