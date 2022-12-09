import axiosAdapterUniapp from 'axios-adapter-uniapp';
import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInstance,
} from 'axios';
import { BASE_API, APP_CONFIG, LOCALSTORAGE_CONFIG } from '@/config/baseConfig';
import qs from 'qs';
import MD5 from 'crypto-js/md5';

interface Result {
  code: number;
  message: string;
}

interface ResultData<T = any> extends Result {
  data?: T;
}

// 从localStorage中获取token，token存的是object信息，有expiresIn,token, refreshToken字段
export function getToken() {
  return new Promise((resolve, reject) => {
    uni.getStorage({
      key: LOCALSTORAGE_CONFIG.tokenObj,
      success: function (res: any) {
        const { data } = res;
        resolve(JSON.parse(data));
      },
      fail: function (res) {
        reject(res);
      },
    });
  });
}

export const headerOption = {
  app_id: APP_CONFIG.appId,
  sign_method: APP_CONFIG.signMethod,
  version: APP_CONFIG.version,
  format: APP_CONFIG.format,
};
const axiosConfg = {
  baseURL: BASE_API,
  timeout: 10 * 1000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    ...headerOption,
  },
  adapter: axiosAdapterUniapp,
};

export function sign(header: object, body?: any): string {
  let b = body || {};
  for (let v in b) {
    if (b[v] === undefined || b[v] === null || b[v] === '') {
      delete b[v];
    }
  }
  let concat = {
    ...header,
    ...b,
  };
  let obj: any = {};
  Object.keys(concat)
    .sort()
    .forEach(function (key) {
      obj[key] = concat[key];
    });

  let str = '';

  for (let key in obj) {
    str += key + obj[key];
  }

  let sign = APP_CONFIG.secretKey + str + APP_CONFIG.secretKey;
  return MD5(sign).toString();
}

export class RequestHttp {
  service: AxiosInstance;
  isRefreshing: boolean;
  requests: any;
  public constructor(config: AxiosRequestConfig) {
    // 实例化axios
    this.service = axios.create(config);
    // 是否正在刷新的标记
    this.isRefreshing = false;
    // 重试队列，每一项将是一个待执行的函数形式
    this.requests = [];
    this.requestUse();
    this.resultUse();
  }
  // 给实例添加一个setToken方法，用于登录后方便将最新token动态添加到header，同时将token保存在localStorage中
  setToken = (obj: any) => {
    // @ts-ignore
    this.service.defaults.headers['access_token'] = obj.token;
    const tokenObj = {
      token: obj.accessToken,
      refreshToken: obj.refreshToken,
      timeout: Math.round(new Date().getTime() / 1000) + obj.expiresIn,
    };
    uni.setStorage({
      key: LOCALSTORAGE_CONFIG.tokenObj,
      data: JSON.stringify(tokenObj),
      success: function () {},
    });
  };
  // 签名算法

  // 刷新token
  async refreshToken(params: any) {
    // instance是当前request.js中已创建的axios实例
    return this.service
      .get(
        `/login/refreshAccessToken?accessToken=${params.accessToken}&refreshToken=${params.refreshToken}&format=${params.format}`
      )
      .then((res) => res);
  }
  // 请求拦截器
  requestUse() {
    this.service.interceptors.request.use(
      async (config: AxiosRequestConfig) => {
        const { url, method, params, data } = config;
        if (!url?.includes('getOrderSummary')) {
          uni.showLoading({ mask: true });
        }
        if (
          url!.indexOf('login/refreshAccessToken') >= 0 ||
          url!.indexOf('login') >= 0
        ) {
          config.data = qs.stringify(config.data);
          return config;
        }

        const tokenObj: any = await getToken();
        config.headers!['access_token'] = tokenObj.token;
        let head = {
          timestamp: Math.round(new Date().getTime() / 1000),
          access_token: tokenObj.token,
        };
        config.headers!['timestamp'] = head.timestamp;
        // let tmpHeaders: any = {};
        let paramsData: any = null;

        paramsData = method === 'get' ? params : data;
        config.headers!['sign'] = sign(
          { ...headerOption, ...head },
          paramsData
        );
        if (method === 'post') {
          config.data = qs.stringify(paramsData);
        }
        if (tokenObj.token && tokenObj.timeout) {
          // 当前时间 >= 超时时间交换refshtoken
          if (head.timestamp >= tokenObj.timeout) {
            // 立即刷新token
            if (!this.isRefreshing) {
              this.isRefreshing = true;
              const p = {
                accessToken: tokenObj.token,
                refreshToken: tokenObj.refreshToken,
                format: APP_CONFIG.format,
              };
              this.refreshToken(p)
                .then((res: any) => {
                  let { accessToken } = res;
                  this.setToken(res);
                  this.isRefreshing = false;
                  return accessToken;
                })
                .then((accessToken: any) => {
                  this.requests.forEach((cb: any) => cb(accessToken));
                  // 执行完成后，清空队列
                  this.requests = [];
                })
                .catch((res: any) => {
                  console.error('refresh token error: ', res);
                });
            }

            const retryOriginalRequest = new Promise((resolve) => {
              this.requests.push((accessToken: string) => {
                // 因为config中的token是旧的，所以刷新token后要将新token传进来
                config.headers!['access_token'] = accessToken;
                let newHead = {
                  timestamp: Math.round(new Date().getTime() / 1000),
                  access_token: accessToken,
                };
                config.headers!['sign'] = sign(
                  {
                    ...headerOption,
                    ...newHead,
                  },
                  paramsData
                );
                config.headers!['timestamp'] = newHead.timestamp;
                resolve(config);
              });
            });
            return retryOriginalRequest;
          }
        }

        return config;
      },
      (error: AxiosError) => {
        // 请求报错
        Promise.reject(error);
      }
    );
  }

  jumpLogin(message: string) {
    uni.showToast({
      title: message,
      icon: 'none',
    });
    uni.reLaunch({
      url: '/pages/login/login',
    });
  }
  // 响应拦截
  resultUse() {
    this.service.interceptors.response.use(
      (response: AxiosResponse) => {
        const { code, message } = response.data;
        uni.hideLoading();
        if (code === 0) {
        } else if (code === 112) {
          this.jumpLogin(message);
          return Promise.reject(message);
        } else {
          uni.showToast({
            title: message,
            icon: 'none',
          });
          return Promise.reject(message);
        }
        return response.data;
      },
      (error: AxiosError) => {
        uni.hideLoading();
        this.jumpLogin('网络异常！');
        return Promise.reject(error);
      }
    );
  }
}

function useGetRequest<T>(
  url: string,
  params?: object
): Promise<ResultData<T>> {
  return new RequestHttp(axiosConfg).service.get(url, { params });
}
function usePostRequest<T>(url: string, data?: object): Promise<ResultData<T>> {
  return new RequestHttp(axiosConfg).service.post(url, data);
}

export { useGetRequest, usePostRequest };
