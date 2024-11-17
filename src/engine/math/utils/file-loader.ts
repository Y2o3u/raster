import { Obj, Png } from '@/resources/resources';

export class Loader {
  /** 图片文件加载 */
  static loadImg(path: string): Promise<ImageData> {
    return new Promise<ImageData>((resolve) => {
      let img = new Image();
      img.crossOrigin = '*';
      img.onload = function () {
        let width = img.width;
        let height = img.height;
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        context?.drawImage(img, 0, 0, width, height);
        const imageData: any = context?.getImageData(0, 0, width, height);
        img = undefined as any;
        resolve(imageData);
      };
      img.src = path as string;
    });
  }

  /** 其他文件加载 */
  static loadText(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let text = '';
      const xhr = new XMLHttpRequest();
      xhr.open('GET', path as string);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            text = xhr.responseText;
            let a = xhr.getAllResponseHeaders();
            console.log(xhr);
            resolve(text);
          } else {
            reject(`error with http code:${xhr.status}`);
          }
        }
      };
      xhr.send();
    });
  }
}
