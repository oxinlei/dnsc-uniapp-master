import { reactive, readonly } from "vue";
import { IRepairRes } from "./useRepair";
import { headerOption, sign, getToken, useGetRequest } from "./useRequest";

export function useDevHistory() {
  const state = reactive({});

  // 查看设备历史记录
  // planType 派单类型（不传该参数，则为所有） 0：巡检 1：保养 2：维修
  // deviceId 设备id
  function getOrderDeviceList(planType: number, id: number) {
    return new Promise((resolve, reject) => {
      useGetRequest<any>("order/getOrderDeviceList", {
        planType,
        id,
      }).then((res) => {
        resolve(res.data);
      });
    });
  }

  return {
    getOrderDeviceList,
    state,
  };
}
