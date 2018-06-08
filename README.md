# ioboard

> A Dashboard Implementation for IoSense Project

## Build Setup

``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

## Setup MQTT

- Setup Mqtt using ```vue-mqtt``` on Nuxt : [Link 1](https://github.com/nik-zp/Vue-Mqtt) [Link 2](https://github.com/nik-zp/Vue-Mqtt-Example/tree/master/src/components)
    - Note: ```mqtt.js``` should be
        ```
        import Vue from 'vue'
        import Mqtt from 'vue-mqtt'
        
        const options =  {
            clientId: 'WebClient-' + parseInt(Math.random() * 100000)
        }

        Vue.use(Mqtt, 'ws://192.168.56.102:9001', options)
        ```
    - ```nuxt.config.js``` should be
        ```
        plugins: [
            {src: '~/plugins/mqtt.js', ssr: false}
        ],
        ```
- Enable Websocket on Mosquitto:
    - Create ```mosquitto.conf```
        ```
        # this will listen for mqtt on tcp
        listener 1883

        # this will expect websockets connections
        listener 8080
        protocol websockets
        ```
    - Using docker [Link](https://hub.docker.com/_/eclipse-mosquitto/)
        ```
        docker run -it -p 1883:1883 -p 9001:9001 -v mosquitto.conf:/mosquitto/config/mosquitto.conf eclipse-mosquitto
        ```
