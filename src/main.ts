import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from '@/router'
import './assets/basic.css'
import 'element-plus/dist/index.css'


const app = createApp(App)
app.use(ElementPlus)
app.use(router)

app.mount('#app')
  .$nextTick(() => {
    postMessage({ payload: 'removeLoading' }, '*')
  })
