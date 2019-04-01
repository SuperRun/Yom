<template>
    <v-container>
        <v-timeline dense>
            <v-timeline-item small
                             fill-dot>
                <v-timeline-item
                        color="purple lighten-2"
                        fill-dot
                        small
                >
                    <v-card>
                        <v-card-title class="purple lighten-2">
                            <v-icon
                                    dark
                                    size="42"
                                    class="mr-3"
                            >
                                mdi-magnify
                            </v-icon>
                            <h2 class="display-1 white--text font-weight-light">Title 1</h2>
                        </v-card-title>
                        <v-container>
                            <v-layout>
                                <v-flex xs10>
                                    Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit.
                                </v-flex>
                                <v-flex xs2>
                                    <v-icon size="64">mdi-calendar-text</v-icon>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card>
                </v-timeline-item>
            </v-timeline-item>
        </v-timeline>
    </v-container>
</template>

<script>
    export default {
        name: "project",
        layout: 'common'
    }
</script>

<style scoped>
    .project-card{
        background-color: white;
    }
</style>