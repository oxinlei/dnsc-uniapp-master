import { defineStore } from "pinia";

type StateType = {
  data:
    | {
        userId: number;
        userName: string;
        roleName: string;
        roleAuthority: string;
        realName: string;
        headImg: string;
      }
    | {};
  // 选择审核人等等数据..
  selectPersonnelData:
    | {
        userId: number;
        realName: string;
      }[]
    | [];
};

// storeToRefs
export const useUserStore = defineStore("user", {
  state: (): StateType => ({
    data: {},
    selectPersonnelData: [],
  }),
  getters: {},
  actions: {
    setData<T extends keyof StateType>({ key, value }: { key: T; value: any }) {
      this[key] = value;
    },
  },
  // 开启数据持久化
  persist: true,
});
