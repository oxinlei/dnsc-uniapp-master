import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
// import copy from 'rollup-plugin-copy';
import path from 'path';

// import Components from 'unplugin-vue-components/vite';
// import { VantResolver } from 'unplugin-vue-components/resolvers';

// import Unocss from 'unocss/vite';
// import { presetUno, presetAttributify, presetIcons } from 'unocss'
// import { UnocssToUni } from 'vite-plugin-unocss-to-uni'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // 打包路径
  plugins: [
    uni(),
    // Components({
    //   resolvers: [VantResolver()],
    // }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        // target: "http://168.1.7.63:8060",
        target: 'https://168.1.7.63:443',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
