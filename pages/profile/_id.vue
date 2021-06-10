<template>
  <v-layout wrap>
    <v-col cols="12">
      <template v-if="loading">
        <v-row class="justify-center">
          <v-progress-circular color="primary" indeterminate></v-progress-circular>
        </v-row>
      </template>
      <v-row class="mb-3 justify-center">
        <v-card v-if="!loading" :loading="loading" elevation="3" max-width="700px" width="700px">
          <v-card-title>User info</v-card-title>
          <v-list>
            <v-avatar :color="avatarColor(userFullname(profile.user))" class="mx-3" size="70">
              <h2>{{ userInitials(profile.user) }}</h2>
            </v-avatar>
            {{ profile.user.firstName }} {{ profile.user.lastName }}
          </v-list>
          <v-col :hidden="profile.user.id === this.user.id" class="text-right">
            <v-btn v-if="!profile.following" :loading="followLoading" color="success"
                   @click.stop="followUser(profile.user.id)"
            >
              <v-icon class="mr-1">mdi-account-plus-outline</v-icon>
              Follow
            </v-btn>
            <v-btn v-else-if="profile.following" :loading="followLoading" color="error"
                   @click.stop="followUser(profile.user.id)"
            >
              <v-icon class="mr-1">mdi-account-minus-outline</v-icon>
              Unfollow
            </v-btn>
          </v-col>

        </v-card>
      </v-row>
      <template v-if="!loading">
        <v-row v-for="wish in profile.wishes"
               :key="wish.id"
               class="mb-3 justify-center"
        >
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
              <v-tooltip v-if="wish.gifted" bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-if="profile.user.id !== user.id" v-bind="attrs" v-on="on" icon @click.stop="showGift(wish)">
                    <v-icon>mdi-gift</v-icon>
                  </v-btn>
                </template>
                <span>Show the gift.</span>
              </v-tooltip>
            </v-card-actions>
            <v-divider/>
          </v-card>
          <v-dialog v-model="giftDialogOpen" max-width="500px">
            <v-card v-if="currentGift">
              <v-card-title>{{ currentGift.title }}</v-card-title>
              <v-card-text><a :href="currentGift.link">Link to gift</a></v-card-text>
              <v-card-actions class="justify-end">
                <v-btn v-if="!currentGift.user_booked.id" :loading="bookingIsLoading" color="success" text
                       @click.stop="bookGift(currentGift.wish)"
                >
                  <v-icon left>mdi-gift</v-icon>
                  Book Gift
                </v-btn>
                <v-btn v-else-if="currentGift.user_booked.id === user.id" :loading="bookingIsLoading" color="error" text
                       @click.stop="bookGift(currentGift.wish)"
                >
                  <v-icon left>mdi-gift</v-icon>
                  Unbook Gift
                </v-btn>
                <v-btn v-else :loading="bookingIsLoading" color="error" disabled
                       text
                >
                  Gift is booked
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </template>
    </v-col>
  </v-layout>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import moment from 'moment'
import randomMC from 'random-material-color'

export default {
  name: 'user',
  data () {
    return {
      loading: false,
      showPeople: false,
      giftDialogOpen: false,
      followLoading: false,
      giftIsLoading: false,
      currentGift: null,
      bookingIsLoading: false,
      moment
    }
  },
  created () {
    this.loading = true
  },
  mounted () {
    this.checkForToken().then(() => {
      this.getUserProfile(this.$route.params.id)
      if (this.user) {
        this.getGifts(this.$route.params.id)
      }
    })
  },
  computed: {
    ...mapState('users', ['profile']),
    ...mapState('wishes', ['likes', 'gifts']),
    ...mapState(['user', 'accessToken'])
  }
  ,
  methods: {
    ...mapActions(['getUser', 'checkForToken']),
    ...mapMutations(['createNewAlert']),
    getUserProfile (user) {
      this.$store.dispatch('users/getUserProfile', {
        id: user
      }).then(() => {
        this.loading = false
      })
    }
    ,
    userFullname (user) {
      return user.firstName + ' ' + user.lastName
    }
    ,
    userInitials (user) {
      return user.firstName[0] + user.lastName[0]
    }
    ,
    avatarColor (fullName) {
      return randomMC.getColor({ text: fullName })
    }
    ,
    toggleLike (wish) {
      this.$store.dispatch('wishes/addLike', {
        connection: wish.id
      }).then(() => {
        this.getUserProfile(this.$route.params.id)
      })
    }
    ,
    showLiked (wish) {
      this.showPeople = true
      this.$store.dispatch('wishes/peopleLiked', {
        wish: wish
      })
    }
    ,
    followUser (user) {
      this.$store.dispatch('users/followUser', {
        id: user
      }).then(() => {
        this.getUserProfile(this.$route.params.id)
        this.followLoading = false
      })
    },
    getGifts (user) {
      this.$store.dispatch('wishes/getGifts', {
        user: user
      })
    },
    showGift (wish) {
      this.giftDialogOpen = true
      this.loadGift(wish)
    },
    loadGift (wish) {
      this.$store.dispatch('wishes/getGiftByWish', {
        wish: wish
      }).then((gift) => {
        this.giftIsLoading = false
        this.currentGift = gift
      })
    },
    bookGift (wish) {
      this.bookingIsLoading = true
      this.$store.dispatch('wishes/bookGift', {
        wish: wish
      }).then(() => {
        this.bookingIsLoading = false
        this.loadGift(wish)
      })
    }
  }
}
</script>

<style scoped>

</style>
