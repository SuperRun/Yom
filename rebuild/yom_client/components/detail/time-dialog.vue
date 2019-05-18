<template>
    <v-dialog v-model="isShow"
              persistent
              max-width="600px">
        <v-card>
            <v-card-title>
                <span class="headline">Change Time Cost</span>
            </v-card-title>
            <v-card-text>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-subheader class="pl-0">Time Cost Value</v-subheader>
                            <v-slider
                                    v-model="slider"
                                    :thumb-size="24"
                                    thumb-label="always"
                                    thumb-color="green darken-1"
                            ></v-slider>
                        </v-flex>
                        <v-flex xs12>
                            <v-textarea
                                    v-model="comment"
                                    outline
                                    label="Comment"
                                    value=""
                                    color="green darken-1"
                            ></v-textarea>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" flat v-on:click="$emit('close-dialog', false)">Close</v-btn>
                <v-btn color="green darken-1" flat @click="saveTimeCost">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import { copyList } from 'assets/js/util'

    export default {
        name: "time-dialog",
        data(){
            return {
                comment: '',
                isShow: true,
                slider: 0
            }
        },
        mounted(){
            this.slider= this.$store.state.newProj.changeTimeCostOptions.slider;
            console.log(this.slider);
        },
        methods:{
            saveTimeCost(){
                let copyCatTree = copyList(this.$store.state.newProj.catTree);
                console.log(this.$store.state.newProj.changeTimeCostOptions);
                let options = this.$store.state.newProj.changeTimeCostOptions;
                options.id = options.changedCatId;
                delete options.changedCatId;
                Object.assign(options, {
                    objs:{
                        timeCost: this.slider,
                        comment: this.comment
                    }
                })
                console.log(options);

                if (options.parentIndex!=-1 && options.childIndex != -1) {
                    this.$store.commit('newProj/setCatTreeNode', options);
                    this.$store.commit('newProj/setCatListNode', options);
                    this.sumTotatTime();
                }
                console.log(this.$store.state.newProj.catTree);
                this.comment='';
                this.$emit('close-dialog', false);
            },
            sumTotatTime () {
                const state = this.$store.state.newProj;
                const store = this.$store;
                store.commit('newProj/setTimeTotal', 0);
                console.log(state.selectedCatsShare);
                for (let i = 0; i < state.selectedCatsShare.length; i++) {
                    for (let cat of state.catList) {
                        if (cat.category) {
                            if (cat.category.id === state.selectedCatsShare[i]) {
                                store.commit('newProj/calculateTimeTotal', cat.category.timeCost);
                                break;
                            }
                        } else {
                            if (cat.id === state.selectedCatsShare[i]) {
                                store.commit('newProj/calculateTimeTotal', cat.timeCost);
                                break;
                            }
                        }
                    }
                }
            },
        }
    }
</script>

<style scoped>

</style>