
<template>
    <v-container
            fluid
            grid-list-lg
    >
        <!--<v-alert-->
                <!--:value="warning"-->
                <!--color="warning"-->
                <!--icon="priority_high"-->
                <!--outline-->
                <!--class="warnHeight"-->
        <!--&gt;-->
            <!--Project name is required.-->
        <!--</v-alert>-->

        <v-layout row wrap>
            <v-flex xs12>
                <v-card color="white">
                    <v-card-text>
                        <v-text-field class="mx-auto"
                                      color="themeColor"
                                      label="Project name"
                                      v-model="projName"
                        ></v-text-field>
                        <v-text-field
                                color="themeColor"
                                label="Some more info you want tell us"
                                append-icon="edit"
                                v-model="description"
                        ></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>
            <v-flex xs12>
                <v-card color="white" >
                    <v-card-text v-for="(cat,index) in catTree"
                                 :key="index">
                        <h2 class="themeColor--text">{{index+1}}.{{cat.category.catName}}</h2>
                        <v-checkbox v-for="(child,index) in cat.childNodes"
                                    v-model="selectedCats"
                                    :label="`${child.category.catName + ' (' + child.category.timeCost + 'h)'}`"
                                    :value="child.category.id"
                                    :key="index"
                                    class="checkboxHeight"></v-checkbox>
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
                                <span class="grey--text text--darken-1">{{timeTotal}} h</span>
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
        </v-layout>

    </v-container>
</template>

<script>
    import axios from 'axios'
    import { createNamespacedHelpers } from 'vuex'
    const { mapMutations, mapGetters } = createNamespacedHelpers('newProj')

    export default {
        layout: 'common',
        middleware: 'authenticated',
        data () {
            return {
                projName: "",
                description: "",
                selectedCats:[],
                // rules: {
                //     required: value => !!value || 'The project name is required.'
                // },
                warning: false
            }
        },
        computed:{
            type: function () {
                return this.$route.query.type || '';
            },
            ...mapGetters([
                'projNameShare',
                'descriptionShare',
                'selectedCatsShare',
                'catTree',
                'catList',
                'timeTotal',
                'checkedCatsTree'
            ])
        },
        async created () {

            const vm = this;
            if (!vm.type) {
                vm.$router.replace({path:'/chooseType'});
            }

            if (vm.projNameShare) {
                vm.projName = vm.projNameShare;
            }

            if (vm.descriptionShare) {
                vm.description = vm.descriptionShare;
            }

            if (vm.selectedCatsShare.length){
                vm.selectedCats = vm.selectedCatsShare;
            }

            if (!vm.catList.length) {
                const list = await axios.get('http://localhost:1337/catconfigs',{
                    params: {
                        projtype: this.type,
                        isActive: 1
                    }
                }).then((res) => {
                    console.log(res.data);
                    return res.data;
                });
                vm.setCatList(list);
                vm.setCatTree(vm.convertToCatTree(vm.catList));
            }
        },
        watch: {
            selectedCats(newSelectedCats, oldSelectedCats) {
                const vm = this;
                vm.setTimeTotal(0);
                for (let i = 0; i < newSelectedCats.length; i++) {
                    for (let cat of vm.catList) {
                        if (cat.category.id === newSelectedCats[i]) {
                            vm.calculateTimeTotal(cat.category.timeCost);
                            break;
                        }
                    }
                }
            }
        },
        methods: {
            ...mapMutations ([
                'setProjNameShare',
                'setDescriptionShare',
                'setSelectedCatsShare',
                'setCatTree',
                'setCatList',
                'setTimeTotal',
                'calculateTimeTotal',
                'setCheckedCatsTree'
            ]),
            convertToCatTree(catList) {
                let catTree = catList.filter(cat => {
                    return cat.category.parentId === null;
                });
                let childNodes = catList.filter(cat => {
                    return cat.category.parentId != null;
                });
                for (let cat of catTree) {
                    Object.assign(cat, {childNodes: []});
                    for (let child of childNodes) {
                        if (child.category.parentId === cat.category.id) {
                            cat.childNodes.push(child);
                        }
                    }
                }
                return catTree;
            },
            preview () {
                // this.validate();
                this.convertCheckedCatsToTree();
                this.setSelectedCatsShare(this);
                this.setProjNameShare(this);
                this.setDescriptionShare(this);
                this.$router.push('/preview');

            },
            // validate () {
            //     const vm =this;
            //     if (vm.projName) {
            //         vm.convertCheckedCatsToTree();
            //         this.$router.push('/preview');
            //     } else {
            //         vm.warning=true;
            //         setTimeout(() => (vm.warning = false), 2000);
            //     }
            // },
            convertCheckedCatsToTree(){
                const vm = this;
                let copyCatTree = vm.copyList(vm.catTree);
                for (let copyCat of copyCatTree){
                    copyCat.childNodes = vm.copyList(copyCat.childNodes);
                }
                for (let i=0; i < copyCatTree.length;) {
                    for (let j=0; j< copyCatTree[i].childNodes.length; ) {
                        if (!vm.selectedCats.find(selectedCat => selectedCat === copyCatTree[i].childNodes[j].category.id)) {
                            console.log('删除的id');
                            copyCatTree[i].childNodes.splice(j,1);
                            j=0;
                        }else{
                            j++;
                        }
                    }
                    if (copyCatTree[i].childNodes.length === 0) {
                        copyCatTree.splice(i,1);
                        i=0;
                    }else{
                        i++;
                    }
                }
                vm.setCheckedCatsTree(copyCatTree);
            },
            copyList(arr){
                return arr.map((e)=>{
                    if(typeof e === 'object'){
                        return Object.assign({},e)
                    }else{
                        return e
                    }
                })
            }
        }
    }
</script>

<style>
    .checkboxHeight,.warnHeight{
        height: 20px;
    }
    .btn{
        width: 50%;
    }
</style>
