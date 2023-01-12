import { reactive, readonly } from 'vue';
import {
  headerOption,
  sign,
  getToken,
  useGetRequest,
  usePostRequest,
} from './useRequest';

export function usePersonnel() {
  const state = reactive({});

  // 获取指定人员
  // 指定类型 0：保养人员 1：巡检人员 2：维修人员 3：维修审核人员 4：维修验收人员 5：维修水厂意见审核人员 6：财务通知人员 7：班长
  function getUserMaintenanceList(params: IMaintenanceParams) {
    return new Promise((resolve, reject) => {
      useGetRequest<IPersonnelRes>('user/getUserMaintenanceList', params).then(
        (res) => {
          resolve(res.data);
        }
      );
    });
  }
  // 获取所有人员
  function getUserList() {
    return new Promise((resolve, reject) => {
      useGetRequest<IPersonnelRes>('user/getUserList', {}).then((res) => {
        resolve(res.data);
      });
    });
  }
  // 获取多个指定人员
  function getUserMaintenanceLists(
    params: { readonly key: string; readonly value: number }[]
  ) {
    let data = {};
    params.forEach(async (item, index) => {
      data[item.key] = await getUserMaintenanceList({
        maintenanceType: item.value,
        departmentId: ''
      });
    });

    return data as any;
  }
  // 获取所有部门信息
  function getDepartmentList() {
    return new Promise((resolve, reject) => {
      useGetRequest<DepartmentList>('department/getDepartmentList', { levelId: 0 }).then((res) => {
        resolve(res.data);
      });
    });
  }
  //修改人员密码
  function editUserPassWord(data) {
    return new Promise((resolve, reject) => {
      usePostRequest<any>('user/editUserPassWord', data).then((res) => {
        resolve(res.data);
      });
    });
  }
  return {
    state,
    getUserMaintenanceList,
    getUserMaintenanceLists,
    getUserList,
    editUserPassWord,
    getDepartmentList
  };
}

interface IMaintenanceParams {
  maintenanceType: number;
  departmentId: String;
}

export interface IPersonnelRes {
  userId: number; //用户ID
  userName: string; //用户账号
  userPwd: string; //用户密码
  roleId: number; //用户角色
  roleName: string; //角色名称
  roleAuthority: any; //平台功能授权
  realName: string; //姓名
  headImg: string; //头像图片路径
  sex: string; //性别
  departmentId: number; //部门ID
  departmentName: string; //部门名称
  levelId: number; //上级部门ID
  levelName: string; //上级部门名称
  positionId: number; //职务ID
  positionName: string; //职务
  isMaster: number; //是否部门主管0:否 1：是
  isLeader: number; //是否值班领导0:否 1：是
  isAttendance: number; //是否考勤专员0:否 1：是
  isInspection: number; //是否巡检人员0:否 1：是
  isMaintain: number; //是否保养人员0:否 1：是
  isRepair: number; //是否维修角色0:否 1：维修人员 2：审核人员 3：验收人员 4：水厂意见审核人员 5：财务通知人员 6：班长
  mobile: string; //手机号码
  email: string; //邮箱
  emergencyContact: string; //紧急联系人
  emergencyContactTel: string; //紧急联系人电话
  dutyOrder: number; //值班排序
  workOrder: number; //排班班组排序
  status: number; //用户状态0--正常；1--锁定
  createTime: string; //创建时间
}
export interface DepartmentList{
  departmentId: number; //部门ID
  departmentName: string; //部门名称
  levelId: number; //上级部门ID
  levelName: string; //部门名称
  orderNum: number; //排序值
  subList: any;//部门信息

}
