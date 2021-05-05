<template>
  <v-layout>
    <v-col cols="12">
      <template v-if="loading">
        <v-row class="justify-center">
          <v-progress-circular color="primary" indeterminate/>
        </v-row>
      </template>
      <template v-else-if="profile">


        <v-row class="justify-center">
          <v-card elevation="3" max-width="500px" width="500px">
            <v-card-title>Profile overview</v-card-title>
            <v-card-text>
              <v-text-field v-model="firstName" :value="profile.firstName" label="First name"></v-text-field>
              <v-text-field v-model="lastName" :value="profile.lastName" label="Last name"></v-text-field>
            </v-card-text>
            <v-col class="mb-2 text-right">
              <v-btn :loading="editLoading" color="success" text @click.stop="editProfile()">
                <v-icon left> mdi-pencil</v-icon>
                Edit
              </v-btn>
            </v-col>

          </v-card>
        </v-row>
      </template>
    </v-col>

  </v-layout>
</template>

<script>
import {mapActions, mapState} from 'vuex'

export default {
  name: "profile",
  data() {
    return {
      loading: false,
      editLoading: false,
      firstName: '',
      lastName: ''
    }
  },
  mounted() {
    if (!this.accessToken) {
      this.checkForToken()
    } else if (this.user) {
      this.getProfile().then(() => {
        this.loading = false
        this.firstName = this.profile.firstName
        this.lastName = this.profile.lastName
      })
    }
  },
  computed: {
    ...mapState('profile', ['profile']),
    ...mapState(['user', 'accessToken'])
  },
  methods: {
    ...mapActions('profile', ['getProfile']),
    ...mapActions(['checkForToken']),
    editProfile() {
      this.editLoading = true
      if (this.accessToken) {
        this.$store.dispatch('profile/editProfile', {
          firstName: this.firstName,
          lastName: this.lastName
        }).then(() => {
          this.editLoading = false
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
