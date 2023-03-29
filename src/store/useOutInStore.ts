import { defineStore } from "pinia";

type StateType = {
  selectData: any;
  selectPositionData: any[];
  selectDeviceData: any;
};

// storeToRefs
const useOutInStore = defineStore("inspection", {
  state: (): StateType => ({
    selectData: {},
    selectPositionData: [],
    selectDeviceData: {},
  }),
  actions: {
    setData<T extends keyof StateType>({ key, value }: { key: T; value: any }) {
      this[key] = value;
    },
  },
  // 开启数据持久化
  persist: true,
});

export default useOutInStore;
