<template>
    <v-container grid-list-lg>
        <v-layout row wrap>
            <v-flex xs12
                    v-for="n in 4"
                    :key="n">
                <v-card v-bind:class="[bgColor[n%4],'darken-2']" class="white--text">
                    <v-card-title primary-title>
                        <div>
                            <div class="headline">Software development</div>
                            <span>Listen to your favorite artists and albums whenever and wherever, online and offline.</span>
                        </div>
                    </v-card-title>
                    <v-card-actions>
                        <v-btn flat dark>Choose now</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "chooseType",
        layout: 'common',
        data () {
            return {
                iconList: [
                    'category',
                    'extension',
                    'donut_small',
                    'explore'
                ],
                bgColor: [
                    'lime',
                    'blue-grey',
                    'teal',
                    'light-green'

                ]
            }
        }
    }
</script>

<style scoped>
</style>