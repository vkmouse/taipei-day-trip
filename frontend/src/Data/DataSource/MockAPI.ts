import { API } from "../../Core/API";
import { Attraction, Attractions } from "../../Core/Core";

const ms = 1000;

class MockAPI implements API {
  getAttraction = (id: number) : Promise<Attraction> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(this.createAttraction(id)), ms);
    });
  };

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
      setTimeout(() => resolve({ data, nextPage }), ms);
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
      setTimeout(() => resolve({ data }), ms);
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
      images: ['https://www.travel.taipei/content/images/attractions/221371/1024x768_attractions-image-jyms0r6aquqilooahyiw8w.jpg',
               'https://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C0/D260/E538/F274/e7d482ba-e3c0-40c3-87ef-3f2a1c93edfa.JPG',
               'https://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C0/D20/E983/F199/866b5059-8fd7-4719-964c-51d2f78675d5.jpg'],
      category: `公共藝術${id}`,
      mrt: `忠孝復興${id}`
    };
  };
}

export default MockAPI;
