import { useGetRequest, usePostRequest } from "@/hooks/useRequest";
import { reactive, Ref } from "vue";
import { useHome } from "./useHome";
import useHomeStore from "@/store/useHomeStore";

export function useMaintain() {
  const _uh = useHome();
  const _uhs = useHomeStore();
  const state = reactive({});

  // 获取保养派单列表
  function getOrderMaintainList(index: Ref<number> | number, pageIndex = 1) {
    const p: any = {
      index: pageIndex,
      orderStatus: _uh.tabIndexToStatus(index),
    };
    if (_uhs.tabListIndex === 0) {
      delete p.orderStatus;
    } else {
      p.orderStatus = _uh.tabIndexToStatus(index);
    }
    return new Promise((resolve, reject) => {
      useGetRequest<IMaintainRes>("order_maintain/getOrderPageList", p).then(
        (res) => {
          resolve(res.data);
        }
      );
    });
  }
  // 查看指定保养记录
  function getOrderMaintain(id: Ref<string> | string) {
    const p = {
      id,
    };
    return new Promise((resolve, reject) => {
      useGetRequest<IMaintainRes>("order_maintain/getOrderMaintain", p).then(
        (res) => {
          resolve(res);
        }
      );
    });
  }
  // 查看保养派单状态
  function getMaintenanceLogList(id: Ref<string> | string) {
    const p = {
      id,
    };
    return new Promise((resolve, reject) => {
      useGetRequest<IMaintainLogRes>(
        "order_maintain/getMaintenanceLogList",
        p
      ).then((res) => {
        resolve(res.data);
      });
    });
  }
  // 查看同班人员
  function getColleagueList(id: Ref<string> | string) {
    return new Promise((resolve, reject) => {
      useGetRequest<IColleagueListRes>("order_maintain/getColleagueList", {
        id,
      }).then((res) => {
        resolve(res.data);
      });
    });
  }

  // 保养设备反馈
  function optionItem(data: any) {
    return new Promise((resolve, reject) => {
      usePostRequest<any>("order_maintain/optionItem", data).then((res) => {
        resolve(res.data);
      });
    });
  }
  // 二维码解码
  function scanMaintainQrcode(data: { erData: string; orderId: string }) {
    return new Promise((resolve, reject) => {
      usePostRequest("order_maintain/scanQrcode", data).then((res) => {
        resolve(res.data);
      });
    });
  }
  // 完成提交
  function applicationAccept(data: any) {
    return new Promise((resolve, reject) => {
      usePostRequest<any>("order_maintain/applicationAccept", data).then(
        (res) => {
          resolve(res.data);
        }
      );
    });
  }
  // 未完成提交
  function notCompletedSave(data: any) {
    return new Promise((resolve, reject) => {
      usePostRequest<any>("order_maintain/notCompletedSave", data).then(
        (res) => {
          resolve(res.data);
        }
      );
    });
  }
  // 审核通过
  function acceptanceOrder(data: any) {
    return new Promise((resolve, reject) => {
      usePostRequest<any>("order_maintain/acceptanceOrder", data).then(
        (res) => {
          resolve(res.data);
        }
      );
    });
  }
  // 验证巡检单内项目是否完成
  function isMaintenanceItemEnd(id: Ref<string> | string) {
    const p = {
      id,
    };
    return new Promise((resolve, reject) => {
      useGetRequest(
        "order_maintain/isMaintenanceItemEnd",
        p
      ).then((res) => {
        resolve(res.data);
      });
    });
  }
  // 抢单
  function grabbingMaintain(data: { orderId: string }) {
    return new Promise((resolve, reject) => {
      usePostRequest<any>("order_maintain/grabbingMaintain", data).then(
        (res) => {
          resolve(res.data);
        }
      );
    });
  }

  // 返回tabTitle数据
  function tabTitleData() {
    if (_uhs.tabIndex === 0) {
      return _uh.state.inspectionData.data.map((item: any) => item.label);
    } else if (_uhs.tabIndex === 1) {
      return _uh.state.maintainData.data.map((item: any) => item.label);
    } else {
      return _uh.state.repairData.data.map((item: any) => item.label);
    }
  }

  return {
    getOrderMaintainList,
    getOrderMaintain,
    getMaintenanceLogList,
    optionItem,
    scanMaintainQrcode,
    grabbingMaintain,
    applicationAccept,
    acceptanceOrder,
    notCompletedSave,
    tabTitleData,
    getColleagueList,
    isMaintenanceItemEnd,
    state,
  };
}

export interface IMaintainRes {
  id: string;
  orderCode: string; //单号（通用）
  planType: number; //运维类型（通用）0：保养 1：保养 2:维修
  repairType: number; //维修类型（维修）0：正常维修 1：简单维修
  assignType: number; //派单类型（通用）0 手工派单 1 计划派单 2 告警手工派单
  orderName: string; //派单名称（通用）
  planId: string; //计划ID（保养/保养）
  cycleTime: number; //循环周期（保养/保养）0：单次 1：每日 2：每周 3：每月
  isSmsRemind: number; //是否短信提醒（通用）0：否 1：是
  orderDescribe: string; //描述（通用）维修：故障描述 其他：计划内描述
  orderImg: string; //图片（通用）维修：现场图 其他：计划内图片
  orderItemType: number; //运维内容类型0：建筑位置信息（维修派单无设备） 1：维修设备 （单一设备对象） 2：保养、维修计划内容 （数组列表）
  orderItem: Array<any>; //运维内容（通用）
  optionEnd: number; //是否全部完成任务（保养/保养）0：未全部完成 1：已全部完成
  grabbingUserId: string; //当前抢单成功用户ID（保养/保养）
  completeTimeLimit: number; //完成时限（小时）提交验收时间
  engineerLevel: number; //维修级别（维修）1-5级
  feedbackInfo: string; //维修措施（维修）
  feedbackImg: string; //维修图片（维修）多张用逗号隔开
  acceptScore: number; //验收分数（维修）
  acceptImg: string; //验收图片（维修）多张用逗号隔开
  acceptInfo: string; //验收意见/驳回意见（维修）
  isMove: number; //设备是否有移（维修）0：未移动 1：已移动
  lastAcceptScore: number; //水厂评分（维修）1-5分打分
  lastAcceptInfo: string; //水厂意见/驳回意见（维修）
  lastAcceptImg: string; //水厂验收图片（维修）多张用逗号隔开
  orderStatus: number; //0：待接单（保养、保养） 待审核（维修） 8：保养、保养接单超时 10：已审核，班组长派单（维修） 20：已抢单，待执行（保养、保养） 已派单，待执行（维修） 22：待验收，验收退回整改 23：已验收，水厂审核退回整改（维修） 28: 保养、保养、维修完工反馈超时 30：已完成，待验收 50：已验收，待水厂审核（维修） 100：完成 120：订单关闭
  createUser: string; //派单人员（维修）单人
  reviewerUser: string; //审核人员（维修）多人
  noticeUser: string; //通知人员（维修）多人
  chargeUser: string; //班长（维修）单人
  planUser: string; //维修/保养/保养人员（通用）多人
  acceptUser: string; //验收人员（通用）多人
  financeUser: string; //财务人员（维修）单人
  lastAcceptUser: any; //水厂意见审核人员（维修）多人
  overTime: string; //超时时间根据进度更新
  reviewTime: string; //审核时间（维修）
  assignTime: string; //接单时间（维修）班长派工（保养、保养）抢单 Json字符串
  submit_time: string; //提交验收时间（通用）
  acceptTime: string; //验收时间（通用）
  lastAcceptTime: string; //水厂审核时间（维修）
  createTime: string; //创建时间（通用）
  updateTime: string; //更新时间（通用）
  isOption: number; //当前用户执行权限0：不可执行 1：可执行
  optionIds: string; //本流程执行人ID集合（为空，则为任何人）
  alarmId: number; //关联告警ID
}

export interface IMaintainLogRes {
  id: string; //ID
  orderId: string; //单号
  userType: number; //用户类型1：派单人员（维修） 2：审核人员（维修） 3：通知人员（维修） 4：执行部门主管（维修） 5：接单人员/同班人员（保养，保养） 维修人员（维修） 6：验收人员 7：设备移动通知人员（维修） 8：终验（水厂意见审核）审核人员（维修）
  userId: number; //r用户ID
  realName: string; //姓名
  departmentId: string; //部门ID
  departmentName: string; //部门名称
  levelId: string; //上级部门ID
  levelName: string; //上级部门名称
  mobile: string; //手机
  orderStatus: string; //运维状态0：待接单（保养、保养） 待审核（维修） 8：保养、保养接单超时 10：已审核，班组长派单（维修） 20：已抢单，待执行（保养、保养） 已派单，待执行（维修） 22：待验收，验收退回整改 23：已验收，水厂审核退回整改（维修） 28: 保养、保养、维修完工反馈超时 30：已完成，待验收 50：已验收，待水厂审核（维修） 100：完成 120：订单关闭
  optionDescribe: string; //操作描述
  optionTime: string; //记录时间
}

export interface IColleagueListRes {
  userId: string; //保养/保养人员ID
  realName: string; //姓名
  departmentName: string; //部门名称
  levelName: string; //上级部门名称
  positionName: string; //职位
  colleague: any[]; //同班人员列表
  deviceList: any[]; //运维设备
}
