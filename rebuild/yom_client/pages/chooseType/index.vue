<template>
    <v-container grid-list-lg>
        <TypeItem :typeList="typeList" ></TypeItem>
    </v-container>
</template>

<script>

    import TypeItem from '@/components/chooseType/type-item'
    import { createIndexedDB, saveDataLocally, getLocalData, DB_NAME_TYPE, STORE_NAME_TYPE} from 'static/js/idbUtil'
    import { createNamespacedHelpers } from 'vuex'
    const {  mapMutations } = createNamespacedHelpers('newProj')

    export default {
        name: "chooseType",
        layout: 'common',
        middleware: 'authenticated',
        components: {
            TypeItem
        },
        data () {
            return {
                // typeList: []
            }
        },
        async asyncData({ $axios }) {

            const typeList = await $axios.$get('/projtypes', {
                params: {
                    isActive: 1
                }
            })
            .then((res)=>{return res})
            .catch((err)=>{return [];})

            return { typeList };
        },
        async mounted(){

            const dbPromise = await createIndexedDB(DB_NAME_TYPE, STORE_NAME_TYPE)
            const data = await getLocalData(dbPromise, STORE_NAME_TYPE)

            if (this.typeList.length) {
                if (JSON.stringify(this.typeList) !== JSON.stringify(data)) {
                    await saveDataLocally(dbPromise, 'types', this.typeList)
                }
            }else{
                this.typeList = data
            }
        },
        methods: {

        }
    }
</script>

<style scoped>
</style>
