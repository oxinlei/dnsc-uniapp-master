import { defineStore } from 'pinia';

type StateType = {
  tabIndex: number;
  tabListIndex: number;
  inspectionDot: number;
  repairDot: number;
  maintainDot: number;
  shenHeDot: number;
  overTime: number;
};

// storeToRefs
const useHomeStore = defineStore('home', {
  state: (): StateType => ({
    // 0 巡检 1 保养 2 维修
    tabIndex: 0,
    // 0 待接单 1 待执行 2 待验收 3 已完成 4 已取消
    tabListIndex: 0,
    // 巡检红点
    inspectionDot: 0,
    // 维修红点
    repairDot: 0,
    // 保养红点
    maintainDot: 0,
    // 审核红点
    shenHeDot: 0,
    // 超时红点
    overTime: 0,
  }),
  actions: {
    setData<T extends keyof StateType>({ key, value }: { key: T; value: any }) {
      this[key] = value;
    },
  },
  // 开启数据持久化
  persist: true,
});

export default useHomeStore;
