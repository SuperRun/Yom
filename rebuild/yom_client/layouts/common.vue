<template>
    <v-app style="background-color: #fafafa">
        <v-layout row
                  align-center
                  fixed
                  class="themeColor" style="max-height: 7% !important;">
            <v-flex xs2>
                <v-btn icon @click="goBack">
                    <v-icon color="#ffffff">keyboard_backspace</v-icon>
                </v-btn>
            </v-flex>
            <v-flex xs8
                    text-xs-center
                    title
                    class="white--text">
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
        data() {
            return {
                titleMap: new Map([
                        ["chooseType", "Choose Type"],
                        ["detail", "Detail"],
                        ["preview", "Preview"],
                        ["project", "My Project"],
                        ["search", "Search"]
                    ]
                )
            }
        },
        computed:{
            title: function () {
                return this.titleMap.get(this.$route.name.split('-')[0]);
            }
        },
        methods: {
            goBack(){
                if (this.title === 'My Project') {
                    this.$router.replace('/userStart');
                }else{
                    this.$router.go(-1);
                }

            }
        }
    }
</script>

<style scoped>

</style>