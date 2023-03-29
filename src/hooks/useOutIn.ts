import { reactive, readonly } from "vue";
import { IRepairRes } from "./useRepair";
import { headerOption, sign, getToken, useGetRequest, usePostRequest } from "./useRequest";

export function useOutIn() {
  const state = reactive({});
  // 获取所有物料配件
  // groupCode A3：配件 A4：备品/备件 A5：物料 A6：办公用品
  function getMaterialList(groupCode: string) {
    return new Promise((resolve, reject) => {
      useGetRequest<any>("material/getMaterialList", {
        groupCode
      }).then((res) => {
        resolve(res.data);
      });
    });
  }
  // 校正物料配件库存量
  function checkStock(data: any) {
    return new Promise((resolve, reject) => {
      usePostRequest<any>("material/checkStock", data).then((res) => {
        resolve(res.data);
      });
    });
  }
  // 新增出入库信息
  function addStock(data: any) {
    return new Promise((resolve, reject) => {
      usePostRequest<any>("stock/addStock", data).then((res) => {
        resolve(res.data);
      });
    });
  }
  // 二维码扫码
  function scanQrcode(data: { erData: string }) {
    return new Promise((resolve, reject) => {
      usePostRequest<any>("material/scanQrcode", data).then((res) => {
        resolve(res);
      });
    });
  }
  return {
    getMaterialList,
    checkStock,
    addStock,
    scanQrcode,
    state,
  };
}
