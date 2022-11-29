import { defineStore } from 'pinia';

type StateType = {
  data: [];
};

// storeToRefs
const useScanStore = defineStore('inspection', {
  state: (): StateType => ({
    data: [],
  }),
  actions: {
    setData<T extends keyof StateType>({ key, value }: { key: T; value: any }) {
      this[key] = value;
    },
  },
  // 开启数据持久化
  persist: true,
});

export default useScanStore;
