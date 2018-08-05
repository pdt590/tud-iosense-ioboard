<template>
    <section class="container">
        <div>
            <h2>
                Lamp List
            </h2>
            <br>
            <v-list>
                <v-list-tile
                    v-for="(lamp,i) in lampList"
                    :key= i
                >
                    <v-list-tile-action>
                        <v-icon v-if="!lamp.title" color="pink">star</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content style="margin-right: 50px; width: 120px">
                        <v-list-tile-title v-text="lamp.lampName"></v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-content style="margin-right: 50px; width: 120px">
                        <v-list-tile-title v-text="lamp.lampUrl"></v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-content style="margin-right: 50px; width: 120px">
                        <v-list-tile-title v-text="lamp.lampState"></v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action style="margin-right: 50px; width: 120px">
                        <v-btn v-if="!lamp.title" medium color="success" @click="onConnect(lamp.lampUrl)">Connect</v-btn>
                    </v-list-tile-action>
                </v-list-tile>
            </v-list>
            <br><br>
            <h2>
                Cube-It List
            </h2>
            <br>
            <v-list>
                <v-list-tile
                    v-for="(cube,i) in cubeList"
                    :key= i
                >
                    <v-list-tile-content style="margin-right: 50px; width: 120px">
                        <v-list-tile-title v-text="cube.cubeId"></v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-content style="margin-right: 50px; width: 120px">
                        <v-list-tile-title v-text="cube.cubeState"></v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-content style="margin-right: 50px; width: 120px">
                        <v-list-tile-title v-text="cube.cubeLampUrl"></v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </div>
    </section>
</template>

<script>
    for(var i = 0, initTemp = 0, initPressure = 100000, size = 50, tempArray = new Array(50), pressureArray = new Array(50); i < size; i++) {
        tempArray[i] = initTemp
        pressureArray[i] = initPressure    
    } 

    export default {
        mqtt: {
            'sensorData' (data, topic) {
                let stringData = String.fromCharCode.apply(null, data)
                let objData = JSON.parse(stringData)
                this.tempData.shift()
                this.tempData.push(objData.temp)
                this.temp = objData.temp

                this.pressureData.shift()
                this.pressureData.push(objData.pressure)
                this.pressure = objData.pressure

                // Print incomming data
                // console.log("Topic: " + topic,"-", "Data: " + stringData)
            },
            'lampList' (data, topic) {
                let stringData = String.fromCharCode.apply(null, data)
                let objData = JSON.parse(stringData)
                //this.lampList = JSON.parse(objData.lampList)
                this.lampList = [{
                    title: true,
                    lampName: "Name",
                    lampUrl: "Lamp ID",
                    lampState: "State"
                }, ...JSON.parse(objData.lampList)]
            },
            'cubeList' (data, topic) {
                let stringData = String.fromCharCode.apply(null, data)
                let objData = JSON.parse(stringData)
                let flag = false
                objData = {...objData, updated: Date.now()}
                //console.log(objData)
                for (let i in this.cubeList) {
                    if (objData.cubeId == this.cubeList[i].cubeId) {
                        this.cubeList[i] = objData
                        flag = true
                    }
                }
                if (!flag) this.cubeList.push(objData)
                let self = this;
                setTimeout(function(){
                    for (let i in self.cubeList) {
                        if((Date.now() - self.cubeList[i].updated) > 5000) {
                            self.cubeList.splice(i,1)
                        }
                    }
                }, 1000)
            }
        },
        async mounted() {
            Promise.all([
                await this.$mqtt.subscribe('sensorData'),
                await this.$mqtt.subscribe('lampList'),
                await this.$mqtt.subscribe('cubeList')
            ])
            
        },
        data() {
            return {
                temp: 0,
                tempData: tempArray,
                pressure: 0,
                pressureData: pressureArray,
                lampList: [],
                cubeList: [{
                    cubeId: "ID",
                    cubeState: "Connected State",
                    cubeLampUrl: "Lamp ID"
                }]
            };
        },
        methods: {
            testPublish() {
                let fakeData = {
                    "temp": Math.floor((Math.random() * 1000) + 1),
                    "pressure": Math.floor((Math.random() * 1000) + 1),
                    "lightState": true
                }
                this.$mqtt.publish('i/sensorProcessing', JSON.stringify(fakeData))
                console.log(JSON.stringify(fakeData))
            },
            testControl() {
                this.lightState = !this.lightState
                let body = {"on": this.lightState}
                this.$axios.$put("http://10.8.0.160/api/ikGFJudEmqoTLcni8oKrisAgj7sR87KHUPpJgDKA/lights/5/state", body)
            },
            switchLight() {
                this.lightState = !this.lightState
                let body = {"on": this.lightState}
                this.$axios.$put("http://10.8.0.160/api/ikGFJudEmqoTLcni8oKrisAgj7sR87KHUPpJgDKA/lights/5/state", body)
                let message = {"lightState": this.lightState }
                this.$mqtt.publish('lightState', JSON.stringify(message))
            },
            onConnect(url) {
                let message = {"lampUrl": url }
                this.$mqtt.publish('lampUrl', JSON.stringify(message))
            }         
        }
    }
</script>

<style>
    .container
    {
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center
    }
</style>