<template>
  <view class="container pb-50">
    <view class="wrap-box" style="padding: 10px;">
      <uni-section v-if="type!==''" title="选择部门" type="line">
        <uni-data-select
          v-model="state.value"
          :localdata="state.departmentData"
          @change="searchPeople"
        ></uni-data-select>
      </uni-section>
      <SelectBar v-else :data="state.data" @change="search" field="realName" />
    </view>
    <view class="wrap-box">
      <uni-section
        type="line"
        title="显示不全请左右滑动！！！"
        titleColor="red"
      ></uni-section>
      <uni-table ref="tableRef" border stripe>
        <uni-tr>
          <uni-th width="30" align="center"></uni-th>
          <uni-th width="100" align="center">姓名</uni-th>
          <uni-th align="center">部门</uni-th>
          <uni-th width="100" align="center">职位</uni-th>
        </uni-tr>
        <uni-tr v-for="(item, index) in state.data" :key="index">
          <uni-td>
            <checkbox-group @change="changeCheckbox($event, item)">
              <checkbox
                :value="item.userId.toString()"
                :checked="isChecked(item)"
              />
            </checkbox-group>
          </uni-td>
          <uni-td>{{ item.realName }}</uni-td>
          <uni-td>
            <view class="name">{{ item.departmentName }}</view>
          </uni-td>
          <uni-td align="center">{{ item.positionName }}</uni-td>
        </uni-tr>
      </uni-table>
    </view>
    <view class="flex-footer">
      <uni-row class="demo-uni-row">
        <uni-col :span="24">
          <view class="demo-uni-col dark">
            <button type="primary" @click="save">保存</button>
          </view>
        </uni-col>
      </uni-row>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onLoad, onShow } from '@dcloudio/uni-app';
import { onMounted, provide, reactive, ref } from 'vue';
import SelectBar from '@/component/SelectBar.vue';
import { IPersonnelRes, usePersonnel } from '@/hooks/usePersonnel';
const tableRef = ref<InstanceType<any>>();
const _up = usePersonnel();
const state = reactive({
  data: [] as IPersonnelRes[],
  value: 0 as number,
  departmentData: [] as any,
  checkboxData: [] as IPersonnelRes[],
});
let paramsData = [] as IPersonnelRes[];
let title = '';
let isSingle = false;
let type = ''; // 完成提交 ｜ 未完成提交
onLoad((opts) => {
  _up.getDepartmentList().then((res: any) => {
    state.departmentData = []
    res.forEach((item: any) => {
      let obj = {
        text: item.departmentName,
        value: item.departmentId
      };
      state.departmentData.push(obj)
    });
  });
  state.data = JSON.parse(opts.data!);
  paramsData = JSON.parse(opts.data!);
  isSingle = opts.single ? true : false;
  title = opts.title!;
  type = opts.type ? opts.type : '';
  uni.setNavigationBarTitle({
    title: opts.title || '选择人员',
  });
});
const filterCheckboxData = (item: IPersonnelRes) => {
  const idx = state.checkboxData.findIndex((o) => o.userId === item.userId);
  if (idx === -1) {
    // 不存在
    if (isSingle) {
      // 单选
      state.checkboxData = [item];
    } else {
      state.checkboxData.push(item);
    }
  } else {
    state.checkboxData.splice(idx, 1);
  }
};
// 是否选中checkbox
const isChecked = (item: IPersonnelRes) => {
  const idx = state.checkboxData.findIndex((o) => o.userId === item.userId);
  return idx !== -1;
};
const changeCheckbox = ({ detail }: any, item: any) => {
  filterCheckboxData(item);
};
const search = (val: undefined | IPersonnelRes[]) => {
  if (val === undefined) {
    state.data = paramsData;
  } else {
    state.data = val;
  }
};
const searchPeople = (e: number) => {
  _up.getUserMaintenanceList({ maintenanceType: 0, departmentId: e.toString() }).then((res) => {
    state.data = res as IPersonnelRes[];
  });
};
const save = () => {
  const d = {
    data: state.checkboxData,
    title,
    type,
  };
  uni.$emit('selectPersonnel', d);
  // 同班人员而外处理
  uni.$emit('selectPersonnelTBRY', d);
  uni.navigateBack({
    delta: 1,
  });
};
</script>
<style scoped lang="scss">
::v-deep * .uni-table-tr:nth-child(1) .checkbox__inner {
  display: none;
}
</style>
