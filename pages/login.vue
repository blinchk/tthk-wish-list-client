<template>
  <v-layout align-center justify-center>
    <v-card elevation="3" max-width="500px">
      <v-card-title>Login</v-card-title>
      <v-card-text>
        <v-text-field v-model="email" label="E-mail" prepend-icon="mdi-at" type="email"/>
        <v-text-field v-model="password" label="Password" prepend-icon="mdi-lock"
                      type="password"/>
      </v-card-text>
      <v-card-actions class="text-right">
        <v-spacer/>
        <v-btn :loading="loading" class="text-right" color="success" text @click.stop="auth">
          <v-icon left>
            mdi-login
          </v-icon>
          Sign In
        </v-btn>
      </v-card-actions>
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
      loading: false
    }
  },
  computed: {
    ...mapState(['accessToken']),
  },
  mounted() {
    if (this.accessToken) {
      this.$router.push('/');
    }
  },
  methods: {
    ...mapActions(['authUser']),
    async auth() {
      let email = this.email
      let password = this.password
      this.loading = true
      this.authUser({
        email: email,
        password: password
      }).then(() => {
        this.loading = false;
        this.$router.push('/')
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
