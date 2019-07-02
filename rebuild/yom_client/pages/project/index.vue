<template>
    <no-ssr>
        <EasyRefresh :userSelect="false"
                     :loadMore="loadMore">
            <v-container>

                <ProjItem :projects="projects"></ProjItem>

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
    import ProjItem from '@/components/project/proj-item'
    import { createIndexedDB, saveDataLocally, searchProjs, STORE_NAME_PROJ, DB_NAME_PROJ } from 'static/js/idbUtil'
    import { createNamespacedHelpers } from 'vuex'

    export default {
        name: "project",
        layout: "common",
        middleware: 'authenticated',
        components: {
            ProjItem
        },
        data(){
            return {
                moreProjects: [],
                startTime: '',
                endTime: '',
                projName: '',
                limit: 10,
                page: 1
                // projects: []
            }
        },
        computed: {
            queryParams(){
                return this.$route.query || {}
            }
        },
        async asyncData({ query, $axios, store }) {

            const { endTime, projName, startTime } = query

            const projects = await $axios.$get('/projects',{
                params: {
                    isActive:1,
                    user: store.state.auth.id,
                    _sort:'created_at:DESC',
                    _start: 0,
                    _limit: 10,
                    created_at_lte: endTime,
                    created_at_gte: startTime,
                    projName_contains: projName
                }
            })
            .then((res)=>{return res})
            .catch((err)=>{return [];})

            const count = await $axios.$get('/projects/count',{
                params: {
                    isActive:1,
                    user: store.state.auth.id,
                    created_at_lte: endTime,
                    created_at_gte: startTime,
                    projName_contains: projName
                }
            })
            .then((res)=>{return res})
            .catch(async(err)=>{return 0;})


            return { projects, count };
        },
        async mounted () {
            console.log('Mounted count', this.count)
            console.log('Mounted projects', this.projects)
            console.log('Mounted queryParams', this.queryParams)
            this.$store.commit('newProj/initData');
            if (this.projects.length && !Object.keys(this.queryParams).length) {
                // save projects from indexdb（no query）
                const dbPromise = await createIndexedDB(DB_NAME_PROJ, STORE_NAME_PROJ)
                const data = await saveDataLocally(dbPromise, STORE_NAME_PROJ, this.projects)
                dbPromise.close()
            } else if (!this.projects.length) {
                // get projects from indexdb
                const dbPromise = await createIndexedDB(DB_NAME_PROJ, STORE_NAME_PROJ)
                const data = await searchProjs(dbPromise, this.queryParams)
                dbPromise.close()
                this.projects = data
            }
        },
        methods:{
            async loadMore(done){
                if ((this.page * this.limit) <= this.count) {
                    ++this.page;
                    await this.getProjects();
                    // this.$store.commit('indexedDB/loadProjects', this.moreProjects);
                    this.projects = this.projects.concat(this.moreProjects);
                    const dbPromise = await createIndexedDB(DB_NAME_PROJ, STORE_NAME_PROJ);
                    await saveDataLocally(dbPromise, STORE_NAME_PROJ, this.projects);
                    dbPromise.close();
                    done(true);
                } else {
                    done(false);
                }
            },
            async getProjects(){
                const { endTime, projName, startTime } = this.$route.query;

                this.moreProjects = await this.$axios.$get('/projects',{
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
