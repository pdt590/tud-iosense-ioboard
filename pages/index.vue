<template>
    <section class="container">
        <div>
            <h2 class="title">
                SmIght System
            </h2>
            <div style="margin-top: 50px;">
                <h4>
                    Status: <span style="color: red"> {{ lightState ? "Detected Human" : "Idle"}} </span>
                </h4>
            </div>
            <div style="padding-top: 50px">
                <div>
                    <h4>TEMP: <span style="color: red"> {{temp}}</span> &#x2103;</h4>
                </div>
                <div>
                    <trend
                        :data="tempData"
                        :gradient="['#6fa8dc', '#42b983', '#2c3e50']"
                        :min="0"
                        :max="50"
                        auto-draw
                        smooth>
                    </trend>
                </div>
            </div>
            <div style="padding-top: 30px">
                <div>
                    <h4>PRESSURE: <span style="color: red">{{pressure}}</span> Pa</h4>
                </div>
                <div>
                    <trend
                        :data="pressureData"
                        :gradient="['#6fa8dc', '#42b983', '#2c3e50']"
                        auto-draw
                        smooth>
                    </trend>
                </div>
            </div>
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
            'lightState' (data, topic) {
                let stringData = String.fromCharCode.apply(null, data)
                let objData = JSON.parse(stringData)
                this.lightState = objData.on
                
                // Print incomming data
                // console.log("Topic: " + topic,"-", "Data: " + stringData)
            }
        },
        async mounted() {
            Promise.all([
                await this.$mqtt.subscribe('sensorData'),
                await this.$mqtt.subscribe('lightState')
            ])    
        },
        data() {
            return {
                temp: 0,
                tempData: tempArray,

                pressure: 0,
                pressureData: pressureArray,

                lightState: false
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
    .title
    {
        font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; /* 1 */
        display: block;
        font-weight: 300;
        font-size: 60px;
        color: #35495e;
        letter-spacing: 1px;
    }
    .subtitle
    {
        font-weight: 300;
        font-size: 20px;
        color: #526488;
        word-spacing: 5px;
        padding-bottom: 15px;
    }
    .links
    {
        padding-top: 15px;
    }
</style>
