<template>
    <EasyRefresh :userSelect="false"
                 :loadMore="loadMore">
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
            <div class="title
             grey--text
             text-lighten-1"
                 mt-5
                 v-if="!projects.length">There is no project.</div>
        </v-container>
    </EasyRefresh>
</template>

<script>
    import axios from 'axios'
    import Vue from 'vue'
    import EasyRefresh from 'vue-easyrefresh'
    Vue.use(EasyRefresh)

    export default {
        name: "project",
        layout: "common",
        data(){
            return {
                itemColor:[
                    'timelineColor1',
                    'timelineColor2',
                    'timelineColor3'
                ],
                projects: [],
                moreProjects: [],
                startTime: '',
                endTime: '',
                projName: '',
                limit: 10,
                page: 1,
                count: 0
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
            await this.getProjects();
            this.projects=this.moreProjects;
            await this.getCount();
        },
        methods:{
            async loadMore(done){
                if ((this.page * this.limit) <= this.count) {
                    ++this.page;
                    await this.getProjects();
                    this.projects = this.projects.concat(this.moreProjects);
                    done(true);
                } else {
                    done(false);
                }
            },
            async getProjects(){
                const { endTime, projName, startTime } = this.$route.query;

                this.moreProjects = await axios.get('http://localhost:1337/projects',{
                    params: {
                        isActive:1,
                        user:1,
                        _sort:'created_at:DESC',
                        _start: (this.page-1)*this.limit,
                        _limit: this.limit,
                        createTime_lte: endTime,
                        createTime_gte: startTime,
                        projName_contains: projName
                    }
                }).then((res)=>{
                        console.log(res.data);
                        return res.data
                });
            },
            async getCount(){
                this.count =await axios.get('http://localhost:1337/projects/count',{
                    params: {
                        isActive:1,
                        user:1
                    }
                }).then((res)=>{
                    console.log(res.data);

                    return res.data
                });
            }
        }
    }
</script>

<style scoped>
    .month-color{
        color: #d09796;
    }
</style>