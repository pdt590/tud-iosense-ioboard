import Vue from 'vue'
import Mqtt from 'vue-mqttsocket'

if (process.browser) {
    Vue.use(Mqtt, {uri: 'ws://192.168.56.102:9001'})
}