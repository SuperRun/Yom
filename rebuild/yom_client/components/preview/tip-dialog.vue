<template>

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
                        @click="$emit('show-tipdialog',false)"
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

</template>

<script>
    import { createNamespacedHelpers } from 'vuex'
    import { createIndexedDB, addDataLocally, updateProj, DB_NAME_PROJ, STORE_NAME_PROJ } from 'assets/js/idbUtil'
    const { mapGetters, mapMutations } = createNamespacedHelpers('newProj')
    import { getNowFormatDate } from 'assets/js/util'

    export default {
        name: "tip-dialog",
        data(){
            return {
                tipDialog: true,
                editProj: {}
            }
        },
        computed: {
            ...mapGetters([
                'projNameShare',
                'descriptionShare',
                'selectedCatsShare',
                'catTree',
                'catList',
                'timeTotal',
                'checkedCatsTree',
                'projtype'
            ]),
            id: function() {
                return this.$route.params.id || '';
            }
        },
        methods: {
            ...mapMutations([
                'setProjNameShare',
                'initData',
                'updateCatList'
            ]),
            async saveOrUpdate(){
                const vm =this;

                vm.$emit('show-tipdialog', false);
                vm.$emit('show-savingdialog', true);

                if (vm.id){
                    vm.updateCatList();
                    const { projNameShare, descriptionShare, timeTotal, catList, id, projtype } = vm;
                    vm.editProj = {
                        projName: projNameShare,
                        description: descriptionShare,
                        timeTotal: timeTotal,
                        projtype: projtype,
                        projhistorycats: catList,
                        user: vm.$store.state.auth.id
                    };
                    console.log('editProj', vm.editProj);

                    if (!catList[0].id){
                        await vm.updateProjFromIdb(id)
                            .then(res=>{
                                console.log(`Update a project succeed:${res}`);
                            }).catch(async err => {
                                console.log(`Updata a project failed:${err}`);
                                const dbPromise = await createIndexedDB(DB_NAME_PROJ, STORE_NAME_PROJ, 1);
                                await updateProj(dbPromise, id, vm.editProj);
                                dbPromise.close();
                            }).finally(()=>{
                                setTimeout(() => {
                                    vm.$emit('show-savingdialog', false);
                                    vm.initData();
                                    vm.$router.replace('/project');
                                }, 1000);
                            });
                    }else{
                        await vm.updateProject()
                            .then(async (res) => {
                                await vm.updateProjHistoryCats();
                            }).catch(async err=>{
                                console.log(`Updata a project failed:${err}`);
                                const dbPromise = await createIndexedDB(DB_NAME_PROJ, STORE_NAME_PROJ, 1);
                                await updateProj(dbPromise, id, vm.editProj);
                                dbPromise.close();
                            }).finally(()=>{
                                setTimeout(() => {
                                    vm.$emit('show-savingdialog', false);
                                    vm.initData();
                                    vm.$router.replace('/project');
                                }, 1000);
                            });
                    }

                } else {
                    console.log('It is going to save a project');
                    await this.saveProject()
                        .then(res=>{
                            console.log(`Save a project succeed:${res}`);
                        }).catch(async err => {
                            console.log(`Save a project failed:${err}`);
                        }).finally(()=>{
                            setTimeout(() => {
                                this.$emit('show-savingdialog', false);
                                this.initData();
                                this.$router.replace('/project');
                            }, 1000);
                        });
                }
            },
            async saveProject() {
                const { projNameShare, descriptionShare, timeTotal, projtype } = this;
                const vm = this;
                const newProj = {
                    projName: projNameShare,
                    description: descriptionShare,
                    timeTotal: timeTotal,
                    projtype: projtype,
                    projhistorycats: vm.createProjHistoryCats(),
                    created_at: getNowFormatDate(),
                    user: vm.$store.state.auth.id
                }

                this.$emit('show-savingdialog', true);

                const dbPromise = await createIndexedDB(DB_NAME_PROJ, STORE_NAME_PROJ);
                const projId = await addDataLocally(dbPromise, STORE_NAME_PROJ, newProj);
                dbPromise.close();

                await this.$axios({
                    method: 'post',
                    url: '/projects',
                    data: newProj,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Mark-Id': projId
                    }
                });

            },
            createProjHistoryCats() {
                const vm = this;
                let projhistorycats = [];
                for (let cat of vm.catList) {
                    let { catName, parentId, timeCost, comment, description } = cat.category;
                    console.log('cat.category', cat.category);
                    let obj = { catName, parentId, timeCost, comment, description };
                    Object.assign(obj, {
                        isChecked: vm.selectedCatsShare.find(selectedCat => selectedCat === cat.category.id) ? 1 : 0
                    })
                    obj.catId = cat.category.id;
                    projhistorycats.push(obj);
                }
                return projhistorycats;
            },
            async updateProjFromIdb(id){
                console.log('editProj', this.editProj);
                await this.$axios({
                    method: 'post',
                    url: '/projects',
                    data: this.editProj,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Mark-Id': id
                    }
                })
            },
            async updateProject () {

                await this.$axios.put('/projects/'+ this.id, {
                    projName: this.projNameShare,
                    description: this.descriptionShare,
                    timeTotal: this.timeTotal,
                    user: this.$store.state.auth.id
                })
            },
            async updateProjHistoryCats() {
                // const vm = this;

                // this.tipDialog = false;

                console.log(this.selectedCatsShare);

                this.updateCatList();

                console.log(this.catList);

                await this.$axios.put('/projhistorycats', this.catList)
                    .then((res) => {
                        setTimeout(() => {
                            this.initData();
                            this.$router.replace('/project');
                        }, 1000);
                    });
            },
        }
    }
</script>

<style scoped>

</style>