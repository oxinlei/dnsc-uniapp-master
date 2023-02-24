import { useGetRequest, usePostRequest } from '@/hooks/useRequest';
import { APP_CONFIG, LOCALSTORAGE_CONFIG } from '@/config/baseConfig';
import { reactive, Ref } from 'vue';
import useHomeStore from '@/store/useHomeStore';

export interface IOrderRes {
  inspectIncomplete: number; //巡检未完成数
  inspectNoReceived: number; //巡检待接单数
  inspectNoExecute: number; //巡检待执行数
  inspectNoAccept: number; //巡检待验收数
  inspectComplete: number; //巡检已完成数
  inspectTotal: number; //巡检总数
  maintainIncomplete: number; //保养未完成数
  maintainNoReceived: number; //保养待接单数
  maintainNoExecute: number; //保养待执行数
  maintainNoAccept: number; //保养待验收数
  maintainTotal: number; //保养总数
  maintainComplete: number; //巡检已完成数
  repairIncomplete: number; //维修未完成数
  repairNoExamine: number; //维修待审核数
  repairNoExecute: number; //维修待执行数
  repairNoAccept: number; //维修待验收数
  repairComplete: number; //维修已完成数
  repairClose: number; //维修已关闭数
  repairTotal: number; //维修总数
}

export function useHome() {
  const state = reactive({
    inspectionData: {
      bgImgUri: './images/home-list-bg1.png',
      data: [
        {
          label: '全部',
          value: 0,
          index: 0,
        },
        {
          label: '待接单',
          value: 0,
          index: 1,
        },
        {
          label: '待执行',
          value: 0,
          index: 2,
        },
        {
          label: '待验收',
          value: 0,
          index: 3,
        },
        {
          label: '完成',
          value: 0,
          index: 4,
        },
      ],
    },
    maintainData: {
      bgImgUri: './images/home-list-bg2.png',
      data: [
        {
          label: '全部',
          value: 0,
          index: 0,
        },
        {
          label: '待接单',
          value: 0,
          index: 1,
        },
        {
          label: '待执行',
          value: 0,
          index: 2,
        },
        {
          label: '待验收',
          value: 0,
          index: 3,
        },
        {
          label: '完成',
          value: 0,
          index: 4,
        },
      ],
    },
    repairData: {
      bgImgUri: './images/home-list-bg3.png',
      data: [
        {
          label: '全部',
          value: 0,
          index: 0,
        },
        {
          label: '待审核',
          value: 0,
          index: 1,
        },
        {
          label: '待执行',
          value: 0,
          index: 2,
        },
        {
          label: '待验收',
          value: 0,
          index: 3,
        },
        {
          label: '完成',
          value: 0,
          index: 4,
        },
        {
          label: '关闭',
          value: 0,
          index: 5,
        },
      ],
    },
  });

  // 当前运维汇总
  function getOrderSummary() {
    useGetRequest<IOrderRes>('/order/getOrderSummary', {}).then((res) => {
      filterInspectOrderValue(res.data);
      filterMaintainOrderValue(res.data);
      filterRepairOrderValue(res.data);
    });
  }
  // 获取消息记录分页列表
  function getMessageLogPageList(params) {
    return new Promise((resolve, reject) => {
      useGetRequest('message_log/getMessageLogPageList', params).then((res) => {
        resolve(res);
      });
    })
  }
  // 当前运维汇总 红点
  function getOrderSummaryDot() {
    const _uhs = useHomeStore();
    useGetRequest<IOrderRes>('order/getOrderSummary', {}).then((res) => {
      const {
        inspectNoReceived,
        inspectNoExecute,
        inspectNoAccept,
        maintainNoReceived,
        maintainNoExecute,
        maintainNoAccept,
        repairNoExamine,
        repairNoExecute,
        repairNoAccept,
      } = res.data as IOrderRes;
      const inspectionDot =
        inspectNoReceived + inspectNoExecute + inspectNoAccept;
      const maintainDot =
        maintainNoReceived + maintainNoExecute + maintainNoAccept;
      const repairDot = repairNoExamine + repairNoExecute + repairNoAccept;
      const shenHeDot =
        inspectNoAccept + maintainNoAccept + repairNoExamine + repairNoAccept;
      _uhs.setData({ key: 'inspectionDot', value: inspectionDot });
      _uhs.setData({ key: 'maintainDot', value: maintainDot });
      _uhs.setData({ key: 'repairDot', value: repairDot });
      _uhs.setData({ key: 'shenHeDot', value: shenHeDot });
      if (shenHeDot) {
        uni.setTabBarBadge({
          //显示数字
          index: 1,
          text: shenHeDot.toString(),
        });
      } else {
        uni.removeTabBarBadge({
          index: 1,
        });
      }
    });
  }
  // 移动端首页运维年、月、日汇总
  function getOrderTimeSummary(params) {
    return new Promise((resolve, reject) => {
      useGetRequest<IOrderSummary>('order/getOrderTimeSummary', params).then(
        (res) => {
          resolve(res.data);
        }
      );
    });
  }

  function filterInspectOrderValue(d: any) {
    state.inspectionData.data.forEach((item) => {
      switch (item.label) {
        case '全部':
          item.value = d.inspectTotal - d.inspectIncomplete;
          break;
        case '待接单':
          item.value = d.inspectNoReceived;
          break;
        case '待执行':
          item.value = d.inspectNoExecute;
          break;
        case '待验收':
          item.value = d.inspectNoAccept;
          break;
        case '完成':
          item.value = d.inspectComplete;
          break;
        default:
          item.value = 0;
      }
    });
  }
  function filterMaintainOrderValue(d: any) {
    state.maintainData.data.forEach((item) => {
      switch (item.label) {
        case '全部':
          item.value = d.maintainTotal - d.maintainIncomplete;
          break;
        case '待接单':
          item.value = d.maintainNoReceived;
          break;
        case '待执行':
          item.value = d.maintainNoExecute;
          break;
        case '待验收':
          item.value = d.maintainNoAccept;
          break;
        case '完成':
          item.value = d.maintainComplete;
          break;
        default:
          item.value = 0;
      }
    });
  }

  function filterRepairOrderValue(d: any) {
    state.repairData.data.forEach((item) => {
      switch (item.label) {
        case '全部':
          item.value = d.repairTotal - d.repairIncomplete;
          break;
        case '待审核':
          item.value = d.repairNoExamine;
          break;
        case '待执行':
          item.value = d.repairNoExecute;
          break;
        case '待验收':
          item.value = d.repairNoAccept;
          break;
        case '完成':
          item.value = d.repairComplete;
          break;
        case '关闭':
          item.value = d.repairClose;
          break;
        default:
          item.value = 0;
      }
    });
  }
  // tabIndex转状态码
  function tabIndexToStatus(status: number | Ref<number>) {
    //维修状态 0：待审核  10：已审核，班组长派单  20：已派工，待执行 30：已完成，待验收   50：已验收，待水厂审核 100：完成  120：订单关闭
    switch (status) {
      // 待接单
      case 1:
        return 0;
      // 待执行
      case 2:
        return 20;
      // 待验收
      case 3:
        return 30;
      // 已完成
      case 4:
        return 100;
      // 已关闭
      case 5:
        return 120;
      default:
        return 0;
    }
  }

  return {
    getOrderSummary,
    tabIndexToStatus,
    getOrderTimeSummary,
    getOrderSummaryDot,
    getMessageLogPageList,
    state,
  };
}

export interface IOrderSummary {
  total: number; //运维单总数
  timeliness: number; //及时率
  completeRate: number; //完成率
  overtimeTotal: number; //超时总数
  inspectionTotal: number; //巡查超时数
  maintainTotal: number; //维保超时数
}
