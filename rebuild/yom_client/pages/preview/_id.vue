<template>
    <v-container color="grey lighten-5"
                 id="doc">
        <ProjDoc v-on:show-filldialog="fillDialog=$event"
                 v-on:show-tipdialog="tipDialog=$event"
                 v-on:show-imgdialog="imgDialog=$event"
                 :isEdit="isEdit"></ProjDoc>

        <FillDialog v-if="fillDialog"
                    v-on:show-filldialog="fillDialog=$event"></FillDialog>

        <OfflineTip v-if="isOffline"
                    v-on:show-isOffline="isOffline=$event"></OfflineTip>

        <SavingDialog v-if="savingDialog"
                      v-on:show-savingdialog="savingDialog=$event"></SavingDialog>

        <TipDialog v-if="tipDialog"
                   v-on:show-savingdialog="savingDialog=$event"
                   v-on:show-tipdialog="tipDialog=$event"></TipDialog>

        <ImgDialog v-if="imgDialog"
                   v-on:show-imgdialog="imgDialog=$event"
                   :doc="doc"></ImgDialog>

    </v-container>
</template>

<script>
    import ProjDoc from '@/components/preview/proj-doc'
    import FillDialog from '@/components/preview/fill-dialog'
    import OfflineTip from '@/components/preview/offline-tip'
    import SavingDialog from '@/components/preview/saving-dialog'
    import TipDialog from '@/components/preview/tip-dialog'
    import ImgDialog from '@/components/preview/img-dialog'

    import { createNamespacedHelpers } from 'vuex'
    import { createIndexedDB, getLocalDataByKeyPath, DB_NAME_PROJ, STORE_NAME_PROJ } from 'assets/js/idbUtil'
    const { mapGetters, mapMutations } = createNamespacedHelpers('newProj')

    export default {
        layout: 'common',
        middleware: 'authenticated',
        components: {
            ProjDoc,
            FillDialog,
            OfflineTip,
            SavingDialog,
            TipDialog,
            ImgDialog
        },
        data(){
            return {
                tipDialog: false,
                savingDialog: false,
                fillDialog: false,
                isOffline: false,
                isEdit: true,
                imgDialog: false
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
            id(){
                return this.$route.params.id
            },
            doc(){
                return document.getElementById('doc')
            }
        },
        async asyncData({ params, $axios, store }) {


            console.log('asyncData params', params);
            let project = {};

            if (store.state.newProj.catList.length) {
                project.isEdit = true;
                return { project };
            }

            project = await $axios.$get(`/projects/${params.id}`)
            .then((res)=>{return res})
            .catch((err)=>{return {};})

            console.log('asyncData project', project);
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
            console.log('mounted-start', this.project);
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
                        console.log('No network, no data in the indexdb');
                    }
                }
            }
            console.log('mounted-end', this.project);

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

<style scoped>

</style>