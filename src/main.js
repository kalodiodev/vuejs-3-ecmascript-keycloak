import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import auth from './auth'

auth.init()

createApp(App).use(router).mount('#app')
