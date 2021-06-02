<template>
  <v-layout wrap>
    <v-col cols="12">
      <v-row class="mb-3 justify-center">
        <v-card v-if="!loading" :loading="loading" elevation="3" max-width="700px" width="700px">
          <v-card-title>User info</v-card-title>
          <v-list>
            <v-avatar :color="avatarColor(userFullname(profile.user))" class="ml-3" size="70">
              {{ userInitials(profile.user) }}
            </v-avatar>
            {{ profile.user.firstName }} {{ profile.user.lastName }}
          </v-list>
          <v-col :hidden="profile.user.id === this.user.id" class="text-right">
            <v-btn v-if="!profile.following" :loading="followLoading" color="success"
                   @click.stop="followUser(profile.user.id)">
              <v-icon class="mr-1">mdi-account-plus-outline</v-icon>
              Follow
            </v-btn>
            <v-btn v-else-if="profile.following" :loading="followLoading" color="error"
                   @click.stop="followUser(profile.user.id)">
              <v-icon class="mr-1">mdi-account-minus-outline</v-icon>
              Unfollow
            </v-btn>
          </v-col>

        </v-card>
      </v-row>
      <template v-if="loading">
        <v-row class="justify-center">
          <v-progress-circular color="primary" indeterminate></v-progress-circular>
        </v-row>
      </template>
      <template v-if="!loading">
        <v-row v-for="wish in profile.wishes"
               :key="wish.id"
               class="mb-3 justify-center">
          <v-card elevation="3" max-width="700px" width="700px">
            <v-card-title>{{ wish.name }}
              <v-spacer/>
              <div class="subtitle-1">
                <v-avatar
                  :color="avatarColor(userFullname(wish.user))"
                  class="mr-1"
                  size="28"
                >{{ userInitials(wish.user) }}
                </v-avatar>
              </div>
            </v-card-title>
            <v-divider/>
            <v-card-text v-if="wish.description">
              <p>{{ wish.description }}</p>
            </v-card-text>
            <v-card-actions class="px-2">
              <v-row class="align-center">
                <v-col cols="6">
                  <span class="ml-2 text--secondary">
                    {{ moment(wish.creationTime).format('HH:mm DD.MM.YYYY') }}
                  </span>
                </v-col>
                <v-col class="text-right" cols="6">
                  <v-btn v-if="wish.likes" icon @click.stop="showLiked(wish)">
                    {{ wish.likes }}
                  </v-btn>
                  <v-dialog v-model="showPeople" max-width="500px">
                    <v-card>
                      <v-card-title>People who liked this wish...</v-card-title>
                      <v-card-text v-for="like in likes" :key="like.id">
                        <v-avatar :color="avatarColor(userFullname(like.user))" class="mr-1" size="35">
                          {{ userInitials(like.user) }}
                        </v-avatar>
                        {{ like.user.firstName }} {{ like.user.lastName }}
                      </v-card-text>
                    </v-card>
                  </v-dialog>
                  <v-btn :color="wish.liked ? 'pink' : 'white' " icon @click.stop="toggleLike(wish)">
                    <v-icon>mdi-heart</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
            <v-divider/>
          </v-card>
        </v-row>
      </template>
    </v-col>
  </v-layout>
</template>

<script>
import {mapActions, mapMutations, mapState} from 'vuex'
import moment from 'moment'
import randomMC from 'random-material-color'

export default {
  name: "user",
  data() {
    return {
      loading: false,
      showPeople: false,
      followLoading: false,
      cantfollow: false,
      moment
    }
  },
  created() {
    this.loading = true
  },
  mounted() {
    if (!this.accessToken) {
      this.loading = this.checkForToken()
    } else if (this.user) {
      this.getUserProfile(this.$route.query.id)
    }
  },
  computed: {
    ...mapState('users', ['profile']),
    ...mapState('wishes', ['likes']),
    ...mapState(['user', 'accessToken'])
  }
  ,
  methods: {
    ...mapActions(['getUser, checkForToken']),
    ...mapMutations(['createNewAlert']),
    getUserProfile(user) {
      this.$store.dispatch('users/getUserProfile', {
        id: user
      }).then(() => {
        this.loading = false
      })
    }
    ,
    userFullname(user) {
      return user.firstName + ' ' + user.lastName
    }
    ,
    userInitials(user) {
      return user.firstName[0] + user.lastName[0]
    }
    ,
    avatarColor(fullName) {
      return randomMC.getColor({text: fullName})
    }
    ,
    toggleLike(wish) {
      this.$store.dispatch('wishes/addLike', {
        connection: wish.id
      }).then(() => {
        this.getUserProfile(this.$route.query.id)
      })
    }
    ,
    showLiked(wish) {
      this.showPeople = true
      this.$store.dispatch('wishes/peopleLiked', {
        wish: wish
      })
    }
    ,
    followUser(user) {
      this.$store.dispatch('users/followUser', {
        id: user
      }).then(() => {
        this.getUserProfile(this.$route.query.id)
        this.followLoading = false
      })
    }
    ,
  }
}
</script>

<style scoped>

</style>
