<template>
  <v-layout align-center justify-center>
    <v-card elevation="3" max-width="500px">
      <v-form @submit.prevent="auth">
        <v-card-title>Login</v-card-title>
        <v-card-text>
          <v-text-field v-model="email" label="E-mail" prepend-icon="mdi-at" type="email" :rules="rules.email"/>
          <v-text-field v-model="password" label="Password" prepend-icon="mdi-lock"
                        type="password"/>
        </v-card-text>
        <v-card-actions class="text-right">
          <v-spacer/>
          <v-btn :loading="loading" class="text-right" color="success" text type="submit" :disabled="fieldsIsBlank">
            <v-icon left>
              mdi-login
            </v-icon>
            Sign In
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      validationText: '',
      rules: {
        email: [val => this.validEmail(val) || 'Invalid email!']
      },
    }
  },
  computed: {
    ...mapState(['accessToken']),
    fieldsIsBlank() {
      return this.password.length === 0 || !this.validEmail(this.email)
    }
  },
  beforeMount() {
    if(this.accessToken) {
      this.$router.push('/')
    }
  },
  methods: {
    ...mapActions(['authUser', 'getUser']),
    async auth() {
      let email = this.email
      let password = this.password
      this.loading = true
      this.authUser({
        email: email,
        password: password
      }).then(() => {
        this.loading = false;
        if (this.accessToken) {
          this.getUser()
        }
        this.$router.push('/')
      }).catch(() => {
        this.loading = false
      })
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
    validEmail: function (email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
  }
}
</script>

<style scoped>

</style>
