<template>
  <v-container color="grey lighten-5">

    <v-layout color="white"
              column
              wrap
    >
      <v-flex class="headline font-weight-medium"
              align-self-center
              mb-3>
        {{projNameShare}}
      </v-flex>
      <v-flex>
        <div>
          <p><strong>Description:</strong>{{descriptionShare}}</p>
        </div>
      </v-flex>
      <v-flex mb-3
              v-for="(cat, index) in checkedCatsTree"
              :key="index">
        <h3>{{index+1}}.{{cat.category.catName}}</h3>
        <ul>
          <li v-for="(child,index) in cat.childNodes"
              :key="index">
            {{child.category.catName}}
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
          <span>{{timeTotal}} h</span>
        </div>
      </v-flex>
      <v-flex align-self-center
              class="flex-width">
        <v-btn class="themeColor btn white--text mx-auto" @click="tipDialog=true">Save</v-btn>
      </v-flex>
    </v-layout>

    <v-dialog
      v-model="tipDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Tip</v-card-title>

        <v-card-text>
          Do you want to save the project?
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="tipDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="saveProject"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
  </v-container>
</template>

<script>
  import { createNamespacedHelpers } from 'vuex'
  import axios from 'axios'
  const { mapGetters } = createNamespacedHelpers('newProj')

  export default {
    middleware: 'authenticated',
    name: "preview",
    layout: 'common',
    data(){
      return {
        tipDialog: false,
        savingDialog: false,
      }
    },
    computed: {
      ...mapGetters([
        'projNameShare',
        'descriptionShare',
        'selectedCatsShare',
        'catTree',
        'catList',
        'timeTotal',
        'checkedCatsTree'
      ])
    },
    created (){
      console.log(this.catList);
    },
    methods:{
      createProjHistoryCats(project) {
        const vm = this;
        const projhistorycats = [];
        console.log(vm.selectedCatsShare);
        Array.from(vm.catList, cat => {
          Object.assign(cat.category, {
            isChecked: vm.selectedCatsShare.find(selectedCat => selectedCat === cat.category.id) ? 1 : 0
          })
        });
        for (let cat of vm.catList) {
          let {catName, isChecked, parentId} = cat.category;
          let obj = {catName, isChecked, parentId, project};
          obj.catId = cat.category.id;
          projhistorycats.push(obj);
        }
        return projhistorycats;
      },
      async saveProjHistoryCats(project) {
        const vm = this;
        const projhistorycats = vm.createProjHistoryCats(project);
        console.log(projhistorycats)
        await axios.post('http://localhost:1337/projhistorycats', projhistorycats)
          .then((res) => {
            setTimeout(() => (vm.savingDialog = false), 1000);
          });
      },
      async saveProject() {
        const {projName, description} = this;
        const vm = this;
        vm.tipDialog = false;
        vm.savingDialog = true;
        await axios.post('http://localhost:1337/projects', {
          projName,
          description,
          user: 1 // it will be changed if login function is available
        }).then((res) => {
          const project = res.data.id;
          console.log(project);
          vm.saveProjHistoryCats(project);

        });
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
</style>
