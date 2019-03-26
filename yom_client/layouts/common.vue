<template>
    <v-app>
        <v-layout row align-center font-weight-medium class="themeColor">
            <v-flex xs2>
                <v-btn icon>
                    <v-icon color="#ffffff">keyboard_backspace</v-icon>
                </v-btn>
            </v-flex>
            <v-flex xs8 text-xs-center title class="white--text">
                {{title}}
            </v-flex>
            <v-flex xs2>

            </v-flex>
        </v-layout>
        <Nuxt/>
    </v-app>
</template>

<script>
    export default {
        name: "common",
        data(){
            return {
                titleMap: new Map([
                        ["chooseType","Choose Type"],
                        ["detail","Detail"]
                    ]
                )
            }
        },
        computed:{
            title: function () {
                return this.titleMap.get(this.$route.name);
            }
        }
    }
</script>

<style scoped>

</style>