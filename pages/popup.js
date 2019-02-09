import Vue from 'vue'
import Popup from './Popup.vue'
import MuseUI from 'muse-ui'
import '../node_modules/muse-ui/dist/muse-ui.css'
import './theme'
Vue.use(MuseUI)

// eslint-disable-next-line no-new
new Vue({ el: 'app', render: h => h(Popup) })
