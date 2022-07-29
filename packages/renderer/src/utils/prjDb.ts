import {v1 as uuidv1} from 'uuid'; // uuid v1 使用时间戳
import type {img as imgDBType, prjInfo} from './/indexDB';
import {myImgDB as db} from './/indexDB';
import {stateStore as stateStore1} from '/@/stores/state';
import type {imgInfoDataUrlType} from '../../../../types/bridge';

// for display basic info of images in ImgView.vue
export interface displayImgInfo {
  id: string,
  filename: string,
  uploadTime: Date,
  lastModifiedTime: Date,
  url: string
}

export async function addImgFromNode(img: imgInfoDataUrlType): Promise<void> {
  const stateStore = stateStore1();
  if (stateStore.isInSet) {
    const nowDate = new Date;
    const dbImg: imgDBType = {
      id: uuidv1(),
      prjId: stateStore.ocr.prjId,
      filename: img.filename,
      filetype: img.filetype,
      uploadTime: nowDate,
      lastModifiedTime: nowDate,
      path: img.path,
      dataUrl: img.dataUrl,
    };
    await db.addImg(dbImg);
  }
}

export async function getDisplayImgInfo(id: string): Promise<displayImgInfo[] | void> {
  const images: imgDBType[] | void = await db.getAllImg(id);
  const displayImages: displayImgInfo[] = [];
  if (images !== undefined) {
    images.forEach((image) => {
      if (('dataUrl' in image && image.dataUrl !== undefined) ||
        ('url' in image && image.url !== undefined)) {
        const displayImage: displayImgInfo = {
          id: image.id,
          filename: image.filename,
          uploadTime: image.uploadTime,
          lastModifiedTime: image.lastModifiedTime,
          url: 'dataUrl' in image ? image.dataUrl! : image.url!,
        };
        displayImages.push(displayImage);
      }
      // TODO
      // 'else if' Blob and Path case
    });
    return displayImages;
  }
}

export async function addPrj(name: string, description?: string) {
  const _description = description ?? '';
  const nowDate = new Date();
  const newPrj: prjInfo = {
    id: uuidv1(),
    name: name,
    description: _description,
    createdTime: nowDate,
    lastModifiedTime: nowDate,
  };
  await db.addPrj(newPrj);
}

export async function delPrj(id: string) {
  const allImg = await db.getAllImg(id);
  if (allImg !== undefined) {
    const allImgId = allImg.map((img) => img.id);
    await db.deleteImg(allImgId);
  }
  await db.deletePrj(id);
}

export async function updatePrj(info: prjInfo) {
  await db.updatePrj(info);
}

// get an image object from the img id.
export async function getImgInfo(id: string): Promise<imgDBType | void> {
  const img = db.img.get(id);
  if (img !== undefined) {
    return img;
  }
}

// get a img set object from the img set id.
export async function getPrjInfo(id: string): Promise<prjInfo | void> {
  const prj = db.info.get(id);
  if (prj !== undefined) {
    return prj;
  }
}
