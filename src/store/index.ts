import { createPinia } from 'pinia';
import piniaPluginPersistedstate, { createPersistedState } from 'pinia-plugin-persistedstate';
// import piniaPersist from 'pinia-plugin-persist-uni';


const pinia = createPinia().use(
	createPersistedState({
		storage: {
			getItem(key: string): string | null {
				return uni.getStorageSync(key)
			},
			setItem(key: string, value: string) {
				uni.setStorageSync(key, value)
			}
		}
	})
);

// const pinia = createPinia();
// pinia.use(piniaPersist);
export default pinia;