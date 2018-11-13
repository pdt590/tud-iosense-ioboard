<template>
    <div class="v-demo">
        <!-- Alert -->
        <v-alert
            v-model="alert"
            dismissible
            :type="isAccept ? 'success' : 'warning'"
            style="margin-bottom: 6rem"
        >
            {{ isAccept ? 'Your order is accepted' : 'Your order is cancelled'}}
        </v-alert>
        <!-- Carousel  -->
        <h2 style="padding: 1rem; border: solid 1px">
            BEER MENU
        </h2>
        <no-ssr placeholder="Loading...">
            <carousel-3d ref="mycarousel" :count="slides.length" :width="350" :height="400" :clickable="false">
                <slide v-for="(slide, i) in slides" :index="i" :key="i">
                    <figure>
                        <img :src="`/${slide.img}.jpg`">
                        <figcaption>
                            {{ slide.name }}
                        </figcaption>
                    </figure>
                </slide>
            </carousel-3d>
        </no-ssr>

        <!-- Dialog -->
        <v-dialog
            v-model="dialog"
            width="500"
        >
            <v-card>
                <v-card-title
                    class="headline grey lighten-2"
                    primary-title
                >
                    <span>🍺</span>
                </v-card-title>

                <v-card-text>
                    <h4 class="headline mb-0">Do you agree?</h4>
                </v-card-text>

                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="green lighten-2"
                        dark
                        @click="dialog = false"
                    >
                        I accept
                    </v-btn>
                    <v-btn
                        color="black lighten-2"
                        dark
                        @click="dialog = false"
                    >
                        Cancel
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    
    export default {
        mqtt: {
            'sensorData' (data, topic) {
                const LEFT = 1 
                const RIGHT = 2
                const UP = 3
                const DOWN = 4

                let stringData = String.fromCharCode.apply(null, data)
                let objData = JSON.parse(stringData)
                
                switch(objData.gesture) {
                    case RIGHT:
                        if(this.dialog) {
                            this.isAccept = false
                            this.alert = true
                            setTimeout(() => {
                                this.isAccept = false
                                this.alert = false
                            }, 3000)
                            this.dialog = false
                            break
                        }
                        this.currentIndex = this.currentIndex + 1
                        if(this.currentIndex > (this.slides.length - 1)) this.currentIndex = 0
                        //console.log('LEFT', this.currentIndex)
                        this.$refs.mycarousel.goSlide(this.currentIndex)
                        break
                    case LEFT:
                        if(this.dialog) {
                            this.isAccept = true
                            this.alert = true
                            setTimeout(() => {
                                this.isAccept = false
                                this.alert = false
                            }, 3000)
                            this.dialog = false
                            break
                        }
                        this.currentIndex = this.currentIndex - 1
                        if(this.currentIndex < 0) this.currentIndex = (this.slides.length - 1)
                        //console.log('RIGHT', this.currentIndex)
                        this.$refs.mycarousel.goSlide(this.currentIndex)
                        break
                    case UP:
                        this.dialog = true
                        break
                    default:
                }
            }
        },
        async mounted() {
            Promise.all([
                await this.$mqtt.subscribe('sensorData')
            ])
        },
        data() {
            return {
                slides: [{
                    name: 'Yebisu beer',
                    img: '1'
                }, {
                    name: 'Fruli beer',
                    img: '2'
                }, {
                    name: 'Budweiser beer',
                    img: '3'
                }, {
                    name: 'Heineken beer',
                    img: '4'
                }, {
                    name: 'Tiger beer',
                    img: '5'
                }],
                currentIndex: 0,
                alert: false,
                dialog: false,
                isAccept: false
            }
        },
        methods: {
            goToSlide(index) {
                this.$refs.mycarousel.goSlide(index)
            },
            onSelect() {
                this.dialog = true
            },
            onConnect(data) {
                let message = {"test": data }
                this.$mqtt.publish('test', JSON.stringify(message))
            }         
        }
    }
</script>

<style scoped>
    .v-demo {
        background-color: rgb(250, 250, 250);
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .carousel-3d-container figcaption {
        position: absolute;
        bottom: 0;
        padding: 2rem;
        color: rgb(252, 252, 252);
        font-size: 16px;
        min-width: 100%;
        text-align: end;
        display: flex;
        justify-content: center;
        text-transform: uppercase;
    }
</style>
