<template>
	<view class="content">
    <view class="wrap-box">
			<ListRow isBorder title="编号" :content="state.data.id" />
			<ListRow isBorder title="短信内容" :content="state.data.msgContent" />
      <ListRow isBorder title="接收人" :content="state.data.recipientName" />
      <ListRow isBorder title="发送人" :content="state.data.senderName" />
			<ListRow isBorder title="发送时间" :content="moment(state.data.sendTime).format('YYYY-MM-DD HH:mm')" />
		</view>
	</view>
</template>

<script lang="ts" setup>
import ListRow from "@/component/ListRow.vue";
import { reactive } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import moment from "moment";
import { MessageDetail } from "@/hooks/useHome";
const state = reactive({
  data: [] as MessageDetail[]
});
onLoad((opts: any) => {
	state.data = JSON.parse(decodeURIComponent(opts.data))
})
</script>
<style scoped lang="scss">
.content{
  padding-bottom: 40px;
}
.demo-uni-row{
  display: flex;
  justify-content: space-between;
}
::v-deep .van-button{
  width: 100%;
}
</style>
