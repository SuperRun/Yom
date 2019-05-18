<template>
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
                <v-btn color="green darken-1" flat @click="$emit('show-filldialog', false)">Close</v-btn>
                <v-btn color="green darken-1" flat @click="saveProjName">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>

<script>
    export default {
        name: "fill-dialog",
        data(){
            return {
                projName: '',
                fillDialog: true
            }
        },
        methods: {
            saveProjName(){
                this.$store.commit('newProj/setProjNameShare',this.projName);
                this.$emit('show-filldialog', false);
            }
        }
    }
</script>

<style scoped>

</style>