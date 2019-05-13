<template>
    <no-ssr>
        <EasyRefresh :userSelect="false"
                     :loadMore="loadMore">
            <v-container>
                <v-timeline dense
                            v-for="(proj, index) in projects"
                            :key="index"
                >
                    <v-timeline-item
                            v-bind:color="itemColor[index%itemColor.length]"
                            small>
                        <v-layout row
                                  pa-2
                                  pl-3
                                  class="white elevation-3"
                                  @click="edit(proj)">
                            <v-flex xs3>
                                <h3 v-bind:class="[itemColorText[index%itemColorText.length],'display-1', 'font-weight-bold']">
                                    {{proj.created_at.split('T')[0].split('-')[2]}}
                                </h3>
                                <p>{{proj.created_at.split('T')[0].split('-')[1] + '.' + proj.created_at.split('T')[0].split('-')[0]}}</p>
                            </v-flex>
                            <v-flex xs9>
                                <h3>{{proj.projName || 'Project Name'}}</h3>
                                <p>{{proj.description || 'No description.'}}</p>
                            </v-flex>
                        </v-layout>
                    </v-timeline-item>
                </v-timeline>
                <div class="title
                 grey--text
                 text-lighten-1"
                     mt-5
                     v-if="!projects.length">There is no project.</div>
            </v-container>
        </EasyRefresh>
    </no-ssr>
</template>

<script>
    import axios from '~/plugins/axios'
    import { createIndexedDB, saveDataLocally, setLastUpdated, searchProjs, getProjsByDate, getLocalDataCount, STORE_NAME_PROJ, DB_NAME_PROJ } from 'assets/js/idbUtil'
    import { createNamespacedHelpers } from 'vuex'
    const { mapMutations, mapGetters } = createNamespacedHelpers('newProj');

    export default {
        name: "project",
        layout: "common",
        // middleware: 'authenticated',
        data(){
            return {
                itemColor:[
                    'timelineColor1',
                    'timelineColor2',
                    'timelineColor3'
                ],
                moreProjects: [],
                startTime: '',
                endTime: '',
                projName: '',
                limit: 10,
                page: 1,
                count: 0
            }
        },
        computed: {
            itemColorText() {
                return this.itemColor.map((item)=>{
                    return item += '--text';
                });
            },
            projects(){
                return this.$store.state.indexedDB.projects;
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
        async mounted () {
            const vm = this;
            await vm.getCount();
            console.log(`mounted count = ${vm.count}`);
            await vm.getProjects().then(async (res) => {

                const dbPromise = await createIndexedDB(DB_NAME_PROJ, STORE_NAME_PROJ,1,['date']);

                vm.$store.commit('indexedDB/setProjects',vm.moreProjects);
                await saveDataLocally(dbPromise, STORE_NAME_PROJ, vm.projects)
                    .then(()=>(setLastUpdated(new Date())))
                    .catch(err=>(console.log(`Save Data Error: ${err}`)));

                dbPromise.close();

            }).catch(async err => {

                const { endTime, projName, startTime } = this.$route.query;
                const query = { endTime, projName, startTime };

                console.log('Network requests have failed, this is expected if offline');

                const dbPromise = await createIndexedDB(DB_NAME_PROJ, STORE_NAME_PROJ);

                let projects = [];
                if (!Object.keys(this.$route.query).length){
                    projects = await getProjsByDate(dbPromise);
                    projects.reverse();
                } else {
                    const { endTime, projName, startTime } = this.$route.query;
                    const query = { endTime, projName, startTime };
                    projects = await searchProjs(dbPromise, query);
                }
                console.log(projects);
                vm.$store.commit('indexedDB/setProjects', projects);

                dbPromise.close();
            });
        },
        methods:{
            ...mapMutations ([
                'setProjNameShare',
                'setDescriptionShare',
                'setSelectedCatsShare',
                'setCatTree',
                'setCatTreeNode',
                'setCatList',
                'setCatListNode',
                'setTimeTotal',
                'setCheckedCatsTree',
                'convertToCatTree',
                'convertCheckedCatTree'
            ]),
            edit (proj) {
                console.log(proj);
                // this.setCatList(proj.projhistorycats);
                // this.convertToCatTree(proj.projhistorycats);
                // this.setProjNameShare(proj);
                // this.setDescriptionShare(proj);
                // this.setTimeTotal(proj.timeTotal);
                // this.getSelectedCatsShare();
                // this.convertCheckedCatTree();
                // console.log('catList');
                // console.log(this.catList);
                // console.log('catTree');
                // console.log(this.catTree);
                // console.log('checkedCatsTree');
                // console.log(this.checkedCatsTree);
                this.$router.push(`/preview?id=${proj.id}`);
            },
            // getSelectedCatsShare(){
            //     let selectedCats = this.catList.map(cat=> {
            //         if(cat.isChecked && cat.parentId){
            //             return cat.id?cat.id:cat.catId;
            //         }
            //     }).filter(cat=>cat);
            //     this.setSelectedCatsShare(selectedCats);
            //     console.log(selectedCats);
            // },
            async loadMore(done){
                console.log(`page = ${this.page}; cont/limit = ${Math.ceil(this.count/this.limit)}`);
                if (this.page <= Math.ceil(this.count/this.limit)) {
                    ++this.page;
                    console.log(`page = ${this.page}`);
                    const vm = this;
                    await this.getProjects()
                        .then(async res=>{
                            if (vm.moreProjects.length) {
                                this.$store.commit('indexedDB/loadProjects', vm.moreProjects);
                                const dbPromise = await createIndexedDB(DB_NAME_PROJ, STORE_NAME_PROJ);
                                await saveDataLocally(dbPromise, STORE_NAME_PROJ, vm.projects)
                                    .catch(err=>(console.log(`Save Data Error: ${err}`)));
                                dbPromise.close();
                                done(false);
                            }else {
                                done(true);
                            }
                        })
                        .catch(err=>{
                            console.log(`Network Error: ${err}`);
                            done(true);
                        });
                }
            },
            async getProjects(){
                const { endTime, projName, startTime } = this.$route.query;

                this.moreProjects = [];

                this.moreProjects = await axios.get('/projects',{
                    params: {
                        isActive:1,
                        user: this.$store.state.auth.id,
                        _sort:'created_at:DESC',
                        _start: (this.page-1)*this.limit,
                        _limit: this.limit,
                        created_at_lte: endTime,
                        created_at_gte: startTime,
                        projName_contains: projName
                    }
                }).then((res)=>{
                        console.log(res.data);
                        return res.data
                });
            },
            async getCount(){
                const { endTime, projName, startTime } = this.$route.query;

                this.count =await axios.get('/projects/count',{
                    params: {
                        isActive:1,
                        user: this.$store.state.auth.id,
                        created_at_lte: endTime,
                        created_at_gte: startTime,
                        projName_contains: projName
                    }
                }).then((res)=>{
                    console.log(res.data);
                    return res.data
                }).catch(async (err)=>{
                    const dbPromise = await createIndexedDB(DB_NAME_PROJ, STORE_NAME_PROJ);
                    const count = await getLocalDataCount(dbPromise, STORE_NAME_PROJ).then(res=>{return res});
                    console.log(`offline count = ${count}`);
                    return count;
                });
            }
        }
    }
</script>

<style scoped>
    .month-color{
        color: #d09796;
    }
</style>
