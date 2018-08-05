import Vue from 'vue'
import Mqtt from 'vue-mqtt'

const options =  {
    clientId: 'WebClient-' + parseInt(Math.random() * 100000)
}

Vue.use(Mqtt, 'ws://10.8.0.198:9001', options)
