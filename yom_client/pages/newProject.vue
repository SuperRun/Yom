
<template>
  <div id="app">
    <v-app id="inspire">
      <div

      >
        <v-toolbar
          class="themeColor"
        >
          <v-btn icon>
            <v-icon color="#ffffff">keyboard_backspace</v-icon>
          </v-btn>
          <v-toolbar-title class=" white--text">Detail</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      <v-form>
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
                  <v-card-text>
                  <p class="texttheme">{{ radios || 'null' }}</p>
                  <v-radio-group v-model="radios" :mandatory="false">
                    <v-radio label="subcategory 1" value="radio-1"></v-radio>
                    <v-radio label="subcategory 2" value="radio-2"></v-radio>
                  </v-radio-group>
                  <p class="texttheme">Category2</p>
                  <v-radio-group v-model="radios" :mandatory="false">
                    <v-radio label="subcategory 1" value="radio-1"></v-radio>
                    <v-radio label="subcategory 2" value="radio-2"></v-radio>
                  </v-radio-group>
                  </v-card-text>
                  <v-layout column
                            align-center
                            justify-center
                            mt-5
                  >
                    <v-btn  bottom="true"class="themeColor white--text btn mx-auto">Preview</v-btn>
                  </v-layout>

                </v-card>
              </v-flex>

            </v-layout>
          </v-container>
      </v-form>
      </div>
    </v-app>
  </div>
</template>

<script>
  export default {
    el: '#app',
    data () {
      return {
        radios: 'Category1',
      }
    }
  }
</script>

<style>
  #main{
    width: 100%;
    height: 100%;
    background-size: contain;
    flex-direction:column;
    justify-content: space-between;
  }
  .texttheme{
    color:#D4A079;
    font-size: 150%;
  }
  #container{
    width: 100%;
    height: 100%;
  }
  .flex-width{
    width: 30%;
  }
  .btn{
    width: 50%;
  }
</style>
