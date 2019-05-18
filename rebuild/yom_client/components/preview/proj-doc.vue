<template>
    <v-layout color="white"
              column
              wrap
    >
        <v-flex class="font-weight-medium"
                align-self-center
                mb-3>
            <h1>{{projNameShare || 'No project name'}}</h1>
        </v-flex>
        <v-flex>
            <div>
                <p class="subheading"><strong>Description:</strong>{{descriptionShare || 'No description'}}</p>
            </div>
        </v-flex>
        <v-flex mb-3
                v-for="(cat, index) in checkedCatsTree"
                :key="index">
            <h2>{{index+1}}.{{cat.category ? cat.category.catName : cat.catName}}</h2>
            <ul>
                <li v-for="(child,index) in cat.childNodes"
                    :key="index">
                    <h3 class="subheading"><strong>{{child.category ? child.category.catName : child.catName}}</strong></h3>
                    <h4 class="body-2">Time Cost: {{child.category ? child.category.timeCost : child.timeCost}} h</h4>
                    <h4 class="body-2" v-if="child.category && child.category.comment">Note:</h4>
                    <h4 class="body-2" v-if="child.comment">Note:</h4>
                    <p v-if="child.category && child.category.comment" class="content ">{{child.category.comment}}</p>
                    <p v-if="child.comment" class="content ">{{child.comment}}</p>
                    <h4 class="body-2">Description:</h4>
                    <p class="content">{{child.category ? child.category.description : child.description}}</p>
                </li>
            </ul>
        </v-flex>
        <v-flex>
            <v-divider color="black"></v-divider>
        </v-flex>
        <v-flex align-self-end
                py-2
                mb-3>
            <div>
                <span>Total Time: </span>
                <span>{{timeTotal || '0'}} h</span>
            </div>
        </v-flex>
        <v-flex align-self-center
                class="flex-width">
            <v-btn class="themeColor btn white--text mx-auto"
                   v-if="isEdit"
                   :to="`/detail/${id}`">Edit</v-btn>
            <v-btn class="themeColor btn white--text mx-auto"
                   @click="validateProjName">Save</v-btn>
            <v-btn class="themeColor btn white--text mx-auto"
                   @click="$emit('show-imgdialog', true)" >GENERATE PICTURE</v-btn>
        </v-flex>

    </v-layout>

</template>

<script>
    import { createNamespacedHelpers } from 'vuex'
    const { mapGetters } = createNamespacedHelpers('newProj')

    export default {
        name: "proj-doc",
        computed: {
            ...mapGetters([
                'projNameShare',
                'descriptionShare',
                'selectedCatsShare',
                'timeTotal',
                'checkedCatsTree'
            ]),
            id(){
                return this.$route.params.id
            }
        },
        props: {
            isEdit: Boolean
        },
        methods: {
            validateProjName(){
                console.log('validateProjName');
                if (this.projNameShare) {
                    console.log('tip');
                    this.$emit('show-tipdialog', true);
                }

                else {
                    console.log('fill');
                    this.$emit('show-filldialog', true);
                }
            },
            saveAsImage(){
                console.log('saveAsImage');
                this.$emit('show-imgdialog', true)
            }
        }
    }
</script>

<style scoped>
    .flex-width{
        width: 60%;
    }
    .btn{
        width: 100%;
    }
    .content{
        padding: 3px;
        border: 1px dashed rgba(30, 33, 37, 0.37);
        border-radius: 3px;
    }
</style>