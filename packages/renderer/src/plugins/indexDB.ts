import type {Table} from 'dexie';
import Dexie from 'dexie';

// Image set database

const imgDBVersion = 1;
export const imgDbName = 'imgDB';
export const imgInfoStoreName = 'info';

export interface img {
  id: string;
  setId: string;
  filename: string;
  size: number;
  filetype: string;
  uploadTime: Date;
  lastModifiedTime: Date;
  blob?: Blob;
  dataUrl?: string;
  url?: string;
}

export interface imgSetInfo {
  id: string;
  name: string;
  description: string;
  createdTime: Date;
  lastModifiedTime: Date;
}

export class myImgDexie extends Dexie {
  img!: Table<img>;
  info!: Table<imgSetInfo>;

  constructor() {
    super(imgDbName);
    this.version(imgDBVersion).stores({
      info: '&id, *name, description, createdTime, lastModifiedTime',
      img: '&id, *setId, *filename, size, filetype, createdTime, lastModifiedTime, blob, dataUrl, url',
    });
    this.info = this.table('info');
    this.img = this.table('img');
  }

  async getImgSet(id: string): Promise<void | imgSetInfo> {
    return this.info.get(id);
  }

  async getAllImgSet(): Promise<void | imgSetInfo[]> {
    return this.info.toArray();
  }

  async addImgSet(info: imgSetInfo): Promise<void> {
    await this.info.add(info);
  }

  async updateImgSet(info: imgSetInfo): Promise<void> {
    await this.info.update(info.id, info);
  }

  async deleteImgSet(id: string): Promise<void> {
    await this.info.delete(id);
  }

  async getAllImg(imgSetId: string): Promise<void | img[]> {
    return this.img.where('setId').equals(imgSetId).toArray();
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

  async hasImgSet(id: string): Promise<boolean> {
    return await this.info.where('id').equals(id).count() > 0;
  }
}

export const myImgDB = new myImgDexie();
