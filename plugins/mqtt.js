import Vue from 'vue'
import Mqtt from 'vue-mqttsocket'

Vue.use(Mqtt, {uri: 'ws://localhost:9001'})