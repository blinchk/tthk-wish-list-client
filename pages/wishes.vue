<template>
  <v-layout wrap :align-center="loading">
    <v-col cols="12">
      <template v-if="loading">
        <v-row class="justify-center">
          <v-progress-circular indeterminate color="primary"/>
        </v-row>
      </template>
      <template v-else-if="wishes && user">
        <v-row v-for="wish in wishes" :key="wish.id" class="mb-3 justify-center">
          <v-card width="700px" max-width="700px">
            <v-card-title>{{ wish.name }} <v-spacer/><div class="subtitle-1"><v-avatar size="28" :color="avatarColor(userFullname(wish.user))" class="mr-1">{{ userInitials(wish.user) }}</v-avatar>
              {{ userFullname(user) }}</div></v-card-title>
            <v-divider/>
            <v-card-text>
              <p>{{ wish.description }}</p>
            </v-card-text>
            <v-card-actions>
              <span class="ml-1 text-caption">{{
                  moment(wish.creationTime).format('HH:mm DD.MM.YYYY')
                }}</span>
              <v-spacer/>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-row>
      </template>
      <template v-else-if="!loading && !wishes">
        <v-container>
          <v-row class="justify-center">
            <span>There is nothing, maybe you like to add new wish?</span>
          </v-row>
        </v-container>
      </template>
    </v-col>
  </v-layout>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import randomMC from 'random-material-color'
import moment from 'moment'

export default {
  name: "wishes",
  data() {
    return {
      loading: false,
      moment
    }
  },
  beforeMount() {
    this.loading = true
    console.log('hello')
  },
  mounted() {
    if (this.user) {
      this.getWishes().then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    } else {
      this.getUser().then(() => {
        this.getWishes().then(() => {
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      }).catch(() => {
        this.loading = false
      })
    }
  },
  computed: {
    ...mapState('wishes', ['wishes']),
    ...mapState(['user'])
  },
  methods: {
    ...mapActions('wishes', ['getWishes']),
    ...mapActions(['getUser']),
    userFullname(user) {
      return user.firstName + ' ' + user.lastName
    },
    userInitials(user) {
      return user.firstName[0] + user.lastName[0]
    },
    avatarColor(fullName) {
      return randomMC.getColor({ text: fullName })
    }
  }
}
</script>

<style scoped>

</style>
