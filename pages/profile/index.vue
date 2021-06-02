<template>
  <v-layout wrap>
    <v-col cols="12">
      <v-row class="mb-3 justify-center">
        <v-card elevation="3" max-width="700px" width="700px">
          <v-form ref="wishAdditionForm" @submit.prevent="wishAdding">
            <v-card-title>Who do you want to find?</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="name"
                :rules="rules.name"
                label="Name"
                type="text"
              ></v-text-field>
            </v-card-text>
            <v-card-actions class="text-right">
              <v-col class="text-right">
                <v-btn
                  :disabled="!validWish"
                  :loading="additionIsLoading"
                  class="text-right"
                  color="success"
                  text
                  type="submit"
                >
                  <v-spacer/>
                  <v-icon left> mdi-magnify</v-icon>
                  Search
                </v-btn>
              </v-col>
            </v-card-actions>
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
          v-for="_user in users"
          :key="_user.id"
          class="mb-3 justify-center"
        >
          <v-card elevation="3" max-width="700px" width="700px">
            <div>
              <v-avatar :color="avatarColor(userFullname(_user))"
                        class="ml-2" size="50"
              >
                {{ userInitials(_user) }}
              </v-avatar>
              {{ _user.firstName }} {{ _user.lastName }}
            </div>
3
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
      deleteConfirmation: false,
      deleteIsLoading: {},
      showPeople: false,
      editIsLoading: {},
      selectedWish: null,
      wishInEdit: {
        name: '',
        description: ''
      },
      rules: {
        name: [(val) => val.length > 0 || 'This field is required!'],
      },
      name: '',
      description: '',
      additionIsLoading: false,
      likedUsersIsLoading: false,
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
    },


  }
}
</script>

<style scoped>

</style>
