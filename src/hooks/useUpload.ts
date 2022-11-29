import { reactive, ref } from "vue";
import { headerOption, sign, getToken } from "./useRequest";
import { BASE_API, APP_CONFIG } from "@/config/baseConfig";

export function useUpload() {
  const state = reactive({
    imgs: [] as IImgs[],
  });
  const delteImg = (index: number) => {
    state.imgs.splice(index, 1);
  };
  const addImg = (arr: IImgs[]) => {
    let r = ref(arr);
    state.imgs = [...state.imgs, ...r.value];
  };
  const upload = async (imgs: IImgs[] | any) => {
    const tokenObj: any = await getToken();
    let head = {
      timestamp: Math.round(new Date().getTime() / 1000),
      access_token: tokenObj.token,
    };
    const s = sign({ ...headerOption, ...head });

    if (imgs === "" || imgs.length === 0) {
      // resolve({ url: [] });
      return Promise.resolve({ url: [] });
    }
    uni.showLoading({ mask: true });
    let promiseArr = [] as any[];
    imgs.forEach((item: IImgs, index: number) => {
      promiseArr[index] = new Promise((resolve, reject) => {
        uni.uploadFile({
          url: BASE_API + "/upload/uploadFileArray",
          name: "file",
          filePath: item.path,
          header: {
            access_token: tokenObj.token,
            app_id: APP_CONFIG.appId,
            sign: s,
            timestamp: Math.round(new Date().getTime() / 1000),
            sign_method: APP_CONFIG.signMethod,
            version: APP_CONFIG.version,
            format: APP_CONFIG.format,
          },
          success: (res) => {
            console.log("success", res);
            resolve(JSON.parse(res.data));
          },

          fail: (res) => {
            uni.hideLoading();
            uni.showToast({
              title: "上传失败",
              icon: "none",
            });
            reject(res);
          },
        });
      });
    });
    return new Promise((resolve, reject) => {
      Promise.all(promiseArr)
        .then((res: any) => {
          let url = [] as string[];
          res.forEach((item: any) => {
            if (item.code === 0) {
              url.push(item.url.toString());
            }
          });
          uni.hideLoading();
          resolve({ url });
        })
        .catch((err) => {
          uni.hideLoading();
        });
    });
  };

  return {
    state,
    delteImg,
    addImg,
    upload,
  };
}

export interface IImgs {
  path: string;
  lastModified: number;
  lastModifiedDate: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}
