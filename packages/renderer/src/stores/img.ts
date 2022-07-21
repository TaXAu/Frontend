import {defineStore} from 'pinia';
import {v1 as uuidv1} from 'uuid'; // uuid v1 使用时间戳
import type {img as imgDBType, imgSetInfo as imgSetInfoDBType} from '../plugins/indexDB';
import {myImgDB as db} from '../plugins/indexDB';

interface displayImgType {
  key: string,
  value: string,
}

export const imgStore = defineStore({
  id: 'img-store',
  state: () => {
    return {
      // 当前选中的图片集
      nowImgSetInfo: {
        isSelected: true, // 是否被选中
        id: 'default-imgset', // 图片集uuid
      },
    };
  },
  getters: {
    nowImgSet: (state) => {
      return state.nowImgSetInfo.isSelected ? state.nowImgSetInfo.id : null;
    },
  },

  actions: {
    // 添加图片集
    async addSet(name: string, description: string) {
      const date = new Date(); // 当前时间
      const newSet: imgSetInfoDBType = {
        id: uuidv1(), // 图片集唯一标识uuid
        name: name, // 用户定义的名称
        description: description, // 描述
        createdTime: date, // 创建时间
        lastModifiedTime: date, // 最后修改时间
      };
      await db.addImgSet(newSet);
      return newSet.id;
    },

    // 修改图片集
    async updateSet(id: string, {name, description}: { name?: string, description?: string }) {
      const set = await db.getImgSet(id);
      if (typeof set !== 'undefined') {
        set.lastModifiedTime = new Date();
        set.name = name || set.name;
        set.description = description || set.description;
        await db.updateImgSet(set);
      }

    },

    // 删除图片集
    async deleteSet(id: string) {
      await db.deleteImgSet(id);
    },

    // 选中图片集
    async selectSet(id: string) {
      if (await db.hasImgSet(id)) {
        this.nowImgSetInfo.id = id;
        this.nowImgSetInfo.isSelected = true;
        return true;
      } else {
        console.log('ERROR: 无选中的图片集{{id}}', id);
        return false;
      }
    },

    async addImg(img: FileList | File): Promise<void> {
      const imgTrans = async (img: File) => {
        const reader = new FileReader();
        const db: imgDBType = {
          id: uuidv1(),
          setId: this.nowImgSetInfo.id,
          filename: img.name,
          filetype: img.type,
          uploadTime: new Date(),
          lastModifiedTime: new Date(img.lastModified),
          blob: img,
        };
        reader.readAsDataURL(img);
        const promise = new Promise((resolve) => {
          reader.onload = () => {
            db.dataUrl = reader.result as string;
            resolve(reader.result as string);
          };
        });
        await promise;
        return db;

      };

      let imgToStore: imgDBType | imgDBType[];
      if (img instanceof FileList) {
        const imgsToStore: imgDBType[] = [];
        for (let i = 0; i < img.length; i++) {
          imgsToStore.push(await imgTrans(img[i]));
        }
        imgToStore = imgsToStore;

      } else {
        imgToStore = await imgTrans(img);
      }
      await db.addImg(imgToStore);
    },

    async getDisplayImgs() {
      const imgs: void | imgDBType[] = await db.getAllImg(this.nowImgSet!);
      if (typeof imgs === 'undefined') {
        return [];
      } else {
        const displayImgs: displayImgType[] = [];
        for (let i = 0; i < imgs.length; i++) {
          let url: string;
          if (imgs[i].dataUrl !== undefined) {
            url = imgs[i].dataUrl!;
          } else if (imgs[i].blob !== undefined) {
            const reader = new FileReader();
            reader.readAsDataURL(imgs[i].blob!);
            reader.onload = () => {
              url = <string>reader.result;
            };
          } else if (imgs[i].url !== undefined) {
            url = imgs[i].url!;
          } else {
            console.log('ERROR: 无图片url');
            continue;
          }
          displayImgs.push({
            key: imgs[i].id,
            value: url!,
          });
        }
        return displayImgs;
      }
    },

    // 删除图片
    async deleteImg(id: string | string[]) {
      await db.deleteImg(id);
    },
  },

});
