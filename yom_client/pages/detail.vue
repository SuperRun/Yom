<template>
    <v-container
            fluid
            grid-list-lg
    >
        <v-layout row wrap>
            <v-flex xs12>
                <v-card color="white">
                    <v-card-text>
                        <v-text-field class="mx-auto"
                                      color="#D4A079"
                                      label="Project name"
                                      required
                        ></v-text-field>
                        <v-text-field
                                color="#D4A079"
                                label="Some more info you want tell us"
                                append-icon="edit"
                        ></v-text-field>
                    </v-card-text>
                </v-card>
            </v-flex>


            <v-flex xs12>
                <v-card color="white" >
                    <v-card-text v-for="cat in catTree">
                        <h2 class="themeColor--text">{{cat.category.catName}}</h2>
                        <v-checkbox v-for="child in cat.childNodes"
                                    v-model="selectedCats"
                                    :label="`${child.category.catName}`"
                                    :value="child.id"></v-checkbox>
                    </v-card-text>

                    <v-layout column
                              align-center
                              justify-center
                              pb-2
                    >
                        <v-btn class="themeColor btn white--text mx-auto">Preview</v-btn>
                    </v-layout>
                </v-card>
            </v-flex>

        </v-layout>
    </v-container>
</template>



<script>
    import axios from 'axios'

    export default {
    layout: 'common',
      middleware: 'authenticated',
    data () {
      return {
          selectedCats:[],
          catTree: []
      }
    },
    computed:{
        type: function () {
            return this.$route.query.type;
        }
    },
    async created () {
        this.catTree = this.convertToCatTree(
            await axios.get("http://localhost:1337/catconfigs",{
                params: {
                    projtype: this.type,
                    isActive: 1
                }
            }).then((res) => {
                console.log(res.data);
                return res.data;
            })
        );
    },
    methods: {
        convertToCatTree (catList) {
            let catTree= catList.filter(cat =>{
               return cat.category.parentId === null;
            });
            let childNodes= catList.filter(cat =>{
                return cat.category.parentId != null;
            });
            for (let cat of catTree) {
                Object.assign(cat, {childNodes: []});
                for (let child of childNodes) {
                    if (child.category.parentId === cat.category.id) {
                        cat.childNodes.push(child);
                    }
                }
            }
            console.log(catTree);
            return catTree;
        }
    }
  }
</script>

<style>
  .btn{
    width: 50%;
  }
</style>
