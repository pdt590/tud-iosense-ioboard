<template>
    <section class="container">
        <div>
            <h2 class="title">
                SmartLight System
            </h2>
            <h3 class="subtitle">
                A Dashboard Implementation for IoSense Project
            </h3>
            <div>
                <b-button variant="succsess" @click.prevent="onPublish">Publish Message</b-button>
            </div>
            <div style="margin-top: 40px; padding-top: 10px; border: solid">
                <h4>
                    Status: <span style="color: red"> Active </span>
                </h4>
            </div>
            <div style="padding-top: 30px">
                <div>
                    <h4>TEMP: <span style="color: red">27</span> &#x2103;</h4>
                </div>
                <div>
                    <trend
                        :data="input"
                        :gradient="['#6fa8dc', '#42b983', '#2c3e50']"
                        auto-draw
                        smooth>
                    </trend>
                </div>
            </div>
            <div style="padding-top: 30px">
                <div>
                    <h3>PRESSURE: <span style="color: red">27</span> Pa</h3>
                </div>
                <div>
                    <trend
                        :data="input"
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
    for(var i = 0, value = 0, size = 300, array = new Array(300); i < size; i++) array[i] = value;
    export default {
        mqtt: {
            'inTopic/#' (data, topic) {
                // Print incomming data
                console.log("Topic: " + topic,"-", "Data: " + String.fromCharCode.apply(null, data))
            }
        },
        async mounted() {
            await this.$mqtt.subscribe('inTopic/#');
        },
        data() {
            return {
                input: array
            };
        },
        methods: {
            onPublish() {
                this.$mqtt.publish('outTopic', 'Hello MQTT from NUXT');
                this.input.shift();
                this.input.push(Math.floor((Math.random() * 1000) + 1));
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
