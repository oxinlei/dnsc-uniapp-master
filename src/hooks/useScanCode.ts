export function useScanCode(option) {
  let isFlash = false;

  // 创建一个空的webview
  const webview = plus.webview.open("", "webview", {
    top: "0px",
    width: "100%",
    height: "100%",
    backButtonAutoControl: "close",
    titleNView: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      autoBackButton: true,
      titleColor: "#ffffff",
      titleText: "扫码",
    },
  });

  // 创建barcode
  const barcode = plus.barcode.create(
    "barcode",
    [plus.barcode.QR], // 只扫二维码
    {
      top: "auto",
      left: "auto",
      width: "100%",
      height: "100%",
      position: "static",
      scanbarColor: "#f1c01f",
      frameColor: "#c0ff01",
    }
  );

  // 创建按钮“闪光灯”
  const bFlash = new plus.nativeObj.View(
    "nbutton",
    {
      bottom: "20px",
      left: option.onlyFromCamera ? "30%" : "5%",
      width: "40%",
      height: "44px",
    },
    [
      {
        tag: "rect",
        id: "rect",
        rectStyles: {
          radius: "8px",
          color: "rgba(0,0,0,0.5)",
        },
      },
      {
        tag: "font",
        id: "text",
        text: "闪光灯",
        textStyles: {
          color: "#FFFFFF",
        },
      },
    ]
  );

  // 创建按钮“相册”
  const bAlbum =
    !option.onlyFromCamera &&
    new plus.nativeObj.View(
      "nbutton",
      {
        bottom: "20px",
        left: "55%",
        width: "40%",
        height: "44px",
      },
      [
        {
          tag: "rect",
          id: "rect",
          rectStyles: {
            radius: "8px",
            color: "rgba(0,0,0,0.5)",
          },
        },
        {
          tag: "font",
          id: "text",
          text: "相册",
          textStyles: {
            color: "#FFFFFF",
          },
        },
      ]
    );

  // 控制闪光灯按钮样式
  bFlash.addEventListener(
    "touchend",
    (e) => {
      isFlash = !isFlash;
      isFlash && bFlash.drawText("闪光灯", null, { color: "#00ccff" }, "text");
      !isFlash && bFlash.drawText("闪光灯", null, { color: "#ffffff" }, "text");
      barcode?.setFlash(isFlash);
    },
    false
  );

  // 相册选取图片进行扫码识别
  !option.onlyFromCamera &&
    bAlbum.addEventListener(
      "touchend",
      (e) => {
        plus.gallery.pick((path) => {
          plus.barcode.scan(path, barcode.onmarked, barcode.onerror);
        }, barcode.onerror);
      },
      false
    );

  // 监听webview关闭，将相关控件都进行关闭
  webview.addEventListener("close", () => {
    barcode?.close();
    bFlash?.close();
    bAlbum?.close();
  });

  // 扫码的成功回调：关闭webview，并执行success方法
  barcode.onmarked = async (type, code, file, charset) => {
    webview.close();
    await option.success(code);
  };
  barcode.onerror = async (error) => {
    webview.close();
    await option.fail(error);
  };

  // 将相关控件添加至webview中
  plus.webview.getWebviewById("webview").append(barcode);
  plus.webview.getWebviewById("webview").append(bFlash);
  !option.onlyFromCamera &&
    plus.webview.getWebviewById("webview").append(bAlbum);

  // start
  barcode.start({
    vibrate: true,
  });
}
