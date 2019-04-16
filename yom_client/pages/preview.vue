<template>
    <v-container color="grey lighten-5">

        <v-layout color="white"
                  column
                  wrap
                  >
            <v-flex class="font-weight-medium"
                    align-self-center
                    mb-3>
                <h1>{{projNameShare || 'No project name'}}</h1>
            </v-flex>
            <v-flex>
                <div>
                    <p class="subheading"><strong>Description:</strong>{{descriptionShare || 'No description'}}</p>
                </div>
            </v-flex>
            <v-flex mb-3
                    v-for="(cat, index) in checkedCatsTree"
                    :key="index">
                <h2>{{index+1}}.{{cat.category ? cat.category.catName : cat.catName}}</h2>
                <ul>
                    <li v-for="(child,index) in cat.childNodes"
                        :key="index">
                        <h3 class="subheading"><strong>{{child.category ? child.category.catName : child.catName}}</strong></h3>
                        <h4 class="body-2">Time Cost: {{child.category ? child.category.timeCost : child.timeCost}} h</h4>
                        <h4 class="body-2" v-if="child.category && child.category.comment">Note:</h4>
                        <h4 class="body-2" v-if="child.comment">Note:</h4>
                        <p v-if="child.category && child.category.comment" class="content ">{{child.category.comment}}</p>
                        <p v-if="child.comment" class="content ">{{child.comment}}</p>
                        <h4 class="body-2">Description:</h4>
                        <p class="content">{{child.category ? child.category.description : child.description}}</p>
                    </li>
                </ul>
            </v-flex>
            <v-flex>
                <v-divider color="black"></v-divider>
            </v-flex>
            <v-flex align-self-end
                    py-2
                    mb-3>
                <div>
                    <span>Total Time: </span>
                    <span>{{timeTotal || '0'}} h</span>
                </div>
            </v-flex>
            <v-flex align-self-center
                    class="flex-width">
                <v-btn class="themeColor btn white--text mx-auto"
                       v-if="id"
                       :to="`/detail?id=${id}`">Edit</v-btn>
                <v-btn class="themeColor btn white--text mx-auto"
                       @click="validateProjName">Save</v-btn>
            </v-flex>
        </v-layout>

        <v-dialog
                v-model="tipDialog"
                max-width="290"
        >
            <v-card>
                <v-card-title class="headline">Tip</v-card-title>

                <v-card-text>
                    Do you want to save the project?
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                            color="green darken-1"
                            flat="flat"
                            @click="tipDialog = false"
                    >
                        Cancel
                    </v-btn>

                    <v-btn
                            color="green darken-1"
                            flat="flat"
                            @click="saveOrUpdate"
                    >
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog
                v-model="savingDialog"
                hide-overlay
                persistent
                width="300"
        >
            <v-card
                    color="lime darken-4"
                    dark
            >
                <v-card-text>
                    Saving...
                    <v-progress-linear
                            indeterminate
                            color="lime lighten-5"
                            class="mb-0"
                    ></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="fillDialog" persistent max-width="600px">
            <v-card>
                <v-card-title>
                    <span class="headline">Add Your Project Name</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12>
                                <v-text-field color="green darken-1"
                                              label="Project Name"
                                              v-model="projName"></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="green darken-1" flat @click="fillDialog = false">Close</v-btn>
                    <v-btn color="green darken-1" flat @click="saveProjName">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex'
    import axios from 'axios'
    const { mapGetters, mapMutations, initData } = createNamespacedHelpers('newProj')

    export default {
        name: "preview",
        layout: 'common',
        middleware: 'authenticated',
        data(){
            return {
                tipDialog: false,
                savingDialog: false,
                fillDialog: false,
                isSave: true,
                projName: ''
            }
        },
        computed: {
            id: function() {
                return this.$route.query.id || 0;
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
        created (){
            console.log(this.$route);
            if(this.$route.query.id){
                this.isSave = false;
                console.log(this.$route.query.id);
            }
        },
        methods:{
            ...mapMutations ([
                'setProjNameShare',
                'initData'
            ]),
            edit(){
                this.isSave = true;
            },
            validateProjName(){
                const vm =this;
                if (vm.projNameShare) {
                    vm.tipDialog = true;
                } else {
                    vm.fillDialog = true;
                }
            },
            saveProjName(){
                this.setProjNameShare(this);
                this.fillDialog = false;
            },
            createProjHistoryCats(project) {
                const vm = this;
                const projhistorycats = [];
                Array.from(vm.catList, cat => {
                    Object.assign(cat.category, {
                        isChecked: vm.selectedCatsShare.find(selectedCat => selectedCat === cat.category.id) ? 1 : 0
                    })
                });
                for (let cat of vm.catList) {
                    let {catName, isChecked, parentId, timeCost, comment} = cat.category;
                    let obj = {catName, isChecked, parentId, timeCost, comment, project};
                    obj.catId = cat.category.id;
                    projhistorycats.push(obj);
                }
                return projhistorycats;
            },
            saveOrUpdate(){
                if (this.id){
                    this.updateProject();
                } else {
                    saveProject();
                }
            },
            async saveProject() {
                const {projNameShare, descriptionShare} = this;
                const vm = this;
                vm.savingDialog = true;
                await axios.post('http://localhost:1337/projects', {
                    projName: projNameShare,
                    description: descriptionShare,
                    user: this.$store.state.auth.id
                }).then((res) => {
                        const project = res.data.id;
                        vm.saveProjHistoryCats(project);
                });
            },
            async saveProjHistoryCats(project) {
                const vm = this;
                const projhistorycats = vm.createProjHistoryCats(project);
                await axios.post('http://localhost:1337/projhistorycats', projhistorycats)
                    .then((res) => {
                        setTimeout(() => {
                            vm.savingDialog = false;
                            vm.initData();
                            vm.$router.replace('/project');
                        }, 1000);
                    });
            },
            async updateProject () {
                const {projNameShare, descriptionShare} = this;
                const vm = this;
                vm.savingDialog = true;
                await axios.put('http://localhost:1337/projects/'+this.id, {
                    projName: projNameShare,
                    description: descriptionShare,
                    user: this.$store.state.auth.id
                }).then((res) => {
                    console.log(res);

                    vm.updateProjHistoryCats();
                });
            },
            async updateProjHistoryCats() {
                const vm = this;
                console.log(this.catList);
                await axios.put('http://localhost:1337/projhistorycats', this.catList)
                    .then((res) => {
                        setTimeout(() => {
                            vm.savingDialog = false;
                            vm.initData();
                            vm.$router.replace('/project');
                        }, 1000);
                    });
            },
        }
    }
</script>

<style scoped>
    .flex-width{
        width: 60%;
    }
    .btn{
        width: 100%;
    }
    .content{
        padding: 3px;
        border: 1px dashed rgba(30, 33, 37, 0.37);
        border-radius: 3px;
    }
</style>
