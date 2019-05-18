<template>
    <v-dialog
            v-model="isOffline"
            max-width="290"
    >
        <v-card>
            <v-card-title class="headline">Tip</v-card-title>

            <v-card-text>
                Sorry, please check your network.
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                        color="green darken-1"
                        flat="flat"
                        @click="isOffline=false">
                    OK
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        name: "offline-tip",
        data(){
            return {
                isOffline: true
            }
        }

    }
</script>

<style scoped>

</style>