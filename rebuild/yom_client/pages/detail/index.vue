
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
    import { createIndexedDB, saveDataLocally, getLocalData, DB_NAME_CATCONFIG, STORE_NAME_CATCONFIG } from 'assets/js/idbUtil'
    import { createNamespacedHelpers } from 'vuex'
    import { copyList } from 'assets/js/util'
    const { mapMutations, mapGetters } = createNamespacedHelpers('newProj')


    export default {
        layout: 'common',
        // middleware: 'authenticated',
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
            type: function() {
                return this.$route.query.type || '';
            },
            ...mapGetters([
                'catTree',
                'catList'
            ])
        },
        async asyncData({query, $axios, store}){

            const catconfigs = await $axios.$get('/catconfigs', {
                params: {
                    projtype: query.type,
                    isActive: 1
                }
            })
            .then((res)=>{return res})
            .catch((err)=>{return [];})

            console.log('catconfigs', catconfigs)

            if (!store.state.newProj.catList.length){
                store.commit('newProj/setCatList',catconfigs);
                store.commit('newProj/convertToCatTree',catconfigs);
            }
        },
        async mounted(){

            if (!this.type) {
                this.$router.replace({path:'/chooseType'});
            }

            this.setProjtype(this.type);

            // create catconfigs db
            let CURRENT_VERSION = await this.getDbVersion() || 1;

            let dbPromise = await createIndexedDB(DB_NAME_CATCONFIG, `${DB_NAME_CATCONFIG}-${this.type}`, CURRENT_VERSION);

            if(!dbPromise.objectStoreNames.contains(`${DB_NAME_CATCONFIG}-${this.type}`)){
                dbPromise.close();
                dbPromise = await createIndexedDB(DB_NAME_CATCONFIG, `${DB_NAME_CATCONFIG}-${this.type}`, CURRENT_VERSION + 1);
            }

            const configcats = await getLocalData(dbPromise, `${DB_NAME_CATCONFIG}-${this.type}`);

            if (this.catList.length) {
                // compare the data from db with the data from indexdb
                if (JSON.stringify(configcats) !== JSON.stringify(this.catList)) {
                    // this.setCatList(this.catList);
                    this.convertToCatTree(this.catList);
                    await saveDataLocally(dbPromise, `${DB_NAME_CATCONFIG}-${this.type}`, this.catList);
                }
            } else {
                this.setCatList(configcats);
                this.convertToCatTree(this.catList);
            }

        },
        watch: {

        },
        methods: {
            ...mapMutations ([
                'setCatList',
                'convertToCatTree',
                'setProjtype'
            ]),
            async getDbVersion(){
                if (process.client) {
                    const databases = await window.indexedDB.databases();
                    for (let db of databases) {
                        if (db.name === DB_NAME_CATCONFIG) {
                            return db.version;
                        }
                    }
                }
            }
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
