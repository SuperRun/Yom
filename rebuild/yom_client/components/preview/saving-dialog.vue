<template>
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

</template>

<script>
    export default {
        name: "saving-dialog",
        data(){
            return {
                savingDialog: true
            }
        }
    }
</script>

<style scoped>

</style>