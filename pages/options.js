import Vue from 'vue'
import VueRouter from 'vue-router'
import MuseUI from 'muse-ui'
import Options from './Options.vue'
import '../node_modules/muse-ui/dist/muse-ui.css'
import './assets/material-icons.css'
import './theme'
import '@fortawesome/fontawesome-free/css/fontawesome.css'
import './assets/fontawesome-fonts.css'

import Style from './components/Style.vue'
import WordBlock from './components/WordBlock.vue'
import UserBlock from './components/UserBlock.vue'
import Etcetera from './components/Etcetera.vue'

Vue.use(MuseUI)
Vue.use(VueRouter)

// eslint-disable-next-line no-new
new Vue({ el: 'app',
  render: h => h(Options),
  router: new VueRouter({ routes: [
    { path: '/', component: Style },
    { path: '/style', component: Style },
    { path: '/wordblock', component: WordBlock },
    { path: '/userblock', component: UserBlock },
    { path: '/etc', component: Etcetera },
  ] })
})
