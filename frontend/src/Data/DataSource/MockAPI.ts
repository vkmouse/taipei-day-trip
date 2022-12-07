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

  register = (name: string, email: string, password: string): Promise<Response> => {
    let status = 200;
    if (name === '400') {
      status = 400;
    } else if (name === '409') {
      status = 409;
    } else if (name === '500') {
      status = 500;
    }

    const response: Response = {
      headers: new Headers(),
      ok: true,
      redirected: false,
      status,
      statusText: '',
      type: 'basic',
      url: '',
      clone: function (): Response {
        throw new Error("Function not implemented.");
      },
      body: null,
      bodyUsed: false,
      arrayBuffer: function (): Promise<ArrayBuffer> {
        throw new Error("Function not implemented.");
      },
      blob: function (): Promise<Blob> {
        throw new Error("Function not implemented.");
      },
      formData: function (): Promise<FormData> {
        throw new Error("Function not implemented.");
      },
      json: function (): Promise<any> {
        throw new Error("Function not implemented.");
      },
      text: function (): Promise<string> {
        throw new Error("Function not implemented.");
      }
    };
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(response), ms);
    });
  };

  private createAttraction = (id: number) : Attraction => {
    return {
      id: id,
      name: `樹河${id}`,
      description: '大稻埕原是平埔族的居住地，因萬華（艋舺）同安人發生激烈的械鬥，造成族人移至大稻埕定居，開始大稻埕淡水河旁商店和房屋的興建，淡水港開放後，大稻埕在劉銘傳的治理下成為臺北城最繁華的物資集散中心，當中以茶葉、布料為主要貿易交易，當時的延平北路及貴德街一帶便是商業活動的重心，也讓大稻埕早年的歷史多采多姿、令人回味。',
      address: '臺北市 大同區環河北路一段',
      lat: 0,
      lng: 0,
      transport: '捷運站名：雙連站，轉乘紅33(固定班次)於大稻埕碼頭站下車。公車：9、206、274、641、669、704至大稻埕碼頭站及255、518、539至民生西路口站，再沿民生西路底方向步行約10分鐘抵達。 開車：沿著環河北路依大稻埕碼頭入口指引便可抵達。',
      images: ['https://www.travel.taipei/content/images/attractions/221371/1024x768_attractions-image-jyms0r6aquqilooahyiw8w.jpg',
               'https://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C0/D260/E538/F274/e7d482ba-e3c0-40c3-87ef-3f2a1c93edfa.JPG',
               'https://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C0/D20/E983/F199/866b5059-8fd7-4719-964c-51d2f78675d5.jpg'],
      category: `公共藝術${id}`,
      mrt: `忠孝復興${id}`
    };
  };
}

export default MockAPI;
