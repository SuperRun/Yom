<template>
    <div>
        <v-timeline dense
                    v-for="(proj, index) in projects"
                    :key="index"
        >
            <v-timeline-item
                    v-bind:color="itemColor[index%itemColor.length]"
                    small>
                <v-layout row
                          pa-2
                          pl-3
                          class="white elevation-3"
                          @click="edit(proj.id)">
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
    </div>
</template>
<script>
    export default {
        name: 'ProjItem',
        data(){
           return {
               itemColor:[
                   'timelineColor1',
                   'timelineColor2',
                   'timelineColor3'
               ]
           }
        },
        props: {
            projects: Array
        },
        computed: {
            itemColorText() {
                return this.itemColor.map((item)=>{
                    return item += '--text';
                });
            }
        },
        mounted(){
            console.log('Component: proj-item');
            console.log(this.itemColorText);
        },
        methods: {
            edit (id) {
                this.$router.push(`/preview/${id}`)
            }
        }
    }
</script>