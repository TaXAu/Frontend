import type {Table} from 'dexie';
import Dexie from 'dexie';

// Image set database

const imgDBVersion = 1;
export const imgDbName = 'imgDB';
export const imgInfoStoreName = 'info';

export interface img {
  id: string;
  prjId: string;
  filename: string;
  filetype: string;
  uploadTime: Date;
  lastModifiedTime: Date;
  path?: string,
  blob?: Blob;
  dataUrl?: string;
  url?: string;
}

export interface prjInfo {
  id: string;
  name: string;
  description: string;
  createdTime: Date;
  lastModifiedTime: Date;
}

export class myImgDexie extends Dexie {
  img!: Table<img>;
  info!: Table<prjInfo>;

  constructor() {
    super(imgDbName);
    this.version(imgDBVersion).stores({
      info: '&id, *name, description, createdTime, lastModifiedTime',
      img: '&id, *prjId, *filename, size, filetype, createdTime, lastModifiedTime, path, blob, dataUrl, url',
    });
    this.info = this.table('info');
    this.img = this.table('img');
  }

  async getPrj(id: string): Promise<void | prjInfo> {
    return this.info.get(id);
  }

  async getAllPrj(): Promise<void | prjInfo[]> {
    return this.info.toArray();
  }

  async addPrj(info: prjInfo): Promise<void> {
    await this.info.add(info);
  }

  async updatePrj(info: prjInfo): Promise<void> {
    await this.info.update(info.id, info);
  }

  async deletePrj(id: string): Promise<void> {
    await this.info.delete(id);
  }

  async getAllImg(imgPrjId: string): Promise<void | img[]> {
    return this.img.where('prjId').equals(imgPrjId).toArray();
  }

  async getImg(imgId: string | Array<string>): Promise<void | img | Array<img>> {
    let img: void | img | Array<img>;
    if (typeof imgId === 'string') {
      img = await this.img.get(imgId);
    } else {
      img = await this.img.where('id').anyOf(imgId).toArray();
    }
    return img;
  }

  async addImg(img: img | Array<img>): Promise<void> {
    if (Array.isArray(img)) {
      await this.img.bulkAdd(img);
    } else {
      await this.img.add(img);
    }
  }

  async updateImg(img: img | Array<img>): Promise<void> {
    if (Array.isArray(img)) {
      await this.img.bulkPut(img);
    } else {
      await this.img.put(img);
    }
  }

  async deleteImg(imgId: string | Array<string>): Promise<void> {
    if (Array.isArray(imgId)) {
      await this.img.where('id').anyOf(imgId).delete();
    } else {
      await this.img.delete(imgId);
    }
  }

  async hasPrj(id: string): Promise<boolean> {
    return await this.info.where('id').equals(id).count() > 0;
  }
}

export const myImgDB = new myImgDexie();
