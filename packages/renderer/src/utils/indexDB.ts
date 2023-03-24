import type { Table } from 'dexie'
import Dexie from 'dexie'

// Image set database

const imgDBVersion = 1
export const imgDbName = 'imgDB'
export const imgInfoStoreName = 'prj'

export interface img {
  id: string
  prjId: string
  filename: string
  filetype: string
  uploadTime: Date
  lastModifiedTime: Date
  path?: string
  blob?: Blob
  dataUrl?: string
  url?: string
}

export interface prjInfo {
  id: string
  name: string
  description: string
  createdTime: Date
  lastModifiedTime: Date
}

export class myImgDexie extends Dexie {
  img!: Table<img>
  prj!: Table<prjInfo>

  constructor() {
    super(imgDbName)
    this.version(imgDBVersion).stores({
      prj: '&id, *name, description, createdTime, lastModifiedTime',
      img: '&id, *prjId, *filename, size, filetype, createdTime, lastModifiedTime, path, blob, dataUrl, url',
    })
    this.prj = this.table('prj')
    this.img = this.table('img')
  }

  async getPrj(id: string): Promise<void | prjInfo> {
    return this.prj.get(id)
  }

  async getAllPrj(): Promise<void | prjInfo[]> {
    return this.prj.toArray()
  }

  async addPrj(prj: prjInfo): Promise<void> {
    await this.prj.add(prj)
  }

  async updatePrj(prj: prjInfo): Promise<void> {
    await this.prj.update(prj.id, prj)
  }

  async deletePrj(id: string): Promise<void> {
    await this.prj.delete(id)
  }

  async getAllImg(imgPrjId: string): Promise<void | img[]> {
    return this.img.where('prjId').equals(imgPrjId).toArray()
  }

  async getImg(imgId: string | Array<string>): Promise<void | img | Array<img>> {
    let img: void | img | Array<img>
    if (typeof imgId === 'string')
      img = await this.img.get(imgId)
    else
      img = await this.img.where('id').anyOf(imgId).toArray()

    return img
  }

  async addImg(img: img | Array<img>): Promise<void> {
    if (Array.isArray(img))
      await this.img.bulkAdd(img)
    else
      await this.img.add(img)
  }

  async updateImg(img: img | Array<img>): Promise<void> {
    if (Array.isArray(img))
      await this.img.bulkPut(img)
    else
      await this.img.put(img)
  }

  async deleteImg(imgId: string | Array<string>): Promise<void> {
    if (Array.isArray(imgId))
      await this.img.where('id').anyOf(imgId).delete()
    else
      await this.img.delete(imgId)
  }

  async hasPrj(id: string): Promise<boolean> {
    return await this.prj.where('id').equals(id).count() > 0
  }
}

// eslint-disable-next-line new-cap
export const myImgDB = new myImgDexie()
