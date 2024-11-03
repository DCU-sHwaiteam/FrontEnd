import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router'

createApp(App).use(store).use(vuetify).use(router).use(loadFonts).mount('#app');