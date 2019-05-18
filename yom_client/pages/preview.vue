<template >
    <v-container color="grey lighten-5 " id='x'>

        <v-layout color="white"
                  column
                  wrap
                  >
            <v-flex class="font-weight-medium"
                    align-self-center
                    mb-3>
                <h1 id="name">{{projNameShare || 'No project name'}}</h1>
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
				<v-btn class="themeColor btn white--text mx-auto"
                        @click="saveasimage" >GENERATE PICTURE</v-btn>
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

        <v-dialog
                v-model="isOffline"
                max-width="290"
        >
            <v-card>
                <v-card-title class="headline">Tip</v-card-title>

                <v-card-text>
                    Sorry, please check your network.
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                            color="green darken-1"
                            flat="flat"
                            @click="isOffline=false">
                        OK
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
	import $ from 'jquery'
	import jquery from 'jquery'
	import domtoimage from 'dom-to-image'
	import { saveAs } from 'file-saver';
    import { createNamespacedHelpers } from 'vuex'
    import { createIndexedDB, addDataLocally, updateProj, getLocalDataByKeyPath, DB_NAME_PROJ, STORE_NAME_PROJ } from 'assets/js/idbUtil'
    import { getNowFormatDate } from 'assets/js/util'
    import axios from '~/plugins/axios'
    const { mapGetters, mapMutations } = createNamespacedHelpers('newProj')

    export default {
        name: "preview",
        layout: 'common',
        // middleware: 'authenticated',
        data(){
            return {
                tipDialog: false,
                savingDialog: false,
                fillDialog: false,
                isSave: true,
                isOffline: false,
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
                'checkedCatsTree',
                'projtype'
            ])
        },
<<<<<<< HEAD
        // async fetch ({ store, query }) {
        //     // let { data } = await axios.get(`/projects/${query.id}`);
        //     // store.commit('newProj/setCatList', data.projhistorycats);
        //     // store.commit('newProj/convertToCatTree', data.projhistorycats);
        //     // store.commit('newProj/setProjNameShare', data);
        //     // store.commit('newProj/setDescriptionShare', data);
        //     // store.commit('newProj/setTimeTotal', data.timeTotal);
        //     // store.commit('newProj/getSelectedCatsShare');
        //     // store.commit('newProj/convertCheckedCatTree');
        // },
        async mounted(){
            let { data } = await axios.get(`/projects/${this.id}`);
            this.setCatList(data.projhistorycats);
            this.convertToCatTree(data.projhistorycats);
            this.setProjNameShare(data);
            this.setDescriptionShare(data);
            this.setTimeTotal(data.timeTotal);
            this.getSelectedCatsShare();
            this.convertCheckedCatTree();
=======
        created(){
            console.log('created');
        },
        async mounted (){
            console.log('mounted');
            console.log(this.catTree);
            if(this.id && !this.catTree.length){
                console.log('not from detail page');
                this.isSave = false;
                const dbPromise = await createIndexedDB(DB_NAME_PROJ, STORE_NAME_PROJ);
                let proj = await getLocalDataByKeyPath(dbPromise, STORE_NAME_PROJ, this.id) || {};
                dbPromise.close();

                if (!proj.hasOwnProperty('isSaved')){
                    await axios.get(`/projects/${this.id}`).then(res=>{
                        const data = res.data;
                        proj = data;
                    }).catch(async err=>{
                        // get data from indexdb
                        console.log(`Network err: ${err}`);
                    });
                }
                // this.type = proj.projtype.id;
                console.log(proj);
                if (Object.keys(proj).length !== 0) {
                    this.setCatList(proj.projhistorycats);
                    this.convertToCatTree(proj.projhistorycats);
                    this.setProjNameShare(proj);
                    this.setDescriptionShare(proj);
                    this.setTimeTotal(proj.timeTotal);
                    this.getSelectedCatsShare();
                    this.convertCheckedCatTree();
                }

            }
>>>>>>> 9ca7893138efeae51b4bf3c07da9ee7ebf6de14e
        },
        methods:{
            ...mapMutations ([
                'setProjNameShare',
                'initData',
                'updateCatList',
                'setCatList',
                'convertToCatTree',
                'setDescriptionShare',
                'setTimeTotal',
                'convertCheckedCatTree',
                'setSelectedCatsShare',
                'getSelectedCatsShare'
            ]),
            edit(){
                this.isSave = true;
            },
            validateProjName(){
                const vm =this;
                if (vm.projNameShare) {vm.tipDialog = true;}
                else {vm.fillDialog = true;}
            },
            saveProjName(){
                this.setProjNameShare(this);
                this.fillDialog = false;
            },
            createProjHistoryCats() {
                const vm = this;
                let projhistorycats = [];
                for (let cat of vm.catList) {
                    let { catName, parentId, timeCost, comment, description } = cat.category;
                    let obj = { catName, parentId, timeCost, comment, description };
                    Object.assign(obj, {
                        isChecked: vm.selectedCatsShare.find(selectedCat => selectedCat === cat.category.id) ? 1 : 0
                    })
                    obj.catId = cat.category.id;
                    projhistorycats.push(obj);
                }
                return projhistorycats;
            },
            async saveOrUpdate(){
                if (this.id){
                    await this.updateProject();
                } else {
                    await this.saveProject();
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

                vm.tipDialog = false;
                vm.savingDialog = true;

                const dbPromise = await createIndexedDB(DB_NAME_PROJ, STORE_NAME_PROJ);
                const projId = await addDataLocally(dbPromise, STORE_NAME_PROJ, newProj);

                console.log(`save projtype = ${projtype}`);

                await axios({
                    method: 'post',
                    url: '/projects',
                    data: newProj,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Mark-Id': projId
                    }
                }).then(async res=>{
                    // 保存成功更改indexdb中的id
                    console.log(`Save a project succeed:${res}`);
                    if (projId !== res.data.projId){
                        await updateProj(dbPromise, projId, {id: res.data.projId, isSaved: true});
                    }
                }).catch(async err => {
                    // 保存失败增加isSaved: false  传入的id与重新编辑的更新做区别
                    console.log(`Save a project failed:${err}`);
                    await updateProj(dbPromise, projId, {id: projId, isSaved: false});
                }).finally(()=>{
                    dbPromise.close();
                    setTimeout(() => {
                        vm.savingDialog = false;
                        vm.initData();
                        vm.$router.replace('/project');
                    }, 1000);
                });
            },
            async updateProject () {

                this.updateCatList();

                const vm = this;
                const { projNameShare, descriptionShare, timeTotal, catList, id, projtype } = this;
                const editProj = {
                    projName: projNameShare,
                    description: descriptionShare,
                    timeTotal: timeTotal,
                    projtype: projtype,
                    projhistorycats: catList,
                    user: this.$store.state.auth.id
                };
                console.log('editProj');
                console.log(editProj);
                const dbPromise = await createIndexedDB(DB_NAME_PROJ, STORE_NAME_PROJ, 1);
                await updateProj(dbPromise, id, editProj);
                dbPromise.close();

                this.tipDialog = false;
                this.savingDialog = true;

                // The project not be saved in database due to offline
                if (!catList[0].id){

                    await axios({
                        method: 'post',
                        url: '/projects',
                        data: editProj,
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Mark-Id': id
                        }
                    }).then(async res=>{
                        // 保存成功更改indexdb中的id
                        console.log(`Save a project succeed:${res}`);
                        if (projId !== res.data.projId){
                            await updateProj(dbPromise, id, {id: res.data.projId, isSaved: true});
                        }
                    }).catch(async err => {
                        // 更新失败增加isSaved: false  传入的id与重新编辑的更新做区别
                        console.log(`Save a project failed:${err}`);
                        // await updateProj(dbPromise, id, {id: projId, isSaved: false});
                    }).finally(()=>{
                        setTimeout(() => {
                            vm.savingDialog = false;
                            vm.initData();
                            vm.$router.replace('/project');
                        }, 1000);
                    });

                    return;
                }

                await axios.put('/projects/'+ id, {
                    projName: projNameShare,
                    description: descriptionShare,
                    timeTotal: timeTotal,
                    user: this.$store.state.auth.id
                }).then((res) => {
                    console.log(res);
                }).catch(async err=>{
                    console.log(`update a project failed:${err}`);

                    setTimeout(() => {
                        vm.savingDialog = false;
                        vm.isOffline = true;
                        vm.initData();
                        vm.$router.replace('/project');
                    }, 1000);

                }).finally(async ()=>{
                    await vm.updateProjHistoryCats();
                });
            },
            async updateProjHistoryCats() {
                const vm = this;

                this.tipDialog = false;

                console.log(this.selectedCatsShare);

                vm.updateCatList();

                console.log(this.catList);

                await axios.put('/projhistorycats', this.catList)
                .then((res) => {
                    setTimeout(() => {
                        vm.savingDialog = false;
                        vm.initData();
                        vm.$router.replace('/project');
                    }, 1000);
                });
            },
			saveasimage(){
				var date = new Date();
				var seperator1 = "-";
				var seperator2 = "_";
				var month = date.getMonth() + 1;
				var strDate = date.getDate();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
					+ " " + date.getHours() + seperator2 + date.getMinutes()
					+ seperator2 + date.getSeconds();
				var node = document.getElementById('x');
				var name = "projname_" + $('h1').text() + " time_" + currentdate;
				domtoimage.toPng(node)
					.then(function (dataUrl) {
						var img = new Image();
                        img.src = dataUrl;
                        document.body.appendChild(img);
                    });
				domtoimage.toBlob(document.getElementById('x'),{ bgcolor:"white" })
					.then(function (blob) {
						window.saveAs(blob,name);
					});
				alert("picture saved as " + name + ".png,you can see the picture below")
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
