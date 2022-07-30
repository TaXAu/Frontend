import {v1 as uuidv1} from 'uuid'; // uuid v1 使用时间戳
import type {img as imgDBType, prjInfo} from './/indexDB';
import {myImgDB as db} from './/indexDB';
import {stateStore, stateStore as stateStore1} from '/@/stores/state';
import type {imgInfoDataUrlType} from '../../../../types/bridge';

export async function addImgFromNode(img: imgInfoDataUrlType): Promise<void> {
  const stateStore = stateStore1();
  if (stateStore.isInSet) {
    const nowDate = new Date;
    const dbImg: imgDBType = {
      id: uuidv1(),
      prjId: <string>stateStore.ocr.prjId,
      filename: img.filename,
      filetype: img.filetype,
      uploadTime: nowDate,
      lastModifiedTime: nowDate,
      path: img.path,
      dataUrl: img.dataUrl,
    };
    await db.addImg(dbImg);
    _updateImgInfo(dbImg.id);
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
  _updatePrjInfo(newPrj.id);
}

export async function delPrj(id: string) {
  const allImg = await db.getAllImg(id);
  if (allImg !== undefined) {
    const allImgId = allImg.map((img) => img.id);
    await db.deleteImg(allImgId);
  }
  await db.deletePrj(id);
  _updatePrjInfo(id);
}

export async function updatePrj(info: prjInfo) {
  await db.updatePrj(info);
  _updatePrjInfo(info.id);
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

/* Hooks */

function _updatePrjInfo(prjId: string | string[]) {
  stateStore().ocr.changedPrjId = prjId;
}

function _updateImgInfo(imgId: string | string[]) {
  stateStore().ocr.changedImgId = imgId;
}