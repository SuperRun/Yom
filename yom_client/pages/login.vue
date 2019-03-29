
<template>
  <div id="main">
    <v-layout column justify-space-between id="container">
      <v-layout mt-5></v-layout>
      <div align="center">
      <v-flex xs12>  <v-img src="/login/logo.png" width="50%" ></v-img></v-flex>
      </div>
      <v-flex xs12>
        <v-layout column
                  align-center
                  justify-center
                  mt-5
        >
                <v-flex xs12>
                  <v-form>
                      <v-text-field class="mx-auto white--text"
                                    background-color="rgba(255,250,250,0.5)"
                                    label="USERNAME"
                                    box
                                    required
                      ></v-text-field>
                  <v-text-field
                    v-model="password"
                    background-color="rgba(255,250,250,0.5)"
                    :append-icon="show1 ? 'visibility' : 'visibility_off'"
                    :rules="[rules.required, rules.min]"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    label="PASSWORD"
                    hint="At least 6 characters"
                    counter
                    box
                    @click:append="show1 = !show1"
                  ></v-text-field>
                    <v-layout column
                              align-center
                              justify-center
                    >
                    <v-btn  color="#3d4047" class="white--text btn-width">login</v-btn>
                    </v-layout>
                  </v-form>
                </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        show1: false,
        show2: true,
        password: 'Password',
        rules: {
          required: value => !!value || 'Required.',
          min: v => v.length >= 6 || 'Min 6 characters',
          userMMatch: () => ('The username and password you entered don\'t match')
        }
      }
    }
  }
</script>
<style>
  #main{
    width: 100%;
    height: 100%;
    background-image: url("/login/login.jpg");
    background-size: cover;
    flex-direction:column;
    justify-content: space-between;
  }
  #container{
    width: 100%;
    height: 100%;
  }
  .flex-width{
    width: 60%;
  }
  .btn-width{
    width: 100%;
  }
</style>
