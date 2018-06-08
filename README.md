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

- Setup Mqtt using ```vue-mqttsocket``` on Nuxt : [Link](https://medium.com/@iman.tabrizian/connecting-nuxt-js-to-mqtt-1a6252842992)
    - Note: ```mqtt.js``` should be
        ```
        import Vue from 'vue'
        import Mqtt from 'vue-mqttsocket'

        if (process.browser) {
            Vue.use(Mqtt, {uri: 'ws://localhost:9001'})
        }
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
