<template>
    <v-flex xs12>
        <v-card color="white" >
            <v-card-text v-for="(cat,index) in catTree"
                         :key="index">
                <v-layout column>
                    <v-flex xs12>
                        <h2 class="themeColor--text">{{index+1}}.{{cat.category ? cat.category.catName : cat.catName}}</h2>
                    </v-flex>
                    <v-flex xs12
                            v-for="(child,j) in cat.childNodes"
                            :key="j">

                        <v-layout row>
                            <v-flex xs10 class="checkboxMargin">
                                <v-checkbox v-model="selectedCats"
                                            :label="`${child.category ? child.category.catName : child.catName}`"
                                            :value="child.category ? child.category.id : (child.id?child.id:child.catId)"
                                            hide-details
                                            class="checkboxHeight"
                                ></v-checkbox>
                            </v-flex>
                            <v-flex xs2>
                                <div class="timeCost"
                                     @click="changeTimeCost(child,index,j)">
                                    {{child.category ? child.category.timeCost : child.timeCost}}h
                                </div>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>

            </v-card-text>
            <v-layout ma-0
                      column
                      px-1>
                <v-flex xs12>
                    <v-divider></v-divider>
                </v-flex>
                <v-flex xs12
                        align-self-end>
                    <div>
                        <span class="grey--text text--darken-1">Total Time: </span>
                        <span class="grey--text text--darken-1">{{timeTotal || '0'}} h</span>
                    </div>
                </v-flex>
            </v-layout>
            <v-layout column
                      align-center
                      justify-center
                      pb-2>
                <v-btn class="themeColor btn white--text mx-auto" @click="preview">Preview</v-btn>
            </v-layout>
        </v-card>
    </v-flex>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex'
    const { mapMutations, mapGetters } = createNamespacedHelpers('newProj')

    export default {
        name: "proj-cats",
        data(){
            return{
                selectedCats: []
            }
        },
        watch:{
            selectedCats () {
                console.log('wathcing selectedCats...',this.selectedCats);
                this.setSelectedCatsShare(this.selectedCats);
                this.sumTotatTime();
            },
            selectedCatsShare(){
                this.selectedCats = this.selectedCatsShare
            }
        },
        computed: {
            ...mapGetters([
                'selectedCatsShare',
                'catTree',
                'catList',
                'timeTotal'
            ]),
            id: function() {
                return this.$route.params.id || '';
            }
        },
        mounted(){
            if (this.selectedCatsShare.length){
                this.selectedCats = this.selectedCatsShare;
            }
        },
        methods: {
            ...mapMutations ([
                'setSelectedCatsShare',
                'setTimeTotal',
                'calculateTimeTotal',
                'convertCheckedCatTree',
                'initData',
                'setChangeTimeCostOptions',
            ]),
            sumTotatTime () {
                const vm = this;
                vm.setTimeTotal(0);
                for (let i = 0; i < vm.selectedCats.length; i++) {
                    for (let cat of vm.catList) {
                        if (cat.category) {
                            if (cat.category.id === vm.selectedCats[i]) {
                                vm.calculateTimeTotal(cat.category.timeCost);
                                break;
                            }
                        } else {
                            if (cat.id === vm.selectedCats[i] || cat.catId === vm.selectedCats[i]) {
                                vm.calculateTimeTotal(cat.timeCost);
                                break;
                            }
                        }
                    }
                }
            },
            changeTimeCost (cat, parentIndex, childIndex) {
                this.$emit('change-timecost');
                const options = {
                    parentIndex,
                    childIndex,
                    slider: cat.category ? cat.category.timeCost : cat.timeCost,
                    changedCatId: cat.id,
                    comment: cat.category ? cat.category.comment : cat.comment
                }

                this.setChangeTimeCostOptions(options)

            },
            preview(){
                this.setSelectedCatsShare(this.selectedCats);
                this.convertCheckedCatTree();
                const url = this.id ? `/preview/${this.id}` : '/preview';
                this.$router.push(url);
            }
        }
    }
</script>

<style scoped>

</style>