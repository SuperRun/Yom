<template>
    <div id="main">
        <v-layout column justify-space-between id="container">
            <v-flex xs12>
                <v-layout row align-center font-weight-medium>
                    <v-flex xs2>
                        <v-btn icon>
                            <v-icon color="#ffffff">search</v-icon>
                        </v-btn>
                    </v-flex>
                    <v-flex xs10 text-xs-center title class="white--text">
                        Y.O.M
                    </v-flex>
                    <v-flex xs2>
                        <v-btn icon>
                            <v-icon right color="#ffffff">settings</v-icon>
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12></v-flex>
            <v-flex xs12
                    class="lighter"
                    >
                <v-layout column
                          align-center
                          justify-center
                          mt-5
                >
                    <v-flex xs6 class="flex-width">
                        <v-btn to="/chooseType"  class="themeColor white--text btn-width" >Create a new project</v-btn>
                    </v-flex>
                    <v-flex xs6 class="flex-width" mt-4>
                        <v-btn  class="themeColor white--text btn-width">Show my projects</v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </div>

</template>

<script>
    export default {
        data(){
            return {
                title: "YOM"
            }
        }
    }
</script>
<style>
    #main{
        width: 100%;
        height: 100%;
        background-image: url("/user/startpage.jpg");
        background-size: contain;
        flex-direction:column;
        justify-content: space-between;
    }
    #container{
        width: 100%;
        height: 100%;
    }
    .flex-width{
        width: 60%;
    }
    .btn-width{
        width: 100%;
    }
</style>
