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
  // 获取设备车间位置
  function getAreaList() {
    return new Promise((resolve, reject) => {
      useGetRequest<any>("plant_area/getAreaList", {}).then(
        (res) => {
          resolve(res.data);
        }
      );
    });
  }
  // 获取设备功能位置
  function getPlantPositionList(areaId: string) {
    return new Promise((resolve, reject) => {
      useGetRequest<any>("plant_position/getPlantPositionList", {areaId: areaId}).then(
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
  // 获取设备文档
  function getGoodsDocList(classId: string) {
    return new Promise((resolve, reject) => {
      useGetRequest<IRepairWord>("goods_doc/getGoodsDocList", { classId: classId }).then(
        (res) => {
          resolve(res.data);
        }
      );
    });
  }
   // 获取备品配件
   function getMaterialList(deviceId: number) {
    return new Promise((resolve, reject) => {
      useGetRequest<any>("device/getRelevanceMaterialList", { deviceId: deviceId }).then(
        (res) => {
          resolve(res.data);
        }
      );
    });
  }
  return {
    state,
    getLayeredList,
    creatAboutRepair,
    creatSimpleAboutRepair,
    creatDevRepair,
    creatSimpleDevRepair,
    getGoodsDocList,
    getMaterialList,
    getAreaList,
    getPlantPositionList
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

export interface IRepairWord {
  docId: number; //文档ID
  title: string; //文档标题
  docType: string; //文件类型
  docSize: string; //文件大
  docDescribe: string; //文档描述
  classId: number; //分类ID
  className: string; //分类名称
  levelId: number; //上级分类ID
  levelName: string; //上级分类
  docUrl: string; //文档下载地址
  previewUrl: string; //文档预览地址
  canPreview: number; //是否支持预览
  docStatus: number; //文档状态
  createUserId: number; //创建人ID
  createUserName: string; //创建人姓名
  createTime: string; //创建时间
}
