export const APP_CONFIG = {
	appId: '6369017490',
	secretKey: '7807ea6d77c16b4b40f041b5db41a748ea6ace74',
	format: 'json',
	signMethod: 'md5',
	version: '2.0.0.1',
};
// 公司
export const BASE_API = "http://192.168.8.6:8060";
// 水厂
// export const BASE_API = 'http://168.1.7.63:8060';
// export const BASE_API = "https://168.1.7.63:443";
// 远程
// export const BASE_API = 'http://192.168.8.110:8060';
// export const BASE_API = 'http://42.192.142.240:8060';

// localstorage 别名
export const LOCALSTORAGE_CONFIG = {
	userInfo: 'userInfo',
	// tokenObj: {expiresIn,token, refreshToken}
	tokenObj: 'tokenObj',
};

// 订单状态映射 （巡检｜保养）
export const ORDER_STATUS = (index) => {
	let status = 0;
	switch (index) {
		case 0:
			// 待接单
			status = 0;
			break;
		case 1:
			// 20 已抢单/待执行
			status = 20;
			break;
		case 2:
			// 30 已完成/待验收
			status = 30;
			break;
		case 3:
			// 100 完成
			status = 100;
			break;
		case 4:
			//120 关闭
			status = 120;
			break;
		default:
			status = 0;
			break;
	}
	return status;
};

// 订单状态映射 (维修)
export const ORDER_STATUS_WX = (index) => {
	let status = 0;
	switch (index) {
		case 0:
			// 0 待审核
			status = 0;
			break;
		case 1:
			// 10 已审核/待执行
			status = 20;
			break;
		case 2:
			//  30 已完成/待验收
			status = 30;
			break;
		case 3:
			// 100 完成
			status = 100;
			break;
		case 4:
			//120 关闭
			status = 120;
			break;
		default:
			status = 0;
			break;
	}
	return status;
};

// 派单状态映射
// 0：待接单（巡检、保养） 待审核（维修）
// 8：巡检、保养接单超时
// 10：已审核，班组长派单（维修）
// 20：已抢单，待执行（巡检、保养） 已派单，待执行（维修）
// 22：待验收，验收退回整改
// 23：已验收，水厂审核退回整改（维修）
// 28: 巡检、保养、维修完工反馈超时
// 30：已完成，待验收
// 50：已验收，待水厂审核（维修）
// 100：完成
// 120：订单关闭
export const ORDER_STATUS_VALUE = (index) => {
	let value = '';
	switch (index) {
		case 0:
			value = '待接单';
			break;
		case 8:
			value = '订单超时';
			break;
		case 10:
			value = '待执行';
			break;
		case 20:
			value = '已抢单';
			break;
		case 22:
			value = '待验收';
			break;
		case 23:
			value = '已验收';
			break;
		case 28:
			value = '完工超时';
			break;
		case 30:
			value = '待验收';
			break;
		case 50:
			value = '待审核';
			break;
		case 100:
			value = '完成';
			break;
		case 120:
			value = '订单关闭';
			break;
		default:
			value = '';
			break;
	}
	return value;
};
export const ORDER_STATUS_VALUE_WX = (index) => {
	let value = '';
	switch (index) {
		case 0:
			value = '待审核';
			break;
		case 8:
			value = '订单超时';
			break;
		case 10:
			value = '待班长审核';
			break;
		case 20:
			value = '待执行';
			break;
		case 22:
			value = '整改退回';
			break;
		case 23:
			value = '整改退回';
			break;
		case 28:
			value = '完工超时';
			break;
		case 30:
			value = '待验收人员审核';
			break;
		case 50:
			value = '待水厂领导审核';
			break;
		case 100:
			value = '完成';
			break;
		case 120:
			value = '订单关闭';
			break;
		default:
			value = '';
			break;
	}
	return value;
};

export const returnStatusWXStr = (orderStatus) => {
	let str = '';
	switch (orderStatus) {
		case 0:
			str = '待审核';
			break;
		case 10:
			str = '待维修';
			break;
		case 30:
			str = '待验收人员审核';
			break;
		case 50:
			str = '待水厂领导审核';
			break;
		default:
			str = '';
	}
	if (str) {
		return `(${str})`;
	} else {
		return '';
	}
};
