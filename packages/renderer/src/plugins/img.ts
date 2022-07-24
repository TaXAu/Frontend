import {v1 as uuidv1} from 'uuid'; // uuid v1 使用时间戳
import type {img as imgDBType, imgSetInfo} from '../plugins/indexDB';
import {myImgDB as db} from '../plugins/indexDB';
import {stateStore as stateStore1} from '/@/stores/state';
import type {imgInfoType} from '../../../../types/bridge';

// for display basic info of images in ImgOverview.vue
export interface displayImgInfo {
  id: string,
  filename: string,
  uploadTime: Date,
  lastModifiedTime: Date,
  url: string
}

export async function addImgFromDataUrl(img: imgInfoType): Promise<void> {
  const stateStore = stateStore1();
  if (stateStore.isInSet) {
    const nowDate = new Date;
    const dbImg: imgDBType = {
      id: uuidv1(),
      setId: stateStore.ocr.setId,
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

export async function getDisplayImgInfo(): Promise<displayImgInfo[] | void> {
  const stateStore = stateStore1();
  if (stateStore.isInSet) {
    const images: imgDBType[] | void = await db.getAllImg(stateStore.ocr.setId);
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
    return void 0;
  }
}

export async function delImgSet(id: string) {
  const allImg = await db.getAllImg(id);
  if (allImg !== undefined) {
    const allImgId = allImg.map((img) => img.id);
    await db.deleteImg(allImgId);
  }
  await db.deleteImgSet(id);
}

// get an image object from the img id.
export async function getImgInfo(id: string): Promise<imgDBType | void> {
  const img = db.img.get(id);
  if (img !== undefined) {
    return img;
  }
}

// get a img set object from the img set id.
export async function getImgSetInfo(id: string): Promise<imgSetInfo | void> {
  const imgSet = db.info.get(id);
  if (imgSet !== undefined) {
    return imgSet;
  }
}
