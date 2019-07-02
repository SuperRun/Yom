
<template>
    <v-container
            grid-list-lg
    >
        <v-layout row wrap>
            <BasicInfo></BasicInfo>
            <ProjCats :catTree="catTree" v-on:change-timecost="timeCostDialog=true"></ProjCats>
        </v-layout>

        <TimeDialog v-if="timeCostDialog" v-on:close-dialog="timeCostDialog=$event"></TimeDialog>
    </v-container>
</template>

<script>
    import BasicInfo from '@/components/detail/basic-info'
    import ProjCats from '@/components/detail/proj-cats'
    import TimeDialog from '@/components/detail/time-dialog'
    import { createIndexedDB, getLocalDataByKeyPath, DB_NAME_PROJ, STORE_NAME_PROJ } from 'static/js/idbUtil'
    import { createNamespacedHelpers } from 'vuex'

    const { mapMutations, mapGetters } = createNamespacedHelpers('newProj')


    export default {
        layout: 'common',
        middleware: 'authenticated',
        components: {
            BasicInfo,
            ProjCats,
            TimeDialog
        },
        data () {
            return {
                projName: "",
                description: "",
                selectedCats:[],
                warning: false,
                timeCostDialog: false,
                slider: 10,
                comment: '',
                parentIndex: -1,
                childIndex: -1,
                changedCatId: -1
            }
        },
        computed:{
            id: function() {
                return this.$route.params.id;
            },
            ...mapGetters([
                'catTree',
                'catList',
                'projNameShare'
            ])
        },
        async asyncData({ params, $axios, store }) {

            console.log(store.state.newProj.catList.length);

            let project = {};

            if (store.state.newProj.catList.length) {
                project.isEdit = true;
                return { project };
            }

            project = await $axios.$get(`/projects/${params.id}`)
                .then((res)=>{return res})
                .catch((err)=>{return {};})

            console.log(project);
            if (Object.keys(project).length){
                store.commit('newProj/setCatList', project.projhistorycats);
                store.commit('newProj/convertToCatTree', project.projhistorycats);
                store.commit('newProj/setProjNameShare', project.projName);
                store.commit('newProj/setDescriptionShare', project.description);
                store.commit('newProj/setTimeTotal', project.timeTotal);
                store.commit('newProj/setProjtype', project.projtype);
                store.commit('newProj/getSelectedCatsShare');
                store.commit('newProj/convertCheckedCatTree');
            }

            return { project };
        },
        async mounted(){
            console.log('parent create');
            if (!this.project.isEdit){
                if (!Object.keys(this.project).length){
                    // get project from indexdb
                    const dbPromise = await createIndexedDB(DB_NAME_PROJ, STORE_NAME_PROJ);
                    this.project = await getLocalDataByKeyPath(dbPromise, STORE_NAME_PROJ, this.id);
                    console.log('project from indexdb',this.project)
                    if (Object.keys(this.project).length) {
                        this.setCatList(this.project.projhistorycats);
                        this.convertToCatTree(this.project.projhistorycats);
                        this.setProjNameShare(this.project.projName);
                        this.setDescriptionShare(this.project.description);
                        this.setTimeTotal(this.project.timeTotal);
                        this.setProjtype(this.project.projtype);
                        this.getSelectedCatsShare();
                        this.convertCheckedCatTree();
                    }else{
                        console.log('check your network');
                    }
                }
            }

        },
        watch: {

        },
        methods: {
            ...mapMutations ([
                'setCatList',
                'convertToCatTree',
                'setProjNameShare',
                'setDescriptionShare',
                'setTimeTotal',
                'getSelectedCatsShare',
                'convertCheckedCatTree',
                'setProjtype'
            ])

        }
    }
</script>

<style>
    .checkboxMargin *{
        margin-bottom: 0 !important;
        margin-top: 0 !important;
    }
    .checkboxHeight{
        padding: 0 !important;
    }
    .btn{
        width: 50%;
    }
    .timeCost{
        width: 40px;
        line-height: 22px;
        color: #6e7da2;
        border: 1.3px solid #6e7da2;
        border-radius: 22px;
        text-align: center;
        background-color: #fcf8f3;
    }
</style>
