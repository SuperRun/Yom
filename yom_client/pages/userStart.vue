<template>
    <v-container fluid px0>
        <img src="/user/startpage.jpg">
        <v-toolbar
                :clipped-left="clipped"
                fixed
                app
        >
            <v-toolbar-side-icon/>
            <v-btn
                icon
            >
            </v-btn>
            <v-toolbar-title v-text="title" />
            <v-spacer />
            <v-btn
                icon
            >
                <v-icon>menu</v-icon>
            </v-btn>
        </v-toolbar>

        <v-layout>

        </v-layout>
    </v-container>
</template>

<script>
    export default {
        layout: 'common',
        data(){
            return {
                title: "YOM"
            }
        }
    }
</script>
<style>
    #bg-img{
        width: 100%;
    }
</style>
