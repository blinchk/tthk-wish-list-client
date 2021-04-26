<template>
  <v-layout align-center justify-center>
    <v-card elevation="3" max-width="500px">
      <v-card-title>Register New Account</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="firstName" label="First Name"/>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="lastName" label="Last Name"/>
          </v-col>
        </v-row>
        <v-text-field v-model="username" label="E-mail" type="email"/>
        <v-text-field v-model="password" label="Password" type="password"/>
      </v-card-text>
      <v-card-actions class="text-right">
        <v-spacer/>
        <v-btn class="text-right" color="success" text>
          <v-icon left>
            mdi-account-plus
          </v-icon>
          Sign Up
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
export default {
  name: 'Register',
  data () {
    return {
      username: '',
      password: '',
      firstName: '',
      lastName: ''
    }
  }
}
</script>

<style scoped>

</style>
