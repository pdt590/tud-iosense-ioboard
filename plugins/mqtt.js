import Vue from 'vue'
import Mqtt from 'vue-mqtt'

const options =  {
    clientId: 'WebClient-' + parseInt(Math.random() * 100000)
}

Vue.use(Mqtt, 'ws://192.168.1.15:9001', options)
