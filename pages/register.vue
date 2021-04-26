<template>
  <v-layout align-center justify-center>
    <v-card elevation="3" max-width="500px">
      <v-card-title>Register New Account</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="firstName" :rules="rules.name" label="First Name" prepend-icon="mdi-account"/>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="lastName" label="Last Name" hint="Optional"/>
          </v-col>
        </v-row>
        <v-text-field v-model="username" :rules="rules.email" label="E-mail" prepend-icon="mdi-at" type="email"/>
        <v-text-field v-model="password" :rules="rules.password" label="Password" prepend-icon="mdi-lock"
                      type="password"/>
      </v-card-text>
      <v-card-actions class="text-right">
        <v-spacer/>
        <v-btn :loading="loading" :disabled="!validateFields" class="text-right" color="success" text
               @click.stop="registration">
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
import { mapActions } from 'vuex'

export default {
  name: 'Register',
  data() {
    return {
      validationText: '',
      rules: {
        name: [val => (val || '').length > 0 || 'This field is required!'],
        password: [val => this.validPass(val) || this.validationText],
        email: [val => this.validEmail(val) || 'Invalid email!']
      },
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      loading: false
    }
  },
  computed: {
    validateFields() {
      return this.validPass(this.password) && this.validEmail(this.username) && this.validName(this.firstName)
    }
  },
  methods: {
    ...mapActions({
      registerUser: 'registerUser'
    }),
    async registration() {
      this.loading = true
      this.registerUser({
        username: this.username,
        password: this.password,
        firstName: this.firstName,
        lastName: this.lastName
      }).then(() => {
        this.loading = false
        this.$router.push('/')
      }).catch((e) => {
        this.loading = false
        this.text = e
      })
    },
    validEmail: function (email) {
      let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    validPass: function (password) {
      if (password.length === 0) {
        this.validationText = 'This field is required!'
        return false
      } else if (password.length < 8) {
        this.validationText = 'The password must be at least 8 characters long'
        return false
      }
      return true
    },
    validName: function (name) {
      return name.length >= 2
    }
  }
}
</script>

<style scoped>

</style>
