<template>
    <v-container grid-list-lg>
        <v-layout row wrap>
            <v-flex xs12
                    v-for="(type,index) in typeList"
                    :key="index">
                <v-card v-bind:class="[bgColor[index%bgColor.length],'darken-2']" class="white--text">
                    <v-card-title primary-title>
                        <div>
                            <div class="headline">{{type.typeName}}</div>
                            <!--<span>Listen to your favorite artists and albums whenever and wherever, online and offline.</span>-->
                        </div>
                    </v-card-title>
                    <v-card-actions>
                        <v-btn :to="`/detail?type=${type.id}`" flat dark>Choose now</v-btn>
                    </v-card-actions>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "chooseType",
        layout: 'common',
        data () {
            return {
                bgColor: [
                    'lime',
                    'blue-grey',
                    'teal',
                    'light-green'
                ]
            }
        },
        async asyncData ({ params }) {
            return await axios.get("http://localhost:1337/projtypes?isActive=1")
                .then((res) => {
                    console.log(res.data);
                    return { typeList: res.data }
            })
        }
    }
</script>

<style scoped>
</style>