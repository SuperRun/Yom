<template>
    <v-container>
        <v-timeline dense
                    v-for="(proj, index) in projects"
                    :key="index"
        >
            <v-timeline-item
                    v-bind:color="itemColor[index%itemColor.length]"
                    small
            >
                <v-layout row
                          pa-2
                          pl-3
                          class="white elevation-3">
                    <v-flex xs3>
                        <h3 v-bind:class="[itemColorText[index%itemColorText.length],'display-1', 'font-weight-bold']">
                            {{proj.created_at.split('T')[0].split('-')[2]}}
                        </h3>
                        <p>{{proj.created_at.split('T')[0].split('-')[1] + '.' + proj.created_at.split('T')[0].split('-')[0]}}</p>
                    </v-flex>
                    <v-flex xs9>
                        <h3>{{proj.projName || 'Project Name'}}</h3>
                        <p>{{proj.description || 'No description.'}}</p>
                    </v-flex>
                </v-layout>
            </v-timeline-item>
        </v-timeline>
    </v-container>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "project",
      middleware: 'authenticated',
      layout: "common",
        data(){
            return {
                itemColor:[
                    'timelineColor1',
                    'timelineColor2',
                    'timelineColor3'
                ],
                projects: []
            }
        },
        computed: {
            itemColorText() {
                return this.itemColor.map((item)=>{
                    return item += '--text';
                });
            }
        },
        async created () {
            this.projects = await axios.get('http://localhost:1337/projects',{
                params: {
                    isActive:1,
                    user:1,
                    _sort:'created_at:DESC'
                }
            })
            .then((res)=>{
                console.log(res.data);
                return res.data
            });
        }
    }
</script>

<style scoped>
    .month-color{
        color: #d09796;
    }
</style>
