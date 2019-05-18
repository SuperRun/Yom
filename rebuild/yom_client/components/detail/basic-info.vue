<template>
    <v-flex xs12>
        <v-card color="white">
            <v-card-text>
                <v-text-field class="mx-auto"
                              color="themeColor"
                              label="Project name"
                              v-model="projName"
                ></v-text-field>
                <v-text-field
                        color="themeColor"
                        label="Some more info you want tell us"
                        append-icon="edit"
                        v-model="description"
                ></v-text-field>
            </v-card-text>
        </v-card>
    </v-flex>
</template>

<script>
    import { createNamespacedHelpers } from 'vuex'
    const { mapGetters } = createNamespacedHelpers('newProj');

    export default {
        name: "basic-info",
        data(){
           return{
               projName: '',
               description: ''
           }
        },
        computed: {
            ...mapGetters([
                'projNameShare',
                'descriptionShare'
            ])
        },
        watch: {
            projName(){
                this.$store.commit('newProj/setProjNameShare', this.projName);
            },
            description(){
                this.$store.commit('newProj/setDescriptionShare', this.description);
            },
            projNameShare(){
                this.projName = this.projNameShare;
                this.description = this.descriptionShare;
            }

        },
        mounted(){
            const state = this.$store.state.newProj;
            if (state.projNameShare){ this.projName = state.projNameShare }
            if (state.descriptionShare){ this.description = state.descriptionShare }

        }
    }
</script>

<style scoped>

</style>