<template>
    <section class="container">
        <div>
            <h1 class="title">
                Swimming Safety System
            </h1>
            <h2 class="subtitle">
                A Dashboard Implementation for IoSense Project
            </h2>
            <div>
                <b-button variant="succsess" @click.prevent="onPublish">Publish Message</b-button>
            </div>
        </div>
    </section>
</template>

<script>
    import Logo from '~/components/Logo.vue'

    export default {
        components: {
            Logo
        },
        async mounted() {
            this.$mqtt = await this.$mqtt
        },
        data() {
            return {
            }
        },
        methods: {
            onPublish() {
                this.$mqtt.publish('msg', 'Hello MQTT from NUXT');
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
        text-align: center;
        background: #b3e6ff
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
