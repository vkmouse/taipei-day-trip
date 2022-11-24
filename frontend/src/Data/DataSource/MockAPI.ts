import { API } from "../../Core/API";
import { Attraction, Attractions } from "../../Core/Core";

class MockAPI implements API {
  getAttractions = (page: number, keyword: string) : Promise<Attractions> => {
    let data: Attraction[] = [];
    let nextPage: number | null = page + 1;
    for (let i = 0; i < 12; i++) {
      const id = i + 12 * page;
      data.push(this.createAttraction(id));
    }

    if (keyword === '' && page > 3) {
      nextPage = null;
      data = data.slice(1, 6);
    } else if (keyword !== '' && page > 0) {
      nextPage = null;
      data = data.slice(1, 6);
    } else if (keyword === '1') {
      nextPage = null;
      data = data.slice(1, 5);
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ data, nextPage }), 1000);
    });
  };

  getCategories = () : Promise<{ data: string[] }> => {
    const data = [
      '綠野現蹤', '你是笨蛋', '哈哈哈哈', '輸入景點',
      '綠野現蹤', '你是笨蛋', '哈哈哈哈', '輸入景點',
      '綠野現蹤', '你是笨蛋', '哈哈哈哈', '輸入景點',
      '綠野現蹤', '你是笨蛋', '哈哈哈哈', '輸入景點',
    ];
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve({ data }), 1000);
    });
  };

  private createAttraction = (id: number) : Attraction => {
    return {
      id: id,
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
  };
}

export default MockAPI;
