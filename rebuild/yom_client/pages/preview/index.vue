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
                   :doc="doc"
                   v-on:show-imgdialog="imgDialog=$event"></ImgDialog>

    </v-container>
</template>

<script>
    import ProjDoc from '@/components/preview/proj-doc'
    import FillDialog from '@/components/preview/fill-dialog'
    import OfflineTip from '@/components/preview/offline-tip'
    import SavingDialog from '@/components/preview/saving-dialog'
    import TipDialog from '@/components/preview/tip-dialog'
    import ImgDialog from '@/components/preview/img-dialog'

    export default {
        name: "preview",
        layout: 'common',
        // middleware: 'authenticated',
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
                isEdit: false,
                imgDialog: false
            }
        },
        computed: {
            doc(){
                return document.getElementById('doc')
            }
        }
    }
</script>

<style scoped>

</style>
