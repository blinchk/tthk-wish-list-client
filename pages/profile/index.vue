<template>
  <v-layout wrap>
    <v-col cols="12">
      <v-row class="mb-3 justify-center">
        <v-card elevation="3" max-width="700px" width="700px">
          <v-form>
            <v-card-title>Who do you want to find?</v-card-title>
            <v-card-text>
              <v-text-field
                prepend-icon="mdi-magnify"
                v-model="searchQuery"
                label="Name"
                type="text"
              ></v-text-field>
            </v-card-text>
          </v-form>
        </v-card>
      </v-row>
      <template v-if="loading">
        <v-row class="justify-center">
          <v-progress-circular color="primary" indeterminate/>
        </v-row>
      </template>

      <template v-else-if="users && user">
        <v-row
          v-for="_user in searchedUsers"
          :key="_user.id"
          class="mb-3 justify-center"

        >
          <v-card elevation="3" max-width="700px" width="700px" class="px-3">
            <nuxt-link id="profile-link" :to="{ path: `/profile/${_user.id}` }" exact>
              <v-list>

                <v-list-item-avatar class="mx-2">
                  <v-avatar :color="avatarColor(userFullname(_user))"

                  >
                    {{ userInitials(_user) }}
                  </v-avatar>
                </v-list-item-avatar>
                <v-card-text v-if="_user.id === user.id" class="d-inline"> You</v-card-text>
                <v-card-text v-else class="d-inline"> {{ _user.firstName }} {{ _user.lastName }}</v-card-text>
              </v-list>
            </nuxt-link>
          </v-card>
        </v-row>
      </template>
    </v-col>
  </v-layout>
</template>

<script>
import {mapActions, mapMutations, mapState} from 'vuex'
import randomMC from 'random-material-color'
import moment from 'moment'

export default {
  name: 'index.vue',
  data() {
    return {
      loading: false,
      searchQuery: '',
      moment,
    }
  },
  created() {
    this.loading = true
  },
  mounted() {
    if (!this.accessToken) {
      this.loading = this.checkForToken()
    } else if (this.user) {
      this.getUsers()
        .then(() => {
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    } else {
      this.getUser()
        .then(() => {
          this.getUsers()
            .then(() => {
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {
          this.loading = false
          this.throwAccessDenied()
        })
    }

  },
  computed: {
    ...mapState('users', ['users']),
    ...mapState(['user', 'accessToken']),
    searchedUsers() {
      if (!this.searchQuery.trim()) return this.users;
      return this.users.filter(user => this.userFullname(user).toLowerCase().includes(this.searchQuery.trim().toLowerCase()))
    }
  },
  methods: {
    ...mapActions('users', ['getUsers']),
    ...mapActions(['getUser', 'checkForToken']),
    ...mapMutations(['createNewAlert']),
    userFullname(user) {
      return user.firstName + ' ' + user.lastName
    },
    userInitials(user) {
      return user.firstName[0] + user.lastName[0]
    },
    avatarColor(fullName) {
      return randomMC.getColor({text: fullName})
    }
  }
}
</script>

<style lang="scss" scoped>
#profile-link {
  color: white;
  text-decoration: none;
}

</style>

