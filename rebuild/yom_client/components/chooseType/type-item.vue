<template>
    <v-layout row wrap>
        <v-flex xs12
                mb-2
                v-for="(type,index) in typeList"
                :key="index">
            <v-card v-bind:class="[bgColor[index%bgColor.length],'darken-2']" class="white--text">
                <v-card-title primary-title>
                    <div>
                        <div class="headline">{{type.typeName}}</div>
                    </div>
                </v-card-title>
                <v-card-actions>
                    <v-btn @click="goToDetail(type.id)" flat dark>Choose now</v-btn>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        name: "type-item",
        props: {
            typeList: Array
        },
        data(){
            return {
                bgColor: [
                    'lime',
                    'blue-grey',
                    'teal',
                    'light-green'
                ]
            }
        },
        methods: {
            goToDetail(id){
                // store.commit('newProj/setCatList',catconfigs);
                this.$store.commit('newProj/initData');
                this.$router.push(`/detail?type=${id}`);
            }
        }
    }
</script>

<style scoped>

</style>