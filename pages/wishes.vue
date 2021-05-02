<template>
  <v-layout wrap>
    <template v-if="loading">
      <v-col cols="12">
        <v-row>

        </v-row>
      </v-col>
    </template>
    <template v-else-if="wishes && user">
      <v-col cols="12">
        <v-row v-for="wish in wishes" :key="wish.id" class="mb-3 justify-center">
          <v-card width="700px" max-width="700px">
            <v-card-title>{{ wish.name }}</v-card-title>
            <v-card-subtitle><v-avatar color="primary" size="28">{{userInitials(wish.user)}}</v-avatar> {{userFullname(wish.user)}}</v-card-subtitle>
            <v-card-text>
              <template v-if="wishes">
                <p>{{ wish.description }}</p>
              </template>
            </v-card-text>
          </v-card>
        </v-row>
      </v-col>
    </template>
  </v-layout>
</template>

<script>
import {mapActions, mapState} from 'vuex'

export default {
  name: "wishes",
  data() {
    return {
      loading: false
    }
  },
  mounted() {
    this.loading = true
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
    }
  }
}
</script>

<style scoped>

</style>
