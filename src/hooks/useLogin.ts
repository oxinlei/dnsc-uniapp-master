import { reactive, Ref } from 'vue';
import { useGetRequest, usePostRequest } from '@/hooks/useRequest';
import { APP_CONFIG, LOCALSTORAGE_CONFIG } from '@/config/baseConfig';
import { useUserStore } from '@/store/useUserStore';
import useHomeStore from '@/store/useHomeStore';
interface ILoginForm {
  userName: string;
  userPwd: string;
  code?: string | null;
}

interface ICodeRes {
  code: number;
  logincode: string;
  message: string;
}

interface IUserRes {
  user: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

class Login {
  fromData: ILoginForm;
  public constructor(fromData: ILoginForm) {
    this.fromData = fromData;
  }
  requestCode() {
    const cp = {
      appId: APP_CONFIG.appId,
      secretKey: APP_CONFIG.secretKey,
      format: APP_CONFIG.format,
    };
    useGetRequest<ICodeRes>('login/getCode', cp).then((res) => {
      const d = {
        ...this.fromData,
        // @ts-ignore
        code: res.logincode,
      };
      this.requestLogin(d);
    });
  }

  // 解密userInfo
  hexCharCodeToStr(hexCharCodeStr: string) {
    let trimedStr = hexCharCodeStr.trim();
    let rawStr =
      trimedStr.substr(0, 2).toLowerCase() === '0x'
        ? trimedStr.substr(2)
        : trimedStr;
    let len = rawStr.length;
    if (len % 2 !== 0) {
      alert('Illegal Format ASCII Code!');
      return '';
    }
    let curCharCode;
    let resultStr = [];
    for (let i = 0; i < len; i = i + 2) {
      curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code 值
      resultStr.push(String.fromCharCode(curCharCode));
    }
    return resultStr.join('');
  }
  decode(text: string) {
    if (!text) {
      return '';
    }
    // string to byte[]
    let byteArr = [];
    for (let i = 0; i < text.length; i++) {
      byteArr.push(text.charCodeAt(i));
    }
    let str = '';
    for (let i = 0; i < byteArr.length; ) {
      let binary = byteArr[i].toString(2);
      let head = binary.match(/^1+?(?=0)/);

      if (head && binary.length === 8) {
        let bytesLength = head[0].length;
        let body = binary.slice(bytesLength);
        for (let j = 1; j < bytesLength; j++) {
          body += byteArr[i + j].toString(2).slice(2);
        }
        str += String.fromCharCode(parseInt(body, 2));
        i += bytesLength;
      } else {
        str += String.fromCharCode(byteArr[i]);
        i++;
      }
    }
    return str;
  }
  requestLogin(data: ILoginForm) {
    usePostRequest<IUserRes>('login/chkLogin', data).then((res) => {
      // @ts-ignore
      const { user, accessToken, expiresIn, refreshToken } = res;

      const userData = JSON.parse(this.decode(this.hexCharCodeToStr(user)));
      const tokenObj = {
        token: accessToken,
        refreshToken,
        timeout: Math.round(new Date().getTime() / 1000) + expiresIn,
      };
      uni.setStorage({
        key: LOCALSTORAGE_CONFIG.tokenObj,
        data: JSON.stringify(tokenObj),
      });
      const userStore = useUserStore();
      const _uhs = useHomeStore();
      userStore.setData({ key: 'data', value: userData });
      _uhs.setData({ key: 'tabIndex', value: 0 })
      uni.reLaunch({
        url: '/pages/home/home',
      });
    });
  }
}

export function useLoginForm() {
  const submit = (ref: Ref, formData: ILoginForm) => {
    ref.value
      .validate()
      .then((res: ILoginForm) => {
        const l = new Login(formData);
        l.requestCode();
      })
      .catch((err: { key: string; errorMessage: string }) => {
      });
  };
  return {
    submit,
  };
}
