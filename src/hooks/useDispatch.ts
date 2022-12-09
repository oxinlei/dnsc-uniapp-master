import { reactive } from "vue";
import {
  headerOption,
  sign,
  getToken,
  useGetRequest,
  usePostRequest,
} from "./useRequest";

export function useDispatch() {
  const state = reactive({});

  // 获取设备位置
  function getLayeredList() {
    return new Promise((resolve, reject) => {
      useGetRequest<ILayeredListRes>("plant_area/getLayeredList", {}).then(
        (res) => {
          resolve(res.data);
        }
      );
    });
  }
  // 非设备正常维修派单
  function creatAboutRepair(data: IRepairPrams) {
    return new Promise((resolve, reject) => {
      usePostRequest<ILayeredListRes>(
        "order_repair/creatAboutRepair",
        data
      ).then((res) => {
        resolve(res.data);
      });
    });
  }
  // 非设备简单维修派单
  function creatSimpleAboutRepair(data: IRepairPrams) {
    return new Promise((resolve, reject) => {
      usePostRequest<ILayeredListRes>(
        "order_repair/creatSimpleAboutRepair",
        data
      ).then((res) => {
        resolve(res.data);
      });
    });
  }
  // 设备正常维修派单
  function creatDevRepair(data: IRepairPrams) {
    return new Promise((resolve, reject) => {
      usePostRequest<ILayeredListRes>("order_repair/creatDevRepair", data).then(
        (res) => {
          resolve(res.data);
        }
      );
    });
  }
  // 设备简单维修派单
  function creatSimpleDevRepair(data: IRepairPrams) {
    return new Promise((resolve, reject) => {
      usePostRequest<ILayeredListRes>(
        "order_repair/creatSimpleDevRepair",
        data
      ).then((res) => {
        resolve(res.data);
      });
    });
  }
  return {
    state,
    getLayeredList,
    creatAboutRepair,
    creatSimpleAboutRepair,
    creatDevRepair,
    creatSimpleDevRepair,
  };
}

export interface ILayeredListRes {
  areaId: number; //厂区ID;
  areaName: string; //厂区名称;
  positionList: any;
}

export interface ILayeredListResData {
  text: number; //厂区ID;
  value: string; //厂区名称;
  children: any;
}

export interface IRepairPrams {
  orderName: string; //派单名称
  isSmsRemind: number; //是否开启短信提醒 0：否 1：是
  positionId?: number; //故障位置
  describe: string; //故障描述
  orderImg: string; //故障图片
  examineUids?: string; //审核人员ID集合，多个使用逗号隔开
  noticeUids: string; //通知人员ID集合，多个使用逗号隔开
  planUids?: string; //维修人员
  deviceId?: number; //设备id
}
